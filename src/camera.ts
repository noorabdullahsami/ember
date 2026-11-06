import { useEffect, useRef, useState } from 'react';

export type CamStatus = 'starting' | 'live' | 'denied' | 'unavailable';

/** Rear camera into a <video>. Stops the moment the component unmounts or `on` goes false. */
export function useCamera(on: boolean) {
  const video = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CamStatus>('starting');
  useEffect(() => {
    if (!on) return;
    let stream: MediaStream | null = null;
    let dead = false;
    setStatus('starting');
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unavailable');
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } }, audio: false })
      .then((s) => {
        if (dead) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        if (video.current) {
          video.current.srcObject = s;
          video.current.play().catch(() => {});
        }
        setStatus('live');
      })
      .catch((err) => setStatus(err?.name === 'NotAllowedError' ? 'denied' : 'unavailable'));
    return () => {
      dead = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [on]);
  return { video, status };
}

/** Average colour of a small square at the centre of the frame. */
export function sampleCenter(v: HTMLVideoElement, size = 24): string {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.drawImage(v, (v.videoWidth - size) / 2, (v.videoHeight - size) / 2, size, size, 0, 0, size, size);
  const d = g.getImageData(0, 0, size, size).data;
  let r = 0, gr = 0, b = 0;
  for (let i = 0; i < d.length; i += 4) {
    r += d[i];
    gr += d[i + 1];
    b += d[i + 2];
  }
  const n = d.length / 4;
  return '#' + [r, gr, b].map((x) => Math.round(x / n).toString(16).padStart(2, '0')).join('').toUpperCase();
}
