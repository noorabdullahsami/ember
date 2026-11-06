# Ember — Project Documentation

UXC Designathon 2026 · Theme: *The Journey Matters*

---

## 1. The one-line version

Carry one ember. It only moves when you are next to another person.

---

## 2. Problem and audience

### The problem

Everything digital is now instant, infinite, and distance-free. Those three properties are what made software scale, and they are also what quietly removed other people from almost every process. You can get the output without the errand, the answer without the asking, the result without the room.

The designathon brief names the losses precisely: *less time, fewer people, fewer resources, fewer steps*. Most responses to a brief like that put **time** back and build something deliberately slow. Ember puts **people** back, which is the lever almost nobody reaches for.

Being physically next to someone is the last thing in computing that cannot be faked, scaled, automated, or done faster by spending money. Ember is built entirely on that single unforgeable constraint.

### Who it is for

Anyone who carries a phone and is occasionally in the same room as another human. No creative skill is required to participate: one colour and one word is the entire contribution, which is a deliberately low floor.

In practice the first users are dense social environments where people see the same faces repeatedly without ever talking: campuses, offices, transit, queues, conferences. The product gives two people who are already near each other a reason to interact that is lighter than conversation and more memorable than a contact exchange.

### Why it is not a proximity social app

Every existing co-presence app (Streetpass.app, PocketPass, Blue Social, ThunderPass) uses nearness for the same purpose: introducing you to strangers so you can message them. That treats presence as lead generation.

Ember never shows you a person. It shows you an object that has been through people. There is no profile, no browsing, no messaging, no follow. The meeting exists to serve the object, not to match you with a human.

---

## 3. How it responds to the prompt

The brief asks for a product that *reimagines what it means to make progress, one that values the journey, not just the destination.*

In Ember, progress has no destination and cannot be optimised:

- **It cannot be sped up.** The only input that advances an ember is a human being physically present. There is no way to buy, grind, or automate that.
- **It cannot be steered.** You do not choose who carries it next, or next after that. You contribute, you release, you lose control permanently.
- **It cannot be undone.** One colour, one word, no edit, no delete. The journey is made of commitments.
- **There is no finish.** An ember is never complete. It is only further along.
- **You are never the owner.** The product has no concept of ownership, and the word is deliberately absent from the entire codebase. You are a carrier. The thing passes through you.

The object is literally constructed out of its journey. A three-hand ember is a blunt solid; a thirty-hand ember is a complex gem veined with thirty different colours gathered in thirty different rooms. You can read how far it has travelled before you read a single number. **The journey is not represented in the interface. The journey is the object.**

The brief's five lines map directly onto the mechanics:

| The brief | In Ember |
|---|---|
| The mistakes that teach us | No undo. Every mark is permanent and public. |
| The skills we develop without realizing it | The crystal's complexity accrues invisibly, one hand at a time. |
| The unexpected discoveries | A crossing: an ember returning to hands that held it long ago. |
| The relationships we build | The product does not function alone. Co-presence is the only input. |
| The experiences that change how we approach what comes next | Your log only grows, and the crossing reaches backwards years. |

---

## 4. The product

### Core loop

1. **Carry.** You hold exactly one ember at a time. It has an ID like `XS60`.
2. **Mark.** While you hold it you leave one mark: a colour sampled from something physically near you, and one word. One shot, no undo. Your mark becomes a facet and a set of glowing seams on the crystal, permanently.
3. **Swap.** You meet someone in person. You each show a QR code and scan the other's. Your ember goes to them, theirs comes to you.
4. **Release.** You never get yours back. You cannot see where it goes next. You keep its state as it was when it left your hands.
5. **Crossing.** If an ember arrives that you have carried before, the app surfaces it: *You have both carried XS60.* Your mark and theirs are lit on the crystal, side by side, with where and when each of you held it.

### Why it is an exchange, not a one-way handoff

An early version had you give your ember away and wait to be given one. That version has a dead state where you hold nothing and can do nothing. A swap keeps every participant in the loop at all times, matches how humans already exchange things, and doubles the number of journeys created per meeting. It also produces the comparison that makes the product land: the one you gave away reached Barcelona, the one you received never left Queens.

### The mark

The mark is deliberately the smallest possible creative act.

**Colour.** You do not pick it from a palette and the system does not assign it. You point your camera at something near you and the app averages a small square at the centre of the frame. The colour is therefore physical evidence of where you were standing. A café table, a coat, a wall, the sky.

**Word.** One word, letters only, sixteen characters maximum, lowercase, profanity filtered.

Drawing was considered and rejected. It is more expressive but it is unmoderatable at any scale (an obscene drawing does not require lifting the pen), and it excludes anyone who cannot draw with a thumb. A colour is a hex value and cannot be obscene. A word can be filtered and is legible to a screen reader. The accessible choice turned out to be the better product choice.

### Commitment design

The irreversibility is the point, and the UI is built to make it felt rather than announced:

- Three discrete steps, each on its own screen.
- An explicit review step showing the colour and word together before anything is written.
- The literal sentence *This cannot be undone or edited.*
- No edit path anywhere in the app after commit.
- Immediately after committing, the facet forms on the crystal in an 800ms animation, so the consequence is visible rather than described.

---

## 5. Key user flows

### A. Receiving and marking

```
Carry (empty)  →  Exchange: Scan  →  [scan their code]  →  swap completes
     →  Carry  →  Leave your mark
     →  Mark 1: camera, sample colour, Use this
     →  Mark 2: one word, filtered, Next
     →  Mark 3: review, "This cannot be undone", Leave it
     →  facet forms  →  Done  →  Carry (marked, CTA becomes "Pass it on")
```

### B. Passing it on

```
Carry  →  Pass it on  →  Exchange: Show (QR of your ember)
     →  they scan it  →  Scan tab  →  [scan theirs]
     →  swap completes; the outgoing ember stays on screen under
        "Let them scan it" until you confirm "They have it"
```

The outgoing ember deliberately remains displayable after the swap. Both people need to scan, and the second scan cannot happen if the first person's code has already vanished.

### C. Discovering a crossing

```
Exchange: Scan  →  [scan an ember you have carried before]
     →  Crossing (full screen, takes over)
        "You have both carried TR91."
        two coloured threads draw in from either side
        the crystal grows into place with both marks' seams lit
        your entry slides in from the left, theirs from the right
     →  Keep going
```

### D. Reading a journey

```
Carry or Log  →  tap any ember  →  Detail
     crystal (rotatable)  ·  ID, hands, born
     Journey map: the route draws itself on in chronological order,
       each stop a glowing dot in that carrier's colour
     Carried by: every mark in order, your own highlighted
```

---

## 6. Design decisions and rationale

### Visual direction

A light, pastel, airy world: a translucent crystal with light trapped inside, over a soft pink-to-violet gradient.

The obvious choice for a glowing object is dark mode with neon, and that is exactly why it was avoided. Dark and glowing reads as crypto, and the second risk after that is the NFT association, which this product had to actively design away from.

**Avoiding the NFT read.** A faceted gem with an ID, a provenance chain, and a list of past holders is structurally identical to an NFT, and a viewer makes that association in about three seconds. The defences are mostly linguistic:

- The word *owner* appears nowhere in the product or the codebase. Verified.
- No scarcity, no rarity, no value, no trading, no collection.
- The vocabulary is *carried by*, *hands*, *passed to*, *held*.
- The Log is framed as what passed through you, not what you possess.
- A pastel palette rather than black and neon.

### Typography

Three roles, each doing a specific job:

- **Instrument Serif** for display. Gives the object a specimen-catalogue feeling rather than a product feeling.
- **IBM Plex Mono** for every ID, date, and count. Mono makes an ID read as an object's serial number rather than as text.
- **Inter** for body and UI.

### Motion

Motion is used only where it carries meaning:

| Moment | Behaviour | Why |
|---|---|---|
| Idle | One revolution per 20s, with drag momentum and a spring back to a neutral tilt | The object should feel alive and physical, not like a static render |
| Facet forming | 800ms, the new vertex pushing out from the old surface, its seam blooming white then settling | Makes the irreversible commitment visible |
| Crossing | Staged over ~2s: title, threads drawing in, crystal growing into place, the two entries sliding in from opposite sides | This is the emotional peak and the only place that gets a full sequence |
| Map | Route draws on over 1.2s, stops popping in sequence | Chronology made legible; you watch it travel |

All of it collapses under `prefers-reduced-motion`, which is handled in two places: a CSS rule that reduces every animation to 1ms, and a React hook that disables the idle rotation, drag momentum, grow-in, and pulse in the 3D scene, and switches the renderer to on-demand frames.

### Accessibility

Treated as a design input, not a pass at the end.

- **Contrast.** Every piece of text sits on a solid white surface, never floating on the gradient or over the crystal. Body text `#1C1917` is about 16:1 on white; muted `#57534E` is about 7.6:1. Both clear AA, and the muted colour clears AAA for normal text.
- **The camera is never required.** Denied and unavailable states are distinguished and handled. The colour step falls back to a twelve-swatch preset grid plus a hex field, and the whole app remains fully usable with the camera off, including the demo control for receiving.
- **Nothing is communicated by colour alone.** Hand count, place, date, and the word are always present as text.
- **The 3D canvas is labelled.** `describeEmber()` produces a real sentence for assistive technology: *"Ember XS60, a faceted crystal carried by 15 hands. Words left in it: late, rain, stairwell…"* The canvas itself is `aria-hidden` and the labelled wrapper carries the role.
- **Keyboard.** The crystal is focusable, Enter and Space open its detail, arrow keys rotate it. Focus is visible throughout via `:focus-visible`.
- **Targets.** Every interactive element is at least 44px.
- **Live regions.** Swap results, scan feedback, and word validation errors use `role="status"` or `role="alert"`.
- **The map has a text alternative** describing the route and every place in it.
- **The word mark is itself an accessibility decision.** Because every mark carries a word, an ember's entire contents are readable aloud. A drawing-based mark would have made the object opaque to a screen reader.

### Privacy model

This was a design constraint from the first sketch, and the architecture enforces it rather than promising it.

- **The app only ever shows where objects have been, never where people are.** There is no live location anywhere.
- **Locations are coarse centroids only.** Neighbourhood or city. No coordinate is ever stored, derived, or displayed. The device timezone supplies a city-level place, so the app never requests location permission at all.
- **Carrier IDs are never rendered.** They exist only so the app can recognise your own marks. No names, no profiles, no handles.
- **There is no server, so there is nothing to leak.** Privacy here is structural rather than a policy.
- **A crossing requires mutual, in-person consent.** It can only surface at the moment of a swap. You cannot look anyone up.

---

## 7. Technical architecture

### Stack

React 19 · TypeScript · Vite · Tailwind v4 · three.js via `@react-three/fiber` · `qrcode` and `jsqr` · `lz-string` · `leo-profanity`

### No backend, by design

There is no server, database, or account. Two consequences, both deliberate:

1. **The ember travels inside the QR code.** `encodeEmber()` packs the ember into compact positional tuples, JSON-serialises, compresses with `lz-string`, and base64s it behind an `EMBER1:` prefix. Thirty-plus hands stay well under 2KB, which scans reliably at error-correction level L.
2. **Anything scanned is untrusted.** `decodeEmber()` validates every field against a strict regex before anything enters state: the ember ID shape, the carrier ID shape, a six-digit hex, a lowercase word of 1–16 letters, an ISO date, a place string under 48 characters, and a hard cap of 500 marks. It rejects rather than repairs. A malformed or hostile code produces *"That code isn't an ember"* and nothing else.

Your own state lives in `localStorage` under one key, through a small `useSyncExternalStore` store.

### The crystal

The ember is generated at runtime, not modelled.

1. **Deterministic points.** A PRNG (`mulberry32`) is seeded from an FNV-1a hash of the ember's ID. Points are laid out with an R2 low-discrepancy sequence so that *every prefix* of the sequence is well distributed. This matters: point `i` never depends on how many points there are, so **adding a hand adds exactly one vertex and changes nothing else.** The same ember always renders identically on every device.
2. **Convex hull.** `ConvexHull` from `three-stdlib`, triangulated into a flat-shaded `BufferGeometry` so every face reads as a distinct facet. Capped at 32 points, which is at most 60 faces.
3. **Seams are the people.** Each hand owns the edges meeting at its vertex. Any carrier that would be left without a seam borrows one from the carrier holding the most, so every hand is visible on the object. Seams render as instanced hexagonal cylinders, with a second larger, transparent instanced mesh behind them as a cheap glow.
4. **Colour correction.** Sampled real-world colours are often pale, and a pastel seam vanishes against a pastel stone, so seam colours are rendered slightly more saturated and darker than the sampled value.
5. **Material.** `MeshPhysicalMaterial` with transmission, thickness, clearcoat, and iridescence, plus an opaque inner core scaled to 0.62 and tinted with the average of all carriers' colours, refracted through the shell. That inner core is what reads as light trapped inside.
6. **Environment.** `RoomEnvironment` is generated locally through a `PMREMGenerator` rather than loading an HDR file, so the object renders correctly offline in the middle of a swap.

### Performance

- **One WebGL context at a time.** Overlays replace the tab beneath them rather than stacking, so only one `Canvas` is ever mounted.
- **The Log would otherwise exhaust WebGL contexts.** It shows many crystals at once, so `thumb.ts` keeps a single offscreen renderer, renders each ember once, caches the result as a data URL keyed by `id:hands`, and the Log displays plain `<img>` elements.
- **`frameloop="demand"`** under reduced motion, so a still object costs nothing.
- **Build output:** 1.45MB raw, 413KB gzipped, almost all three.js. Acceptable on wifi; the obvious first optimisation is lazy-loading the 3D layer.

### File map

```
src/
  types.ts              Mark, Ember, Me
  store.ts              localStorage state, leaveMark, receive, crossing detection
  seed.ts               five seeded embers, the staged crossing
  places.ts             coarse centroid table + timezone → city
  qr.ts                 encode / validate-and-decode an ember
  camera.ts             useCamera hook, centre-pixel colour sampling
  components/ui.tsx     Button, Card, Spectrum, ScreenTitle, formatters
  ember/
    EmberObject.ts      geometry, seams, materials, forming animation
    Ember3D.tsx         R3F canvas, drag/momentum, reduced motion, halo
    thumb.ts            shared offscreen renderer for Log thumbnails
  screens/
    Carry.tsx           the ember you hold
    Mark.tsx            colour → word → commit
    Exchange.tsx        show QR / scan QR / demo control
    Crossing.tsx        the discovery moment
    Detail.tsx          journey map + carried-by list
    Log.tsx             everything that has passed through you
```

---

## 8. Design process

**Framing before ideation.** The brief's own sentence (*less time, fewer people, fewer resources, fewer steps*) was treated as the generative key. Both of the brief's example projects restore something efficiency removed: Slow Mail restores time, the recipe book restores a person. Mapping the likely field showed that most entries would restore time, because the first example primes it. People was the open lever.

**Competitive research narrowed the space considerably.** Roughly a dozen adjacent directions were checked and discarded on evidence, not instinct: camera-roll retrospectives (Google Photos Recap already ships year-in-colour, top faces, and selfie counts), failure and rejection logs (seven shipped apps including several counting to 1,000), collaborative storytelling (Folding Story, WriteAlong, multiple exquisite-corpse sites), screenshot organisers (four, one using the exact pitch line), calendar retrospectives (five), and peer mentoring, where *near-peer* turned out to be formal industry vocabulary with an established playbook.

The pattern across all of it: anything that points a tool at existing personal data is saturated, because it is the cheapest thing to build. Mechanics that require other people are nearly empty, because they are risky and need critical mass.

**The exchange mechanic was a correction during design,** not the original plan. The first version was a one-way handoff and had a dead state. Swapping removed it and doubled the journeys per meeting.

**The crossing was the last thing added and became the most important.** It converts a tracking product into a discovery product, and it is the only mechanic discussed that gets *more* valuable the longer the app exists rather than less.

**Three things were cut deliberately:**

- *Drawn marks* — unmoderatable and exclusionary. Colour plus word is weaker per mark and stronger as a product.
- *A homecoming* — an ember returning to its origin is a satisfying arc but it contradicts "you don't control where it goes." The crossing replaced it.
- *Nearby-people suggestions and chat* — this was specified, then cut, because it is precisely what every existing proximity app does and it would have recategorised the product as a dating app. Kept as roadmap, excluded from the build.

---

## 9. Scope: what is built, and what is not

### Built and working

- Full carry → mark → swap → crossing loop
- Procedural 3D ember, deterministic per ID, complexity scaling with hands, seams lit in carriers' colours
- Drag-to-rotate with momentum, idle rotation, facet-forming animation
- Camera colour sampling with a complete non-camera fallback
- Profanity-filtered single-word marks, irreversible
- Real QR exchange between two devices with no network at all
- Crossing detection and its full sequence
- Journey map with draw-on animation, coarse locations
- Permanent log with origin pinned
- Reduced-motion and screen-reader support throughout
- Two clearly labelled demo controls for single-phone use

### Deliberately not built

- Any server, account, or database
- Chat, nearby-people discovery, matchmaking (roadmap; cut to protect the product's category)
- Push notifications (impossible without a relay; see below)
- Precise location, anywhere

### Honest limitations

These are worth knowing before demoing, so nothing gets over-claimed.

1. **A crossing is detected on the incoming ember only.** The pitch is "any object that has passed through both of you." What is implemented is: *this ember has passed through both of you.* Because only the scanned ember travels in the QR and there is no server, the app cannot compare your other held embers against theirs. The honest framing, which is still striking, is that **an ember can return to hands that held it before.** Do not claim the broader version on stage.

2. **No notifications.** Without a central relay, nothing can tell you that an ember you released has moved. The serverless design buys a structural privacy guarantee and pays for it with the loss of that ongoing emotional thread. An optional relay carrying only an ember ID and a coarse place would restore it without exposing people.

3. **Place resolution comes from the device timezone**, so someone in Jersey City records as New York. A coarse place picker would fix it.

4. **Unknown places on the map** are offset from the previous point rather than geocoded, since the centroid table is fixed.

5. **Bundle size** is 413KB gzipped, almost all three.js. Fine on wifi, slow on a poor mobile connection.

6. **Cold start**, for real-world use rather than the demo: an ember needs somewhere to go. Two people is a complete game, which is softer than the density that passive proximity apps require, but it is still the main obstacle to shipping.

---

## 10. Roadmap

**Near term.** A coarse place picker. An optional relay for movement notifications, carrying only an ember ID and a city. Lazy-loading the 3D layer. Reporting and moderation for words at scale.

**The ember-mediated meeting.** The cut feature, properly designed: you never browse people. You see that an ember nearby wants to move and someone is willing to receive one. The meeting serves the object, not the matchmaking.

**Public ember pages.** A URL per ember showing its full journey, viewable without the app and without a single name on it. This is the growth loop: someone posts a plate, a friend looks it up, the friend installs.

**Dropping.** Leaving an ember in a place for a stranger to find, so the game stays alive for people who are not socially dense, and so a nudge to move it never reads as *you have failed to meet anybody.*
