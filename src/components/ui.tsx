import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { Ember } from '../types';

export function Button({ variant = 'primary', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'quiet' }) {
  const base = 'min-h-12 rounded-full px-6 text-[15px] font-medium transition active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100';
  const look = variant === 'primary' ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-hairline';
  return <button className={`${base} ${look} ${className}`} {...p} />;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[28px] bg-white shadow-[0_1px_0_#E7E5E4,0_12px_40px_-24px_rgba(28,25,23,0.35)] ${className}`}>{children}</div>;
}

/** The ember's colours are the only accent the product has. */
export function Spectrum({ ember, className = '' }: { ember: Ember; className?: string }) {
  const marks = ember.marks;
  if (!marks.length) return null;
  return (
    <div className={`flex h-1.5 overflow-hidden rounded-full ${className}`} aria-hidden>
      {marks.map((m, i) => (
        <span key={i} className="flex-1" style={{ background: m.color }} />
      ))}
    </div>
  );
}

export const hands = (n: number) => `${n} ${n === 1 ? 'hand' : 'hands'}`;

export function monthYear(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
export function shortDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ScreenTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mx-4 mt-3 rounded-[22px] bg-white px-5 py-4 shadow-[0_1px_0_#E7E5E4]">
      <h1 className="font-display text-[34px] leading-none tracking-tight">{children}</h1>
      {sub && <p className="mt-1.5 text-[14px] text-muted">{sub}</p>}
    </div>
  );
}
