import { useState } from 'react';
import filter from 'leo-profanity';
import Ember3D from '../ember/Ember3D';
import { sampleCenter, useCamera } from '../camera';
import { leaveMark, useStore } from '../store';
import { Button, Card, hands } from '../components/ui';

type Step = 'color' | 'word' | 'commit' | 'done';

const PRESETS = ['#F4B6A6', '#F2C879', '#E8D4A4', '#B8C4A4', '#7FB8A4', '#9CD9C4', '#9CC4E4', '#8FA4C4', '#B8A4D9', '#D9C4E8', '#E8B4C8', '#C4B89C'];

export default function Mark({ onClose }: { onClose: () => void }) {
  const s = useStore();
  const [step, setStep] = useState<Step>('color');
  const [color, setColor] = useState<string | null>(null);
  const [word, setWord] = useState('');
  const e = s.me.carrying;
  if (!e) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between px-4 pt-3">
        <div className="rounded-full bg-white px-4 py-2 font-mono text-[13px] shadow-[0_1px_0_#E7E5E4]">
          {step === 'done' ? e.id : `${e.id} · step ${step === 'color' ? 1 : step === 'word' ? 2 : 3} of 3`}
        </div>
        {step !== 'done' && (
          <button onClick={onClose} className="grid size-11 place-items-center rounded-full bg-white text-[20px] shadow-[0_1px_0_#E7E5E4]" aria-label="Close without leaving a mark">
            ×
          </button>
        )}
      </header>
      {step === 'color' && (
        <ColorStep
          onUse={(c) => {
            setColor(c);
            setStep('word');
          }}
        />
      )}
      {step === 'word' && color && <WordStep color={color} word={word} setWord={setWord} onBack={() => setStep('color')} onNext={() => setStep('commit')} />}
      {(step === 'commit' || step === 'done') && color && (
        <div className="flex min-h-0 flex-1 flex-col">
          <Ember3D key={`${e.id}:${e.marks.length}`} ember={e} className="min-h-0 flex-1" forming={step === 'done'} />
          {step === 'commit' ? (
            <Card className="mx-4 mb-4 px-6 pt-5 pb-6 anim-rise">
              <div className="flex items-center gap-4">
                <span className="size-14 shrink-0 rounded-2xl ring-1 ring-black/10" style={{ background: color }} aria-hidden />
                <div>
                  <p className="font-display text-[34px] leading-none">{word}</p>
                  <p className="mt-1 font-mono text-[13px] text-muted">{color}</p>
                </div>
              </div>
              <p className="mt-5 text-[15px] text-ink">This cannot be undone or edited.</p>
              <p className="mt-1 text-[14px] text-muted">It goes into {e.id} and travels with it to everyone who carries it next.</p>
              <Button
                className="mt-5 w-full"
                onClick={() => {
                  leaveMark(color, word);
                  setStep('done');
                }}
              >
                Leave it
              </Button>
              <button onClick={() => setStep('word')} className="mt-2 min-h-11 w-full text-[14px] text-muted">
                Change the word
              </button>
            </Card>
          ) : (
            <Card className="mx-4 mb-4 px-6 pt-5 pb-6 anim-rise">
              <p className="font-display text-[30px] leading-tight">
                “{word}” is in {e.id} now.
              </p>
              <p className="mt-2 text-[15px] text-muted">{hands(e.marks.length)}. Yours is the newest facet. Next, it moves on.</p>
              <Button className="mt-5 w-full" onClick={onClose}>
                Done
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function ColorStep({ onUse }: { onUse: (c: string) => void }) {
  const [manual, setManual] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const { video, status } = useCamera(!manual);
  const noCamera = status === 'denied' || status === 'unavailable';

  if (manual || noCamera) return <ManualColor onUse={onUse} reason={!manual ? status : null} onCamera={noCamera ? null : () => setManual(false)} />;

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pt-3 pb-4">
      <button
        className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] bg-ink"
        aria-label="Take the colour at the centre of the camera"
        onClick={() => {
          if (status !== 'live' || !video.current) return;
          if (picked) return;
          video.current.pause();
          setPicked(sampleCenter(video.current));
        }}
      >
        <video ref={video} muted playsInline className="absolute inset-0 size-full object-cover" />
        <span className="absolute top-1/2 left-1/2 size-16 -translate-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,.4),inset_0_0_0_1px_rgba(0,0,0,.4)]" style={picked ? { background: picked } : undefined} aria-hidden />
        <span className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-[14px] whitespace-nowrap text-ink">
          {status === 'starting' ? 'Opening the camera…' : picked ? 'Got it.' : 'Point at something near you.'}
        </span>
      </button>
      <Card className="mt-3 px-5 py-4">
        {picked ? (
          <>
            <div className="flex items-center gap-3">
              <span className="size-10 rounded-xl ring-1 ring-black/10" style={{ background: picked }} aria-hidden />
              <p className="font-mono text-[17px]">{picked}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="quiet"
                className="flex-1"
                onClick={() => {
                  setPicked(null);
                  video.current?.play();
                }}
              >
                Again
              </Button>
              <Button className="flex-1" onClick={() => onUse(picked)}>
                Use this
              </Button>
            </div>
          </>
        ) : (
          <p className="text-[14px] text-muted">Tap anywhere on the camera to take the colour inside the circle.</p>
        )}
        <button onClick={() => setManual(true)} className="mt-2 min-h-11 text-[14px] text-ink underline underline-offset-4">
          Enter it manually
        </button>
      </Card>
    </div>
  );
}

function ManualColor({ onUse, reason, onCamera }: { onUse: (c: string) => void; reason: string | null; onCamera: (() => void) | null }) {
  const [hex, setHex] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const valid = /^#?[0-9a-f]{6}$/i.test(hex.trim());
  const chosen = picked ?? (valid ? '#' + hex.trim().replace('#', '').toUpperCase() : null);
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-end overflow-y-auto px-4 pt-3 pb-4">
      <Card className="px-5 py-5">
        <h1 className="font-display text-[30px] leading-none">Take a colour</h1>
        <p className="mt-2 text-[14px] text-muted">
          {reason === 'denied' ? 'The camera is off, which is fine. ' : reason === 'unavailable' ? 'No camera here, which is fine. ' : ''}
          Pick the one closest to something near you.
        </p>
        <div className="mt-4 grid grid-cols-6 gap-2" role="radiogroup" aria-label="Preset colours">
          {PRESETS.map((c) => (
            <button
              key={c}
              role="radio"
              aria-checked={picked === c}
              aria-label={c}
              onClick={() => {
                setPicked(c);
                setHex('');
              }}
              className={`aspect-square min-h-11 rounded-xl ring-1 ring-black/10 ${picked === c ? 'outline-2 outline-offset-2 outline-ink' : ''}`}
              style={{ background: c }}
            />
          ))}
        </div>
        <label className="mt-4 block text-[13px] text-muted" htmlFor="hex">
          Or a hex code
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            id="hex"
            value={hex}
            onChange={(ev) => {
              setHex(ev.target.value.slice(0, 7));
              setPicked(null);
            }}
            placeholder="#C9A4E8"
            autoCapitalize="characters"
            className="min-h-12 flex-1 rounded-2xl bg-sunk px-4 font-mono text-[16px] ring-1 ring-hairline"
          />
          <span className="size-12 rounded-2xl ring-1 ring-black/10" style={{ background: chosen ?? '#FAF9FC' }} aria-hidden />
        </div>
        <Button className="mt-5 w-full" disabled={!chosen} onClick={() => chosen && onUse(chosen)}>
          Use {chosen ?? 'this'}
        </Button>
        {onCamera && (
          <button onClick={onCamera} className="mt-2 min-h-11 w-full text-[14px] text-ink underline underline-offset-4">
            Use the camera instead
          </button>
        )}
      </Card>
    </div>
  );
}

function WordStep({ color, word, setWord, onBack, onNext }: { color: string; word: string; setWord: (w: string) => void; onBack: () => void; onNext: () => void }) {
  const [error, setError] = useState('');
  const submit = () => {
    if (!word) return;
    if (filter.check(word)) return setError('That word can’t travel. Try a different one.');
    onNext();
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-end px-4 pb-4">
      <Card className="px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="size-10 rounded-xl ring-1 ring-black/10" style={{ background: color }} aria-hidden />
          <p className="font-mono text-[14px] text-muted">{color}</p>
        </div>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            submit();
          }}
        >
          <label htmlFor="word" className="mt-5 block font-display text-[30px] leading-none">
            One word
          </label>
          <input
            id="word"
            autoFocus
            value={word}
            maxLength={16}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-describedby="word-help word-err"
            aria-invalid={!!error}
            onChange={(ev) => {
              setWord(ev.target.value.toLowerCase().replace(/[^a-z]/g, '').slice(0, 16));
              setError('');
            }}
            className="mt-3 min-h-14 w-full rounded-2xl bg-sunk px-4 font-display text-[28px] ring-1 ring-hairline"
          />
          <div className="mt-2 flex justify-between text-[13px]">
            <p id="word-help" className="text-muted">
              One word. It stays in this ember forever.
            </p>
            <p className="font-mono text-muted">{word.length}/16</p>
          </div>
          <p id="word-err" role="status" className="mt-1 min-h-5 text-[13px] text-ink">
            {error}
          </p>
          <div className="mt-2 flex gap-2">
            <Button type="button" variant="quiet" className="flex-1" onClick={onBack}>
              New colour
            </Button>
            <Button type="submit" className="flex-1" disabled={!word}>
              Next
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
