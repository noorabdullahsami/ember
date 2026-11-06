import { useCallback, useState } from 'react';
import Carry from './screens/Carry';
import Mark from './screens/Mark';
import Exchange, { type LastSwap } from './screens/Exchange';
import Crossing from './screens/Crossing';
import Detail from './screens/Detail';
import Log from './screens/Log';
import type { Crossing as C, SwapResult } from './store';

type Tab = 'carry' | 'exchange' | 'log';
type Overlay = { kind: 'mark' } | { kind: 'detail'; id: string } | { kind: 'crossing'; c: C } | null;

export default function App() {
  const [tab, setTab] = useState<Tab>('carry');
  const [scanFirst, setScanFirst] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [lastSwap, setLastSwap] = useState<LastSwap>(null);
  const [swapError, setSwapError] = useState('');

  const open = (id: string) => setOverlay({ kind: 'detail', id });
  const go = (t: Tab, scan = false) => {
    setScanFirst(scan);
    setTab(t);
    setOverlay(null);
  };
  const onSwap = useCallback((r: SwapResult) => {
    if ('error' in r) return setSwapError(r.error);
    setSwapError('');
    setLastSwap({ left: r.left, arrived: r.arrived });
    setTab('exchange');
    setScanFirst(false);
    if (r.crossing) setOverlay({ kind: 'crossing', c: r.crossing });
  }, []);

  // Only one 3D canvas lives at a time: an overlay replaces the tab beneath it.
  let body;
  if (overlay?.kind === 'mark') body = <Mark onClose={() => setOverlay(null)} />;
  else if (overlay?.kind === 'detail') body = <Detail id={overlay.id} onBack={() => setOverlay(null)} />;
  else if (overlay?.kind === 'crossing') body = <Crossing c={overlay.c} onDismiss={() => setOverlay(null)} />;
  else if (tab === 'carry') body = <Carry onMark={() => setOverlay({ kind: 'mark' })} onPass={() => go('exchange')} onScan={() => go('exchange', true)} onOpen={open} />;
  else if (tab === 'exchange')
    body = (
      <>
        {swapError && <p role="alert" className="mx-4 mt-3 rounded-2xl bg-white px-4 py-3 text-[14px]">{swapError}</p>}
        <Exchange key={String(scanFirst)} initialTab={scanFirst ? 'scan' : 'show'} lastSwap={lastSwap} onSwap={onSwap} onMark={() => setOverlay({ kind: 'mark' })} />
      </>
    );
  else body = <Log onOpen={open} />;

  return (
    <div className="phone">
      <main className="flex min-h-0 flex-1 flex-col pt-[env(safe-area-inset-top)]">{body}</main>
      {overlay?.kind !== 'crossing' && overlay?.kind !== 'mark' && <Nav tab={overlay ? null : tab} onTab={(t) => go(t)} />}
    </div>
  );
}

const ICONS: Record<Tab, string> = {
  carry: 'M12 3 5 9.5 12 21l7-11.5L12 3Zm-7 6.5h14M12 3v18',
  exchange: 'M7 7h11l-3-3M17 17H6l3 3',
  log: 'M4 5h4v4H4zM10 5h4v4h-4zM16 5h4v4h-4zM4 11h4v4H4zM10 11h4v4h-4zM4 17h4v4H4z',
};

function Nav({ tab, onTab }: { tab: Tab | null; onTab: (t: Tab) => void }) {
  return (
    <nav className="flex border-t border-hairline bg-white pb-[env(safe-area-inset-bottom)]" aria-label="Main">
      {(['carry', 'exchange', 'log'] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => onTab(t)}
          aria-current={tab === t ? 'page' : undefined}
          className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-[12px] font-medium capitalize ${tab === t ? 'text-ink' : 'text-muted'}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={tab === t ? 1.9 : 1.5} strokeLinejoin="round" strokeLinecap="round" aria-hidden>
            <path d={ICONS[t]} />
          </svg>
          {t}
        </button>
      ))}
    </nav>
  );
}
