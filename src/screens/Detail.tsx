import Ember3D from '../ember/Ember3D';
import { useStore } from '../store';
import { PLACES } from '../places';
import type { Ember } from '../types';
import { Card, hands, monthYear, shortDate } from '../components/ui';

export default function Detail({ id, onBack }: { id: string; onBack: () => void }) {
  const s = useStore();
  const e = s.me.carrying?.id === id ? s.me.carrying : s.embers[id];
  if (!e) return null;
  const carrying = s.me.carrying?.id === id;
  const me = s.me.userId;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-3 px-4 pt-3">
        <button onClick={onBack} className="grid size-11 place-items-center rounded-full bg-white shadow-[0_1px_0_#E7E5E4]" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        <Ember3D ember={e} className="mx-auto h-[300px] w-full" zoom={1.1} />
        <Card className="mx-4 px-6 py-5">
          <p className="font-mono text-[30px] font-medium leading-none tracking-[0.06em]">{e.id}</p>
          <p className="mt-2 text-[15px]">
            <span className="font-mono">{hands(e.marks.length)}.</span> <span className="font-mono">Born {monthYear(e.bornAt)}.</span>
          </p>
          <p className="mt-1 text-[13px] text-muted">{carrying ? 'In your hands now.' : 'As it was when it last passed through you. Where it is now, nobody can say.'}</p>
        </Card>

        <Card className="mx-4 mt-3 overflow-hidden">
          <h2 className="px-6 pt-5 font-display text-[26px] leading-none">Journey</h2>
          <JourneyMap ember={e} />
        </Card>

        <Card className="mx-4 mt-3 px-6 py-5">
          <h2 className="font-display text-[26px] leading-none">Carried by</h2>
          <ol className="mt-3">
            {e.marks.map((m, i) => {
              const yours = m.carrierId === me;
              return (
                <li key={i} className={`-mx-3 flex items-center gap-3 rounded-2xl px-3 py-3 ${yours ? 'bg-sunk ring-1 ring-hairline' : ''}`}>
                  <span className="size-7 shrink-0 rounded-lg ring-1 ring-black/15" style={{ background: m.color }} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-medium">
                      {m.word}
                      {yours && <span className="ml-2 rounded-full bg-white px-2 py-0.5 align-middle text-[11px] font-medium text-muted ring-1 ring-hairline">your mark</span>}
                    </p>
                    <p className="truncate text-[13px] text-muted">{m.place}</p>
                  </div>
                  <p className="shrink-0 font-mono text-[12px] text-muted">{shortDate(m.at)}</p>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>
    </div>
  );
}

const W = 320, H = 210, PAD = 26;

function JourneyMap({ ember }: { ember: Ember }) {
  // Coarse centroids only. A place we have no centroid for sits beside the previous one.
  // shortcut: fixed centroid table, unknown places are approximate; add a coarse geocoder table if marks come from many new cities.
  const raw: [number, number][] = [];
  ember.marks.forEach((m, i) => {
    const p = PLACES[m.place];
    const prev = raw[i - 1] ?? [40.71, -74.0];
    raw.push(p ? [p[0], p[1]] : [prev[0] + 0.4, prev[1] + 0.6]);
  });
  if (!raw.length) return <p className="px-6 pb-5 text-[14px] text-muted">No hands yet.</p>;

  const midLat = raw.reduce((a, p) => a + p[0], 0) / raw.length;
  const k = Math.cos((midLat * Math.PI) / 180);
  const xy = raw.map(([lat, lon]) => [lon * k, -lat]);
  const xs = xy.map((p) => p[0]), ys = xy.map((p) => p[1]);
  let [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const span = Math.max(x1 - x0, (y1 - y0) * ((W - 2 * PAD) / (H - 2 * PAD)), 0.12);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const scale = (W - 2 * PAD) / span;
  [x0, y0] = [cx - W / 2 / scale, cy - H / 2 / scale];
  const pts = xy.map(([x, y]) => [(x - x0) * scale, (y - y0) * scale] as const);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const n = pts.length;
  const first = ember.marks[0].place, last = ember.marks[n - 1].place;
  const places = [...new Set(ember.marks.map((m) => m.place))];

  return (
    <figure className="mt-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full bg-sunk" role="img" aria-label={`Route through ${places.length} ${places.length === 1 ? 'place' : 'places'}, from ${first} to ${last}: ${places.join(', ')}.`}>
        <defs>
          <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="#D6D3D1" />
          </pattern>
          <filter id="glow" x="-1" y="-1" width="3" height="3">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <rect width={W} height={H} fill="url(#dots)" />
        <path d={d} fill="none" stroke="#57534E" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1" style={{ animation: 'draw 1200ms 200ms cubic-bezier(.65,0,.35,1) both' }} />
        {pts.map(([x, y], i) => {
          const delay = 200 + (n > 1 ? (i / (n - 1)) * 1200 : 0);
          return (
            <g key={i} style={{ transformOrigin: `${x}px ${y}px`, animation: `pop 420ms ${delay}ms cubic-bezier(.2,.9,.3,1.4) both` }}>
              <circle cx={x} cy={y} r="9" fill={ember.marks[i].color} filter="url(#glow)" />
              <circle cx={x} cy={y} r="4.5" fill={ember.marks[i].color} stroke="#1C1917" strokeWidth="1.2" />
            </g>
          );
        })}
      </svg>
      <figcaption className="flex justify-between gap-3 px-6 py-4 text-[13px]">
        <span>
          <span className="block font-mono text-[11px] tracking-[0.1em] text-muted uppercase">from</span>
          {first}
        </span>
        <span className="text-right">
          <span className="block font-mono text-[11px] tracking-[0.1em] text-muted uppercase">{n > 1 ? 'latest' : 'only'}</span>
          {last}
        </span>
      </figcaption>
    </figure>
  );
}
