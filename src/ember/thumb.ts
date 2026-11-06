import { ACESFilmicToneMapping, AmbientLight, DirectionalLight, PMREMGenerator, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { Ember } from '../types';
import { EmberObject, hashString } from './EmberObject';

// One offscreen renderer for every small crystal, so the Log never runs out of WebGL contexts.
let ctx: { renderer: WebGLRenderer; scene: Scene; camera: PerspectiveCamera } | null = null;
const cache = new Map<string, string>();

export function thumbnail(e: Ember): string {
  const key = `${e.id}:${e.marks.length}`;
  const hit = cache.get(key);
  if (hit) return hit;
  if (!ctx) {
    const renderer = new WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(240, 240, false);
    renderer.toneMapping = ACESFilmicToneMapping;
    const scene = new Scene();
    scene.environment = new PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
    const key = new DirectionalLight('#FFF4E8', 1.1);
    key.position.set(3, 4, 5);
    const rim = new DirectionalLight('#D9D2FF', 0.6);
    rim.position.set(-4, -2, -3);
    scene.add(new AmbientLight('#FFE9F2', 0.5), key, rim);
    const camera = new PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0, 5.6);
    ctx = { renderer, scene, camera };
  }
  const obj = new EmberObject(e);
  obj.group.rotation.set(0.32, (hashString(e.id) % 628) / 100, 0);
  ctx.scene.add(obj.group);
  ctx.renderer.render(ctx.scene, ctx.camera);
  const url = ctx.renderer.domElement.toDataURL('image/png');
  ctx.scene.remove(obj.group);
  obj.dispose();
  cache.set(key, url);
  return url;
}
