import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Quaternion,
  Vector3,
} from 'three';
import { ConvexHull } from 'three-stdlib';
import type { Ember } from '../types';

const MAX_POINTS = 40; // a hull of 40 points has ≤ 76 faces: the facet cap
const BASE_POINTS = 10; // even a one-hand ember should read as a cut stone, not folded paper
const SEAM_R = 0.005;

export function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic per ID. Point i never depends on n, so a new hand adds exactly one new vertex. */
export function emberPoints(id: string, n: number): Vector3[] {
  const rnd = mulberry32(hashString(id));
  const z0 = rnd();
  const t0 = rnd();
  return Array.from({ length: n }, (_, i) => {
    // R2 low-discrepancy sequence: every prefix is well spread, so small embers read as blunt solids
    const z = Math.max(-1, Math.min(1, ((z0 + i * 0.7548777) % 1) * 2 - 1 + (rnd() - 0.5) * 0.25));
    const t = (((t0 + i * 0.5698403) % 1) + (rnd() - 0.5) * 0.12) * Math.PI * 2;
    const r = 0.8 + rnd() * 0.4;
    const s = Math.sqrt(1 - z * z);
    return new Vector3(s * Math.cos(t) * r, z * r * 1.18, s * Math.sin(t) * r);
  });
}

function topology(points: Vector3[]) {
  const hull = new ConvexHull().setFromPoints(points);
  const index = new Map(points.map((p, i) => [p, i]));
  const tris: number[][] = [];
  const edges = new Map<string, [number, number]>();
  for (const f of hull.faces) {
    const loop: number[] = [];
    let e = f.edge;
    do {
      loop.push(index.get(e.head().point)!);
      e = e.next;
    } while (e !== f.edge);
    for (let k = 1; k < loop.length - 1; k++) tris.push([loop[0], loop[k], loop[k + 1]]);
    loop.forEach((a, k) => {
      const b = loop[(k + 1) % loop.length];
      const lo = Math.min(a, b), hi = Math.max(a, b);
      edges.set(`${lo}-${hi}`, [lo, hi]);
    });
  }
  return { tris, edges: [...edges.values()].sort((x, y) => x[0] - y[0] || x[1] - y[1]) };
}

/** Each hand adds one vertex and the seams meeting at it are theirs, so the newest hand always owns
 *  the newest vertex (which the forming animation depends on). The base vertices that exist before
 *  anyone has carried it are shared out across the hands, so no carrier is invisible and no single
 *  colour swamps the stone. Anyone still left without a seam borrows one. */
function seamCarriers(edges: [number, number][], hands: number, base: number): number[] {
  if (hands === 0) return edges.map(() => -1);
  const carrierOf = (v: number) => (v >= base ? Math.min(hands - 1, v - base) : Math.floor((v * hands) / base));
  const c = edges.map(([, b]) => carrierOf(b));
  const count = Array<number>(hands).fill(0);
  c.forEach((k) => count[k]++);
  for (let k = 0; k < hands; k++) {
    if (count[k] > 0) continue;
    const donor = count.indexOf(Math.max(...count));
    if (count[donor] < 2) break;
    const i = c.lastIndexOf(donor);
    c[i] = k;
    count[donor]--;
    count[k]++;
  }
  return c;
}

/** Pastels nearly vanish against a pastel stone, so seams render deeper than the sampled colour.
 *  Saturation is pulled DOWN, not up: boosted pastels turn primary and the stone reads as a toy. */
function seamColor(hex: string) {
  const c = new Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  return c.setHSL(hsl.h, Math.min(1, hsl.s * 0.85), hsl.l * 0.7);
}

const WHITE = new Color('#ffffff');
const Y = new Vector3(0, 1, 0);
const m4 = new Matrix4(), q = new Quaternion(), v = new Vector3(), s = new Vector3(), dir = new Vector3(), tmp = new Color();

export type EmberState = { formT?: number | null; highlight?: number[] | null; pulse?: number };

export class EmberObject {
  readonly group = new Group();
  readonly facets: number;
  private points: Vector3[];
  private live: Vector3[];
  private tris: number[][];
  private edges: [number, number][];
  private carriers: number[];
  private colors: Color[];
  private faceGeo = new BufferGeometry();
  private seams: InstancedMesh;
  private glow: InstancedMesh;
  private disposables: { dispose(): void }[] = [];
  private formFrom: Vector3 | null = null;
  private hands: number;

  constructor(ember: Ember) {
    this.hands = ember.marks.length;
    const n = Math.min(this.hands + BASE_POINTS, MAX_POINTS);
    this.points = emberPoints(ember.id, n);
    const box = new Box3().setFromPoints(this.points).getCenter(new Vector3());
    this.points.forEach((p) => p.sub(box));
    this.live = this.points.map((p) => p.clone());
    const topo = topology(this.points);
    this.tris = topo.tris;
    this.edges = topo.edges;
    this.facets = this.tris.length;
    this.carriers = seamCarriers(this.edges, this.hands, BASE_POINTS);
    this.colors = ember.marks.map((m) => seamColor(m.color));

    // Where the newest hand's vertex starts when it forms: flush with its neighbours, so it pushes out of the old surface.
    const newest = n - 1;
    if (this.hands > 0 && this.hands + BASE_POINTS <= MAX_POINTS) {
      const nb = this.edges.filter(([a, b]) => a === newest || b === newest).map(([a, b]) => (a === newest ? b : a));
      if (nb.length) this.formFrom = nb.reduce((acc, i) => acc.add(this.points[i]), new Vector3()).divideScalar(nb.length);
    }

    this.faceGeo.setAttribute('position', new BufferAttribute(new Float32Array(this.tris.length * 9), 3));
    const stone = new MeshPhysicalMaterial({
      color: '#DFD9F4',
      transmission: 0.7,
      thickness: 3.0,
      roughness: 0.42,
      metalness: 0,
      ior: 1.6,
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
      iridescence: 0.35,
      iridescenceIOR: 1.3,
      flatShading: true,
      // a little body so the stone reads as pastel stone, not glass, against a white page
      attenuationColor: new Color('#CFC0F2'),
      attenuationDistance: 0.9,
      specularIntensity: 1,
      envMapIntensity: 1,
    });
    this.group.add(new Mesh(this.faceGeo, stone));

    // Light trapped inside: an opaque core the transmissive stone refracts, tinted by everyone who carried it.
    const avg = this.colors.reduce((a, c) => a.add(c), new Color(0, 0, 0)).multiplyScalar(1 / Math.max(1, this.colors.length));
    const coreMat = new MeshBasicMaterial({ color: this.colors.length ? avg.lerp(WHITE, 0.35) : new Color('#EFEAFC'), toneMapped: false });
    const core = new Mesh(this.faceGeo, coreMat);
    core.scale.setScalar(0.5);
    this.group.add(core);

    const cyl = new CylinderGeometry(1, 1, 1, 6, 1, true);
    const seamMat = new MeshBasicMaterial({ toneMapped: false });
    const glowMat = new MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: 0.14, depthWrite: false });
    this.seams = new InstancedMesh(cyl, seamMat, Math.max(1, this.edges.length));
    this.glow = new InstancedMesh(cyl, glowMat, Math.max(1, this.edges.length));
    this.seams.frustumCulled = this.glow.frustumCulled = false;
    this.group.add(this.glow, this.seams);
    this.disposables.push(this.faceGeo, stone, coreMat, cyl, seamMat, glowMat, this.seams, this.glow);

    this.update({});
  }

  update({ formT = null, highlight = null, pulse = 0 }: EmberState) {
    const forming = formT !== null && formT < 1 && this.formFrom;
    const newest = this.points.length - 1;
    for (let i = 0; i < this.points.length; i++) this.live[i].copy(this.points[i]);
    if (forming) {
      const e = 1 - Math.pow(1 - formT, 3);
      this.live[newest].copy(this.formFrom!).lerp(this.points[newest], e);
    }

    const pos = this.faceGeo.getAttribute('position') as BufferAttribute;
    this.tris.forEach((t, i) => t.forEach((p, k) => pos.setXYZ(i * 3 + k, this.live[p].x, this.live[p].y, this.live[p].z)));
    pos.needsUpdate = true;
    this.faceGeo.computeVertexNormals();
    this.faceGeo.computeBoundingSphere();

    const hl = highlight ? new Set(highlight) : null;
    const bloom = formT !== null && formT < 1 ? Math.sin(Math.PI * Math.min(1, formT)) : 0;
    this.edges.forEach(([a, b], i) => {
      const k = this.carriers[i];
      const base = k >= 0 ? this.colors[k] : new Color('#B9AEDB');
      let r = SEAM_R;
      tmp.copy(base);
      if (hl) {
        if (hl.has(k)) r *= 1.9 + 0.5 * pulse;
        else {
          r *= 0.6;
          tmp.lerp(WHITE, 0.7);
        }
      }
      if (formT !== null && formT < 1 && k === this.hands - 1) {
        r *= 1 + 2.4 * bloom;
        tmp.copy(base).lerp(WHITE, (1 - formT) * 0.6);
      }
      const A = this.live[a], B = this.live[b];
      dir.subVectors(B, A);
      const len = dir.length();
      q.setFromUnitVectors(Y, dir.normalize());
      v.addVectors(A, B).multiplyScalar(0.5);
      this.seams.setMatrixAt(i, m4.compose(v, q, s.set(r, len, r)));
      this.seams.setColorAt(i, tmp);
      this.glow.setMatrixAt(i, m4.compose(v, q, s.set(r * 2.6, len, r * 2.6)));
      this.glow.setColorAt(i, tmp);
    });
    for (const im of [this.seams, this.glow]) {
      im.count = this.edges.length;
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
    }
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }
}

export function describeEmber(e: Ember) {
  const n = e.marks.length;
  const words = e.marks.map((m) => m.word).join(', ');
  return `Ember ${e.id}, a faceted crystal carried by ${n} ${n === 1 ? 'hand' : 'hands'}.${n ? ` Words left in it: ${words}.` : ''}`;
}
