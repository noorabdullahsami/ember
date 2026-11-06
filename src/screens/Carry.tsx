import Ember3D from '../ember/Ember3D';
import { hasMarked, useStore } from '../store';
import { Button, Card, Spectrum, hands, monthYear } from '../components/ui';

export default function Carry({ onMark, onPass, onScan, onOpen }: { onMark: () => void; onPass: () => void; onScan: () => void; onOpen: (id: string) => void }) {
  const s = useStore();
  const e = s.me.carrying;

  if (!e) {
    return (
      <div className="flex flex-1 flex-col justify-end px-4 pb-4">
        <Card className="px-6 py-7 anim-rise">
          <h1 className="font-display text-[34px] leading-[1.05]">Nothing in your hands.</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Embers only move from one person to another. When someone next to you shows theirs, scan it and you'll be carrying it.
          </p>
          <Button className="mt-6 w-full" onClick={onScan}>
            Scan
          </Button>
        </Card>
      </div>
    );
  }

  const marked = hasMarked(s);
  const last = e.marks.at(-1);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mx-4 mt-3 self-start rounded-full bg-white px-4 py-2 text-[13px] font-medium shadow-[0_1px_0_#E7E5E4]">You're carrying</div>
      <Ember3D key={e.id} ember={e} className="min-h-0 flex-1" onTap={() => onOpen(e.id)} />
      <Card className="mx-4 mb-3 px-6 pt-5 pb-6">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[30px] font-medium leading-none tracking-[0.06em]">{e.id}</p>
          <p className="font-mono text-[13px] text-muted">born {monthYear(e.bornAt)}</p>
        </div>
        <p className="mt-2 text-[15px] text-muted">
          {hands(e.marks.length)}
          {last && !marked && <> · last held in {last.place}</>}
          {marked && <> · yours is the newest</>}
        </p>
        <Spectrum ember={e} className="mt-4" />
        {marked ? (
          <>
            <Button className="mt-5 w-full" onClick={onPass}>
              Pass it on
            </Button>
            <p className="mt-3 text-center text-[13px] text-muted">"{last!.word}" is in it now. Find someone to swap with.</p>
          </>
        ) : (
          <>
            <Button className="mt-5 w-full" onClick={onMark}>
              Leave your mark
            </Button>
            <p className="mt-3 text-center text-[13px] text-muted">One colour from near you, one word. Once.</p>
          </>
        )}
      </Card>
    </div>
  );
}
