import type { Ember, Mark } from './types';

const m = (carrierId: string, color: string, word: string, place: string, at: string): Mark => ({ carrierId, color, word, place, at });

export const ME = {
  userId: 'MAF-2969',
  originEmberId: 'KD07',
  held: ['KD07', 'XS60', 'QF18', 'BV44', 'TR91'],
};

export const XS60: Ember = {
  id: 'XS60',
  bornAt: '2026-03-04',
  marks: [
    m('DFT-4509', '#E8B4C8', 'late', 'Bushwick, NY', '2026-03-04'),
    m('FMK-4093', '#9CC4E4', 'rain', 'Bushwick, NY', '2026-03-09'),
    m('MAF-2969', '#F2C879', 'stairwell', 'Downtown Brooklyn, NY', '2026-03-15'),
    m('QRT-8812', '#B8A4D9', 'almost', 'Lower East Side, NY', '2026-03-21'),
    m('LNP-3317', '#7FB8A4', 'fern', 'Astoria, NY', '2026-04-02'),
    m('WVX-6650', '#E8A87C', 'orange', 'Harlem, NY', '2026-04-11'),
    m('JBC-2204', '#A4B8D9', 'transfer', 'Jersey City, NJ', '2026-04-19'),
    m('KPS-7741', '#D9A4B8', 'sunday', 'Philadelphia, PA', '2026-05-03'),
    m('ZMD-1198', '#8FA4C4', 'window', 'Boston, MA', '2026-05-22'),
    m('RTG-5530', '#C4B89C', 'cardboard', 'Montreal, QC', '2026-06-14'),
    m('HNW-9023', '#9CD9C4', 'ferry', 'Reykjavik, IS', '2026-07-08'),
    m('PLQ-4417', '#E4C89C', 'wheat', 'Dublin, IE', '2026-07-26'),
    m('XCV-6681', '#B8C4A4', 'hedge', 'Bristol, UK', '2026-08-09'),
    m('GTY-3345', '#D9C4E8', 'lavender', 'Lyon, FR', '2026-08-30'),
    m('NBF-7729', '#E8D4A4', 'shutter', 'Barcelona, ES', '2026-09-18'),
  ],
};

// The one MAF-2969 brought into the world. It never got far.
export const KD07: Ember = {
  id: 'KD07',
  bornAt: '2026-02-11',
  marks: [
    m('MAF-2969', '#F4B6A6', 'kettle', 'Downtown Brooklyn, NY', '2026-02-11'),
    m('HLR-5521', '#A9C9E8', 'bus', 'Fort Greene, NY', '2026-02-19'),
    m('CWE-3390', '#D7C4F0', 'quiet', 'Park Slope, NY', '2026-03-02'),
  ],
};

// Being carried right now, not yet marked by MAF-2969.
export const QF18: Ember = {
  id: 'QF18',
  bornAt: '2026-06-02',
  marks: [
    m('ORN-1184', '#F0B8A0', 'pigeon', 'Williamsburg, NY', '2026-06-02'),
    m('SAV-7720', '#A8D0C0', 'sage', 'Greenpoint, NY', '2026-06-20'),
    m('TUE-4402', '#C8B8E8', 'neon', 'Long Island City, NY', '2026-07-04'),
    m('YAL-9931', '#E8C0D0', 'blush', 'Midtown, NY', '2026-07-30'),
    m('BEK-2268', '#98B8D8', 'pier', 'Hoboken, NJ', '2026-08-14'),
    m('CRU-5507', '#E0D098', 'mango', 'Crown Heights, NY', '2026-09-06'),
    m('PIM-8813', '#B0C8A0', 'stoop', 'Bed-Stuy, NY', '2026-10-01'),
    m('DOV-3346', '#E8B0B8', 'tuesday', 'Bushwick, NY', '2026-10-29'),
  ],
};

export const BV44: Ember = {
  id: 'BV44',
  bornAt: '2026-05-10',
  marks: [
    m('GIL-6620', '#B4C8E8', 'gallery', 'Chelsea, NY', '2026-05-10'),
    m('MAF-2969', '#E8C4A0', 'toast', 'Downtown Brooklyn, NY', '2026-05-28'),
    m('ROQ-1457', '#A0D0B8', 'tide', 'Sunset Park, NY', '2026-06-09'),
    m('VAN-8839', '#D8B0D8', 'crane', 'Red Hook, NY', '2026-06-30'),
    m('ELM-2290', '#C0C8A8', 'canal', 'Gowanus, NY', '2026-07-21'),
  ],
};

// As it was when it left MAF-2969's hands.
export const TR91_LAST_SEEN: Ember = {
  id: 'TR91',
  bornAt: '2026-03-18',
  marks: [
    m('HAP-4471', '#C8A8D8', 'brass', 'Harlem, NY', '2026-03-18'),
    m('WIT-2283', '#A0C0E0', 'hill', 'Washington Heights, NY', '2026-03-30'),
    m('BRX-9915', '#E0B898', 'bodega', 'Mott Haven, NY', '2026-04-08'),
    m('MAF-2969', '#F0A8B8', 'threshold', 'Downtown Brooklyn, NY', '2026-04-24'),
  ],
};

// The demo's incoming ember: TR91 came back around. Receiving it fires the crossing.
export const TR91_RETURNING: Ember = {
  ...TR91_LAST_SEEN,
  marks: [
    ...TR91_LAST_SEEN.marks,
    m('PVD-6604', '#98C8C8', 'steeple', 'Providence, RI', '2026-05-16'),
    m('CHI-3378', '#D8C098', 'wind', 'Chicago, IL', '2026-07-02'),
    m('LIS-5512', '#9CC4E8', 'tram', 'Lisbon, PT', '2026-09-27'),
  ],
};

export const SEED_EMBERS = [XS60, KD07, QF18, BV44, TR91_LAST_SEEN];

// Later demo receives: plausible strangers' embers, deterministic per count.
const WORDS = ['salt', 'hum', 'porch', 'lilac', 'static', 'paper', 'drift', 'linen', 'ember', 'moss', 'signal', 'peach', 'gutter', 'cloud', 'bell', 'thread'];
const NY = ['Bushwick, NY', 'Astoria, NY', 'Harlem, NY', 'Williamsburg, NY', 'Park Slope, NY', 'Chelsea, NY', 'Hoboken, NJ', 'Greenpoint, NY'];
const FAR = ['Toronto, ON', 'Berlin, DE', 'Tokyo, JP', 'Mexico City, MX', 'London, UK'];
export function strangerEmber(n: number): Ember {
  let s = (n * 7919 + 104729) % 233280;
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const pick = <T extends string>(a: readonly T[] | string): string => a[Math.floor(r() * a.length)];
  const id = pick(L) + pick(L) + String(10 + Math.floor(r() * 90));
  const count = 3 + Math.floor(r() * 9);
  const start = new Date('2026-04-01').getTime();
  const marks: Mark[] = Array.from({ length: count }, (_, i) => {
    const place = r() < 0.2 ? pick(FAR) : pick(NY);
    const at = new Date(start + (i * 12 + Math.floor(r() * 5)) * 864e5).toISOString().slice(0, 10);
    const cid = `${pick(L)}${pick(L)}${pick(L)}-${1000 + Math.floor(r() * 9000)}`;
    return m(cid, hslHex(Math.floor(r() * 360), 0.5, 0.78), pick(WORDS), place, at);
  });
  return { id, bornAt: marks[0].at, marks };
}

function hslHex(h: number, s: number, l: number) {
  const f = (k: number) => {
    const n = (k + h / 30) % 12;
    const c = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(n - 3, 9 - n, 1));
    return Math.round(c * 255).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
