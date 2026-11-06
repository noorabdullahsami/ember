# Ember

**Carry one ember. It only moves when you are next to another person.**

UXC Designathon 2026 · Theme: The Journey Matters

---

Everything digital is instant, infinite, and works at any distance. That is what removed the people from the process. Ember is a product where the only thing that moves it forward is physical presence.

You carry one object. You leave exactly one mark on it: a colour sampled with your camera from something near you, and one word. One shot, no undo. When you meet someone in person you swap, and neither of you ever gets yours back or decides where it goes next. Months later the one you started is in another city with thirty marks in it from thirty strangers.

When two people swap, the app checks whether that ember has passed through both of them before. If it has, it says so. Two people discover they were already connected by an object neither controlled.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run preview  # serve the build
```

Open it on a phone, or at a phone width in a desktop browser. It renders inside a device frame above 480px.

## How it works

There is **no server, no database, and no account**. An ember's entire state travels inside the QR code: compressed with `lz-string`, decoded and fully validated on the way in. Your own history lives in `localStorage`. Nothing about you is transmitted anywhere, because there is nowhere to transmit it to.

Two ID formats, deliberately different so they are never confused:

- **Ember:** `XS60` — public, appears everywhere.
- **Carrier:** `MAF-2969` — never rendered anywhere in the UI.

Locations are coarse centroids only. Neighbourhood or city, never a coordinate.

## Stack

React 19, TypeScript, Vite, Tailwind v4, three.js via `@react-three/fiber`, `qrcode` + `jsqr`, `lz-string`, `leo-profanity`.

The crystal is generated at runtime: a convex hull over points placed by a PRNG seeded from the ember's ID, so the same ember always looks identical, and each new hand adds exactly one vertex. The seams are lit in the carriers' sampled colours.

## Demo

Seeded with five embers so it is not empty on first open. Two controls are provided for trying it with a single phone, both labelled **Demo control** in the UI:

- **Simulate receiving an ember** (Exchange) — the first use returns `TR91`, which you carried in April, and triggers the crossing screen.
- **Reset demo data** (Log).

## Documentation

See [`DOCUMENTATION.md`](./DOCUMENTATION.md) for the full product, design, and technical write-up.
