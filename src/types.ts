export type Mark = {
  carrierId: string; // "MAF-2969" — never rendered
  color: string; // "#C9A4E8"
  word: string; // lowercase, ≤16 letters
  place: string; // coarse only: "Bushwick, NY"
  at: string; // ISO date
};

export type Ember = {
  id: string; // "XS60"
  bornAt: string;
  marks: Mark[]; // oldest → newest; marks.length === hands
};

export type Me = {
  userId: string;
  carrying: Ember | null;
  originEmberId: string;
  held: string[];
};
