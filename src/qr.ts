import LZString from 'lz-string';
import type { Ember } from './types';

const PREFIX = 'EMBER1:';

// The whole ember travels in the code. Compact tuples keep 30+ hands well under ~2KB.
export function encodeEmber(e: Ember): string {
  const packed = [e.id, e.bornAt, e.marks.map((m) => [m.carrierId, m.color.slice(1), m.word, m.place, m.at])];
  return PREFIX + LZString.compressToBase64(JSON.stringify(packed));
}

const ID = /^[A-Z]{2}\d{2}$/;
const CARRIER = /^[A-Z]{3}-\d{4}$/;
const HEX = /^[0-9A-Fa-f]{6}$/;
const WORD = /^[a-z]{1,16}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Anything scanned is untrusted: reject rather than repair. */
export function decodeEmber(text: string): Ember | null {
  if (!text.startsWith(PREFIX)) return null;
  try {
    const raw = JSON.parse(LZString.decompressFromBase64(text.slice(PREFIX.length)) ?? '');
    const [id, bornAt, marks] = raw;
    if (typeof id !== 'string' || !ID.test(id) || typeof bornAt !== 'string' || !DATE.test(bornAt) || !Array.isArray(marks) || marks.length > 500) return null;
    const out: Ember = { id, bornAt, marks: [] };
    for (const m of marks) {
      if (!Array.isArray(m) || m.length !== 5) return null;
      const [carrierId, color, word, place, at] = m;
      if (!CARRIER.test(carrierId) || !HEX.test(color) || !WORD.test(word) || typeof place !== 'string' || place.length > 48 || !DATE.test(at)) return null;
      out.marks.push({ carrierId, color: '#' + color.toUpperCase(), word, place, at });
    }
    return out;
  } catch {
    return null;
  }
}
