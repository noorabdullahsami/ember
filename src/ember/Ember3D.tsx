import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Ember } from '../types';
import { EmberObject, describeEmber, hashString } from './EmberObject';

const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
export function useReducedMotion() {
  return useSyncExternalStore(
    (f) => (mq?.addEventListener('change', f), () => mq?.removeEventListener('change', f)),
    () => !!mq?.matches,
  );
}

const IDLE = (Math.PI * 2) / 20; // one revolution per 20s

type Spin = { x: number; y: number; vx: number; vy: number; dragging: boolean };

type Props = {
  ember: Ember;
  className?: string;
  highlight?: number[] | null;
  forming?: boolean; // play the newest hand's facet forming
  onTap?: () => void;
  label?: string;
  zoom?: number;
  halo?: boolean;
  appear?: boolean; // grow into place, for the crossing
};

export default function Ember3D({ ember, className = '', highlight = null, forming = false, onTap, label, zoom = 1, halo = true, appear = false }: Props) {
  const reduced = useReducedMotion();
  const spin = useRef<Spin>({ x: 0.32, y: (hashString(ember.id) % 628) / 100, vx: 0, vy: 0, dragging: false });
  const invalidate = useRef<() => void>(() => {});
  const drag = useRef<{ x: number; y: number; t: number; moved: number; lx: number; ly: number; lt: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const t = performance.now();
    drag.current = { x: e.clientX, y: e.clientY, t, moved: 0, lx: e.clientX, ly: e.clientY, lt: t };
    spin.current.dragging = true;
    spin.current.vx = spin.current.vy = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.lx, dy = e.clientY - d.ly;
    const now = performance.now();
    const dt = Math.max(1, now - d.lt) / 1000;
    d.moved += Math.abs(dx) + Math.abs(dy);
    const sp = spin.current;
    sp.y += dx * 0.012;
    sp.x = Math.max(-1, Math.min(1, sp.x + dy * 0.012));
    sp.vy = (dx * 0.012) / dt;
    sp.vx = (dy * 0.012) / dt;
    d.lx = e.clientX;
    d.ly = e.clientY;
    d.lt = now;
    invalidate.current();
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    spin.current.dragging = false;
    if (performance.now() - d!.lt > 80) spin.current.vx = spin.current.vy = 0; // held still before letting go
    if (reduced) spin.current.vx = spin.current.vy = 0;
    if (d && d.moved < 8 && onTap) onTap();
  };

  const text = label ?? describeEmber(ember);
  return (
    <div
      className={`relative touch-none select-none ${onTap ? 'cursor-pointer' : 'cursor-grab'} ${className}`}
      role={onTap ? 'button' : 'img'}
      tabIndex={onTap ? 0 : undefined}
      aria-label={onTap ? `${text} Open its journey.` : text}
      onKeyDown={(e) => {
        if (onTap && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onTap();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          spin.current.y += e.key === 'ArrowLeft' ? -0.3 : 0.3;
          invalidate.current();
        }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {halo && <Halo ember={ember} />}
      <Canvas
        aria-hidden
        frameloop={reduced ? 'demand' : 'always'}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 6.4 / zoom], fov: 32 }}
        style={{ pointerEvents: 'none' }}
      >
        <Lights />
        <Crystal
          ember={ember}
          spin={spin}
          reduced={reduced}
          highlight={highlight}
          forming={forming}
          appear={appear}
          onInvalidate={(f) => (invalidate.current = f)}
        />
      </Canvas>
    </div>
  );
}

function Lights() {
  const { gl, scene } = useThree();
  useEffect(() => {
    // Generated locally: no HDR download, so it renders offline mid-swap.
    const pm = new PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    return () => {
      scene.environment = null;
      tex.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
  return (
    <>
      <ambientLight intensity={0.5} color="#FFE9F2" />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#FFF4E8" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#D9D2FF" />
    </>
  );
}

function Crystal({
  ember,
  spin,
  reduced,
  highlight,
  forming,
  appear,
  onInvalidate,
}: {
  ember: Ember;
  spin: React.RefObject<Spin>;
  reduced: boolean;
  highlight: number[] | null;
  forming: boolean;
  appear: boolean;
  onInvalidate: (f: () => void) => void;
}) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => onInvalidate(invalidate), [invalidate, onInvalidate]);
  const key = `${ember.id}:${ember.marks.length}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const obj = useMemo(() => new EmberObject(ember), [key]);
  useEffect(() => () => obj.dispose(), [obj]);
  const formT = useRef<number | null>(forming && !reduced ? 0 : null);
  const hlKey = highlight?.join(',');
  const grow = useRef(appear && !reduced ? 0 : 1);

  useEffect(() => {
    formT.current = forming && !reduced ? 0 : null;
    obj.update({ highlight, formT: formT.current });
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obj, forming, reduced, hlKey]);

  useFrame((state, dt) => {
    const sp = spin.current;
    dt = Math.min(dt, 0.05);
    if (!sp.dragging && !reduced) {
      const k = Math.exp(-dt * 1.6);
      sp.vy = IDLE + (sp.vy - IDLE) * k;
      sp.vx *= k;
      sp.y += sp.vy * dt;
      sp.x = Math.max(-1, Math.min(1, sp.x + sp.vx * dt));
      sp.x += (0.32 - sp.x) * (1 - Math.exp(-dt * 0.8));
    }
    obj.group.rotation.set(sp.x, sp.y, 0);
    if (grow.current < 1) {
      grow.current = Math.min(1, grow.current + dt / 1.6);
      const g = 1 - Math.pow(1 - grow.current, 4);
      obj.group.scale.setScalar(0.35 + 0.65 * g);
      sp.vy = IDLE + 6 * (1 - g); // arrives spinning, settles into the idle turn
    }
    const animating = formT.current !== null && formT.current < 1;
    if (animating) formT.current = Math.min(1, formT.current! + dt / 0.8);
    if (animating || (highlight && !reduced)) {
      obj.update({ highlight, formT: formT.current, pulse: highlight && !reduced ? (Math.sin(state.clock.elapsedTime * 2.4) + 1) / 2 : 0 });
    }
  });

  return <primitive object={obj.group} />;
}

/** A soft wash of the carriers' colours behind the stone: a cheap stand-in for bloom. */
function Halo({ ember }: { ember: Ember }) {
  const cs = ember.marks.map((m) => m.color);
  const a = cs.at(-1) ?? '#CFC2F0', b = cs[Math.floor(cs.length / 2)] ?? '#E9D5FF', c = cs[0] ?? '#FBCFE8';
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      <div
        className="aspect-square w-[72%] rounded-full opacity-90 blur-2xl"
        style={{ background: `radial-gradient(circle at 35% 40%, ${a}, transparent 60%), radial-gradient(circle at 65% 60%, ${b}, transparent 60%), radial-gradient(circle at 50% 50%, ${c}, transparent 70%)` }}
      />
    </div>
  );
}
