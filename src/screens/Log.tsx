import { useMemo } from 'react';
import { thumbnail } from '../ember/thumb';
import { describeEmber } from '../ember/EmberObject';
import { resetDemo, useStore } from '../store';
import type { Ember } from '../types';
import { Card, ScreenTitle, hands } from '../components/ui';

export default function Log({ onOpen }: { onOpen: (id: string) => void }) {
  const s = useStore();
  const get = (id: string) => (s.me.carrying?.id === id ? s.me.carrying : s.embers[id]);
  const origin = get(s.me.originEmberId);
  const rest = s.me.held.filter((id) => id !== s.me.originEmberId).toReversed().map(get).filter(Boolean) as Ember[];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto pb-4">
      <ScreenTitle sub={`${s.me.held.length} embers have passed through your hands. This list only grows.`}>Log</ScreenTitle>
      {origin && (
        <button onClick={() => onOpen(origin.id)} className="mx-4 mt-3 block w-[calc(100%-2rem)] text-left" aria-label={`Your origin. ${describeEmber(origin)}`}>
          <Card className="flex items-center gap-4 px-4 py-4">
            <Thumb e={origin} className="size-24" />
            <div>
              <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">Your origin</p>
              <p className="mt-1 font-mono text-[24px] font-medium tracking-[0.06em]">{origin.id}</p>
              <p className="font-mono text-[13px] text-muted">{hands(origin.marks.length)}</p>
              <p className="mt-1 font-display text-[18px] leading-tight italic">the one you brought into the world.</p>
            </div>
          </Card>
        </button>
      )}
      <ul className="mx-4 mt-3 grid grid-cols-2 gap-3">
        {rest.map((e) => (
          <li key={e.id}>
            <button onClick={() => onOpen(e.id)} className="block w-full text-left" aria-label={describeEmber(e)}>
              <Card className="px-4 pt-3 pb-4">
                <Thumb e={e} className="mx-auto size-28" />
                <div className="mt-1 flex items-baseline justify-between">
                  <p className="font-mono text-[18px] font-medium tracking-[0.06em]">{e.id}</p>
                  {s.me.carrying?.id === e.id && <p className="text-[11px] font-medium text-muted">carrying</p>}
                </div>
                <p className="font-mono text-[12px] text-muted">{hands(e.marks.length)}</p>
              </Card>
            </button>
          </li>
        ))}
      </ul>
      <div className="mx-4 mt-6 rounded-[22px] border border-dashed border-muted/60 bg-white px-5 py-4">
        <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">Demo control</p>
        <button
          className="mt-1 min-h-11 text-[14px] text-ink underline underline-offset-4"
          onClick={() => confirm('Start the demo over from the seed data?') && resetDemo()}
        >
          Reset demo data
        </button>
      </div>
    </div>
  );
}

function Thumb({ e, className }: { e: Ember; className: string }) {
  const url = useMemo(() => thumbnail(e), [e]);
  return <img src={url} alt="" className={className} draggable={false} />;
}
