import Ember3D from '../ember/Ember3D';
import type { Crossing as C } from '../store';
import type { Mark } from '../types';
import { Button, monthYear } from '../components/ui';

export default function Crossing({ c, onDismiss }: { c: C; onDismiss: () => void }) {
  const mine = c.ember.marks[c.mine];
  const theirs = c.ember.marks[c.theirs];
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="crossing-title">
      {/* the two carriers' colours wash in from either side */}
      <div aria-hidden className="pointer-events-none absolute inset-0 anim-fade" style={{ animationDuration: '1600ms' }}>
        <div className="absolute top-[30%] -left-24 size-80 rounded-full opacity-80 blur-3xl" style={{ background: mine.color, animation: 'halo 5s ease-in-out infinite' }} />
        <div className="absolute top-[38%] -right-24 size-80 rounded-full opacity-80 blur-3xl" style={{ background: theirs.color, animation: 'halo 5s ease-in-out 2.5s infinite' }} />
      </div>

      <div className="relative mx-4 mt-4 rounded-[28px] bg-white px-6 py-5 text-center anim-rise" style={{ animationDelay: '200ms' }}>
        <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">A crossing</p>
        <h1 id="crossing-title" className="mt-2 font-display text-[38px] leading-[1.02]">
          You have both carried <span className="inline-block font-mono text-[32px] font-medium tracking-[0.04em]" style={{ animation: 'bloom-in 900ms 700ms cubic-bezier(.2,.7,.2,1) both' }}>{c.ember.id}</span>.
        </h1>
      </div>

      {/* no transform on this box: r3f measures its canvas with transforms applied */}
      <div className="relative min-h-0 flex-1 anim-fade" style={{ animationDuration: '1200ms', animationDelay: '400ms' }}>
        <Thread from={mine.color} to={theirs.color} />
        <Ember3D ember={c.ember} highlight={[c.mine, c.theirs]} appear className="size-full" zoom={1.05} halo={false} label={`Ember ${c.ember.id}. Your seams and theirs are lit: ${mine.word} and ${theirs.word}.`} />
      </div>

      <div className="relative mx-4 grid grid-cols-2 gap-3">
        <Entry who="You" m={mine} anim="from-left" delay={1100} />
        <Entry who="They" m={theirs} anim="from-right" delay={1300} />
      </div>
      <div className="relative mx-4 mt-3 mb-4 anim-rise" style={{ animationDelay: '1900ms' }}>
        <Button className="w-full" onClick={onDismiss} autoFocus>
          Keep going
        </Button>
      </div>
    </div>
  );
}

function Entry({ who, m, anim, delay }: { who: string; m: Mark; anim: string; delay: number }) {
  return (
    <div className="rounded-[22px] bg-white px-4 py-4" style={{ animation: `${anim} 800ms ${delay}ms cubic-bezier(.2,.7,.2,1) both` }}>
      <span className="block h-1.5 w-10 rounded-full" style={{ background: m.color }} aria-hidden />
      <p className="mt-3 text-[15px] leading-snug">
        {who} held it in {m.place} — {monthYear(m.at)}.
      </p>
      <p className="mt-2 text-[13px] text-muted">
        left “<span className="text-ink">{m.word}</span>”
      </p>
    </div>
  );
}

/** Two threads in the carriers' colours meeting at the crystal. */
function Thread({ from, to }: { from: string; to: string }) {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M 18 104 C 18 70, 40 58, 50 50" fill="none" stroke={from} strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray="1" style={{ animation: 'draw 1400ms 900ms cubic-bezier(.4,0,.2,1) both' }} vectorEffect="non-scaling-stroke" />
      <path d="M 82 104 C 82 70, 60 58, 50 50" fill="none" stroke={to} strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray="1" style={{ animation: 'draw 1400ms 1100ms cubic-bezier(.4,0,.2,1) both' }} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
