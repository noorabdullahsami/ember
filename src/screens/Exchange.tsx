import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { useCamera } from '../camera';
import { decodeEmber, encodeEmber } from '../qr';
import { finishHandoff, hasMarked, receive, simulateReceive, useStore, type SwapResult } from '../store';
import type { Ember } from '../types';
import { Button, Card } from '../components/ui';

export type LastSwap = { left: string | null; arrived: string } | null;

export default function Exchange({
  initialTab,
  lastSwap,
  onSwap,
  onMark,
}: {
  initialTab: 'show' | 'scan';
  lastSwap: LastSwap;
  onSwap: (r: SwapResult) => void;
  onMark: () => void;
}) {
  const s = useStore();
  const [tab, setTab] = useState(s.handingOff ? 'show' : initialTab);
  const showing = s.handingOff ?? s.me.carrying;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-3 pb-4">
      <div className="flex rounded-full bg-white p-1 shadow-[0_1px_0_#E7E5E4]" role="tablist" aria-label="Exchange">
        {(['show', 'scan'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`min-h-11 flex-1 rounded-full text-[15px] font-medium capitalize transition ${tab === t ? 'bg-ink text-white' : 'text-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {lastSwap && s.handingOff && (
        <Card className="mt-3 px-5 py-4 anim-rise">
          <p role="status" className="text-[15px]">
            {lastSwap.left ? (
              <>
                <span className="font-mono">{lastSwap.left}</span> is gone. You're carrying <span className="font-mono">{lastSwap.arrived}</span>.
              </>
            ) : (
              <>
                You're carrying <span className="font-mono">{lastSwap.arrived}</span>.
              </>
            )}
          </p>
        </Card>
      )}

      {tab === 'show' ? (
        showing ? (
          <ShowCode ember={showing} handingOff={!!s.handingOff} unmarked={!s.handingOff && !hasMarked(s)} onMark={onMark} />
        ) : (
          <Card className="mt-3 px-6 py-6">
            <p className="font-display text-[28px] leading-tight">Nothing to show.</p>
            <p className="mt-2 text-[15px] text-muted">You're not carrying an ember. Scan someone's to receive one.</p>
          </Card>
        )
      ) : (
        <Scan onSwap={onSwap} />
      )}

      <div className="mt-3 rounded-[22px] border border-dashed border-muted/60 bg-white px-5 py-4">
        <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">Demo control</p>
        <p className="mt-1 text-[13px] text-muted">For trying this with one phone. Acts as if someone next to you handed you theirs.</p>
        <Button variant="quiet" className="mt-3 w-full" onClick={() => onSwap(simulateReceive())}>
          Simulate receiving an ember
        </Button>
      </div>
    </div>
  );
}

function ShowCode({ ember, handingOff, unmarked, onMark }: { ember: Ember; handingOff: boolean; unmarked: boolean; onMark: () => void }) {
  const payload = useMemo(() => encodeEmber(ember), [ember]);
  const [svg, setSvg] = useState('');
  useEffect(() => {
    QRCode.toString(payload, { type: 'svg', errorCorrectionLevel: 'L', margin: 1, color: { dark: '#1C1917', light: '#FFFFFF' } }).then(setSvg);
  }, [payload]);
  return (
    <Card className="mt-3 px-6 pt-6 pb-5">
      <div className="mx-auto aspect-square w-full max-w-[300px]" role="img" aria-label={`QR code carrying ember ${ember.id}`} dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="mt-4 text-center font-mono text-[26px] tracking-[0.06em]">{ember.id}</p>
      <p className="mt-1 text-center text-[14px] text-muted">
        {handingOff ? `Let them scan it. Once they have, ${ember.id} is theirs to carry.` : 'Hold this up for the person next to you, and scan theirs.'}
      </p>
      {handingOff && (
        <Button className="mt-4 w-full" onClick={finishHandoff}>
          They have it
        </Button>
      )}
      {unmarked && (
        <p className="mt-3 text-center text-[13px] text-muted">
          You haven't left your mark on {ember.id} yet.{' '}
          <button onClick={onMark} className="min-h-11 text-ink underline underline-offset-4">
            Leave it first
          </button>
        </p>
      )}
    </Card>
  );
}

function Scan({ onSwap }: { onSwap: (r: SwapResult) => void }) {
  const { video, status } = useCamera(true);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    if (status !== 'live') return;
    const c = document.createElement('canvas');
    const g = c.getContext('2d', { willReadFrequently: true })!;
    let raf = 0, last = 0, done = false;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const v = video.current;
      if (done || !v || v.readyState < 2 || t - last < 120) return;
      last = t;
      const w = 480, h = Math.round((480 * v.videoHeight) / v.videoWidth);
      c.width = w;
      c.height = h;
      g.drawImage(v, 0, 0, w, h);
      const code = jsQR(g.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
      if (!code) return;
      const ember = decodeEmber(code.data);
      if (!ember) return setMsg('That code isn’t an ember.');
      const r = receive(ember);
      if ('error' in r) return setMsg(r.error);
      done = true;
      navigator.vibrate?.(30);
      onSwap(r);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, video, onSwap]);

  return (
    <div className="mt-3">
      <div className="relative aspect-square overflow-hidden rounded-[28px] bg-ink">
        <video ref={video} muted playsInline className="absolute inset-0 size-full object-cover" aria-hidden />
        <span className="absolute inset-[16%] rounded-[24px] border-2 border-white shadow-[0_0_0_9999px_rgba(28,25,23,.35)]" aria-hidden />
        {status !== 'live' && (
          <span className="absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-2xl bg-white px-4 py-3 text-center text-[14px] text-ink">
            {status === 'starting' ? 'Opening the camera…' : status === 'denied' ? 'The camera is off. Use the demo control below, or allow the camera to scan.' : 'No camera available here. Use the demo control below.'}
          </span>
        )}
      </div>
      <Card className="mt-3 px-5 py-4">
        <p role="status" className="text-[14px] text-muted">
          {msg || 'Point at the code on their screen. Your ember goes to them, theirs comes to you.'}
        </p>
      </Card>
    </div>
  );
}
