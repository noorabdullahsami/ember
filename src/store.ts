import { useSyncExternalStore } from 'react';
import type { Ember, Me } from './types';
import { ME, QF18, SEED_EMBERS, TR91_RETURNING, strangerEmber } from './seed';
import { currentPlace } from './places';

export type State = {
  me: Me;
  embers: Record<string, Ember>; // the last state each ember was in while it passed through you
  handingOff: Ember | null; // the one that just left, still shown so the other person can scan it
  demoReceives: number;
};

const KEY = 'ember.v1';

function seed(): State {
  return {
    me: { ...ME, carrying: QF18 },
    embers: Object.fromEntries(SEED_EMBERS.map((e) => [e.id, e])),
    handingOff: null,
    demoReceives: 0,
  };
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupt storage: fall through to a fresh seed */
  }
  const s = seed();
  localStorage.setItem(KEY, JSON.stringify(s));
  return s;
}

let state = load();
const subs = new Set<() => void>();
function set(next: State) {
  state = next;
  localStorage.setItem(KEY, JSON.stringify(state));
  subs.forEach((f) => f());
}

export function useStore() {
  return useSyncExternalStore(
    (f) => (subs.add(f), () => void subs.delete(f)),
    () => state,
  );
}

export const hasMarked = (s: State) => s.me.carrying?.marks.at(-1)?.carrierId === s.me.userId;

export function leaveMark(color: string, word: string) {
  const c = state.me.carrying;
  if (!c || hasMarked(state)) return;
  const carrying: Ember = {
    ...c,
    marks: [...c.marks, { carrierId: state.me.userId, color, word, place: currentPlace(), at: new Date().toISOString().slice(0, 10) }],
  };
  set({ ...state, me: { ...state.me, carrying }, embers: { ...state.embers, [c.id]: carrying } });
}

export type Crossing = { ember: Ember; mine: number; theirs: number };
export type SwapResult = { left: string | null; arrived: string; crossing: Crossing | null } | { error: string };

export function receive(incoming: Ember): SwapResult {
  const { me } = state;
  if (me.carrying?.id === incoming.id) return { error: `That's ${incoming.id}, the one you're already carrying.` };
  // Only the ember travels in the QR, so the shared history is whatever both of you left in it.
  const mine = incoming.marks.findLastIndex((m) => m.carrierId === me.userId);
  const theirs = incoming.marks.findLastIndex((m) => m.carrierId !== me.userId);
  set({
    ...state,
    me: { ...me, carrying: incoming, held: me.held.includes(incoming.id) ? me.held : [...me.held, incoming.id] },
    embers: { ...state.embers, [incoming.id]: incoming },
    handingOff: me.carrying,
  });
  return {
    left: me.carrying?.id ?? null,
    arrived: incoming.id,
    crossing: mine >= 0 && theirs > mine ? { ember: incoming, mine, theirs } : null,
  };
}

export function finishHandoff() {
  set({ ...state, handingOff: null });
}

export function simulateReceive(): SwapResult {
  const n = state.demoReceives;
  let incoming = n === 0 ? TR91_RETURNING : strangerEmber(n);
  // TR91 is meant to come back around; later strangers should be new to you.
  if (n > 0 && (incoming.id === state.me.carrying?.id || state.me.held.includes(incoming.id))) incoming = strangerEmber(n + 100);
  state = { ...state, demoReceives: n + 1 };
  return receive(incoming);
}

export function resetDemo() {
  set(seed());
}
