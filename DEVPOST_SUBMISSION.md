# Ember — Devpost submission

Copy each field across. Fields marked **[ACTION]** need something from you.

---

## 1. Project name

```
Ember
```

---

## 2. Elevator pitch

*(Devpost caps this at 200 characters. This is 104.)*

```
Carry one ember. Leave one colour and one word in it. It only moves when you stand next to another person.
```

---

## 3. Project story

```markdown
## Inspiration

Every prompt about slowing down gets answered the same way. Someone builds a thing with a timer on it. The brief even hands you the example: a note that arrives tomorrow. That is the convention, and we very nearly followed it.

However, read the brief's own sentence again. It says we are pushed toward less time, fewer people, fewer resources, fewer steps. Four things were taken. Almost everyone reaches for time, because time is the easy one to hand back; add a delay, add a countdown, call it slow. Nobody reaches for people.

So we asked what is genuinely left that cannot be optimised. Not artificially slowed, actually impossible to speed up. The answer turned out to be embarrassingly simple. You cannot be in two rooms at once. Physical presence is the last unforgeable thing in computing. You cannot buy it, automate it, scale it, or get a model to do it for you.

Ember is built on that single constraint and nothing else.

## What it does

You carry one object. It has an ID, like XS60, and a shape made entirely out of the people who have held it.

While it is yours you leave exactly one mark on it. One colour, taken with your camera from something physically near you, so the colour is evidence of a real room. One word. One shot, no undo, no edit, no second attempt.

Then you meet someone. A queue, a subway, a class, a date. You each show a code, you each scan the other's, and you swap. Your ember goes to them and theirs comes to you. You never get yours back. You never choose where it goes next. Four months later the one you started is in Barcelona with thirty-one marks in it from thirty-one strangers, and the one you were given never left Queens.

And then the part we did not plan for and ended up caring about most. When two people swap, the app checks whether that ember has passed through both of them before. If it has, it says so: *You have both carried TR91. You held it in Downtown Brooklyn in April. They held it in Lisbon in September.* Two people standing in front of each other find out they were already connected by an object neither of them controlled.

## How we built it

React, TypeScript, Vite, Tailwind, and three.js through react-three-fiber. Deployed on Vercel.

There is no server. No database, no account, no login, nothing. This was the hardest architectural decision and it is the one we would defend hardest. The ember's entire state travels inside the QR code: packed into compact tuples, compressed with lz-string, and validated field by field on the way in, because anything scanned is untrusted and should be rejected rather than repaired. Your own history lives in localStorage. Privacy here is not a policy we wrote, it is a thing we cannot violate, because there is nowhere for the data to go.

The crystal is generated, not modelled. A hash of the ember's ID seeds a PRNG, which places points using an R2 low-discrepancy sequence so that every prefix of the sequence is well distributed. That property matters more than it sounds: point number seven never depends on how many points there are in total, which means adding a hand adds exactly one vertex and disturbs nothing else, and the same ember renders identically on every device that has ever held it. A convex hull over those points, flat shaded, gives the facets. Each carrier owns the seams meeting at their vertex, lit in the colour they sampled, so a thirty-hand ember is veined with thirty different rooms.

The marks are deliberately the smallest creative act we could design. A colour is a hex value, so it cannot be obscene. A word can be filtered and read aloud by a screen reader. We wanted drawing. Drawing is unmoderatable at any real scale and it excludes everyone who cannot draw with a thumb, so we cut it, and the accessible choice turned out to be the better product.

## Challenges we ran into

**Finding an idea that was not already shipped.** This took longer than the build. We checked and killed about a dozen directions on evidence: camera roll retrospectives (Google Photos Recap already does year-in-colour, top faces, selfie counts), failure and rejection logs (seven shipped apps, several of them counting to one thousand), collaborative storytelling, screenshot organisers, calendar retrospectives, peer mentoring. One competitor was already using the exact pitch line we had written down.

**Making a gem that does not look like an NFT.** A faceted crystal with a serial number and a list of past holders is, visually and structurally, indistinguishable from a token. A judge makes that association in about three seconds. The defence turned out to be almost entirely linguistic. The word "owner" does not appear anywhere in this product or in its source code, and we checked. No collection, no rarity, no value, no trading. You are a carrier. The thing passes through you.

**The Log tried to kill the browser.** It shows many crystals at once, and a WebGL context per crystal exhausts the browser's context limit fast. We render each one through a single shared offscreen renderer, cache the result as an image, and the Log never touches WebGL at all.

**The crossing cannot be as broad as the pitch.** We would love to check whether *any* object has ever passed through both of you. Only the scanned ember travels in the code, and there is no server, so the app can only compare histories inside that one object. We could have added a backend and had the bigger feature. We kept the constraint instead, because an architecture that cannot leak is worth more than a feature, and an ember returning to hands that held it years ago is already the best moment in the product.

## Accomplishments that we're proud of

Two people can genuinely swap an object, face to face, on two phones, with no network, no account, and no server anywhere in the loop. That is the whole thesis working.

The crossing. It is the only mechanic we designed that gets more valuable the longer the product exists rather than less. Every other app in this category decays. This one compounds.

Accessibility that is load bearing rather than bolted on. The camera is never required; deny it and the entire app still works. Every mark carries a word, so the object is readable aloud. Reduced motion is handled in the CSS and separately inside the 3D loop. Text never floats on the gradient, so contrast holds at roughly 16:1 for body and 7.6:1 for secondary.

And a privacy model that is structural. The app only ever shows where objects have been, never where people are. No coordinates exist anywhere; places are neighbourhood centroids and the city comes from your timezone, so we never ask for location at all.

## What we learned

The most useful thing we learned was not about building. It was that anything which points a tool at data you already have is a bloodbath, because it is the cheapest thing in the world to build. Photos, calendar, screenshots, failures, firsts. Three apps each, most of them unrated. Mechanics that only work when another person turns up are nearly empty by comparison, because they are risky and they need people to show up. The empty shelf is empty for a reason, and the reason is a good one if you are willing to take the bet.

We also learned, the slow way, that constraints are not the price of the design. Dropping drawing in favour of a colour and a word felt like a loss for about an hour. It produced a better object, a moderatable product, and an accessible one.

## What's next for Ember

A coarse place picker, so that someone in Jersey City is not recorded as New York. An optional relay carrying nothing but an ember ID and a city, so you learn that something you released has moved, without a single person becoming visible.

Public pages, one per ember, readable in a browser with no app and not one name on them. Someone posts a plate, a friend looks it up, the friend installs. That is the growth loop and it costs nothing.

Dropping: leaving an ember in a place for a stranger to find, so the game survives for people who are not socially dense, and so a nudge to move it never reads as *you have failed to meet anybody.*

And the feature we cut on purpose and will put back carefully: letting an ember nearby find someone willing to receive it. Never browsing people, never matching humans. The meeting serves the object. That distinction is the whole product, and the day we lose it we are just another proximity app.
```

---

## 4. Built with

```
react, typescript, vite, tailwindcss, three.js, react-three-fiber, webgl, qrcode, jsqr, lz-string, leo-profanity, mediadevices-api, canvas, localstorage, vercel
```

---

## 5. Try it out link

```
https://ember-five-gold.vercel.app/
```

---

## 6. Project media image **[ACTION]**

Use the Crossing screen. It is the strongest frame in the product: the serif headline, the two coloured washes, the crystal with both marks lit.

Take it at a phone width so it reads as an app. Second choice is the Carry screen with the crystal and the card.

---

## 7. Video demo link **[ACTION]**

Script is at the bottom of this file.

---

## 8. Prototype link

```
https://ember-five-gold.vercel.app/
```

No login, no access request, opens straight into seeded data.

---

## 9. Slides link **[ACTION, optional]**

Skip unless you have spare time after the video. The video and the write-up carry more weight, and a thin deck reads worse than none.

---

## 10. Problem and audience

```
Software got instant, infinite, and distance-free. Those three properties are what let it scale, and they are also what quietly removed other people from almost every process we have. You can get the output without the errand, the answer without the asking, the result without the room. AI did not start this, but it has removed the last few steps that still had a person standing in them.

The brief names the losses exactly: less time, fewer people, fewer resources, fewer steps. We built for the second one, because it is the only one of the four that nobody reaches for.

Who it is for: anyone with a phone who is occasionally in the same room as another human. The floor is deliberately on the ground. One colour and one word is the entire contribution, so no creative skill is required to take part.

In practice the first users are the dense social environments where people see the same faces for months and never speak: campuses, offices, transit, queues, conferences. Ember gives two people who are already near each other a reason to interact that is lighter than starting a conversation and more durable than swapping a contact.

What it is not: every existing co-presence app, Streetpass.app, PocketPass, Blue Social, ThunderPass, uses nearness for one purpose, which is introducing you to strangers so you can message them. That treats being near someone as lead generation. Ember never shows you a person. It shows you an object that has been through people. No profile, no browsing, no messaging, no follow.
```

---

## 11. How does your project respond to the prompt?

```
The brief asks for a product that reimagines what it means to make progress. Not a product that documents a journey, a product where progress itself works differently. So we made progress something that cannot be optimised in any of the four ways software usually optimises things.

It cannot be sped up. The only input that advances an ember is a human being physically present. There is no way to buy that, grind it, or automate it.

It cannot be steered. You do not choose who carries it next, or next after that. You contribute, you release, and you lose control permanently.

It cannot be undone. One colour, one word, no edit, no delete. The journey is made of commitments rather than drafts.

It does not finish. An ember is never complete. It is only further along.

And you never own it. The product has no concept of ownership and the word is absent from the entire codebase. You are a carrier.

The clearest expression of this is that the journey is not displayed in the interface, it is the object. A three-hand ember is a blunt little solid. A thirty-hand ember is a complex gem veined with thirty colours gathered in thirty different rooms. You read how far it has travelled before you read a single number, because the thing in your hand is made of where it has been.

The brief's five lines map onto the mechanics directly. The mistakes that teach us: no undo, every mark permanent and public. The skills we develop without realising it: the crystal accrues complexity one hand at a time, invisibly. The unexpected discoveries: a crossing, when an ember returns to hands that held it long ago. The relationships we build: the product does not function alone, co-presence is the only input it has. And the experiences that change how we approach what comes next: your log only grows, and a crossing can reach back years.
```

---

## 12. Your solution and key user flow

```
Ember is a phone web app. You carry one object at a time and it only moves when you are physically next to another person.

Receiving and marking:
1. You are carrying an ember, say QF18, with eight hands already in it.
2. Leave your mark. Point your camera at something near you, a coat, a table, the sky, and the app takes the colour at the centre of the frame. The colour is evidence of a real place.
3. One word. Sixteen characters, letters only, filtered.
4. A review step shows the colour and the word together, with one sentence: this cannot be undone or edited. You commit, and a new facet forms on the crystal with your seams lighting in your colour.

Passing it on:
5. You meet someone. You show your code, they scan it. They show theirs, you scan it. Both embers move at once.
6. Your outgoing ember stays on your screen until you confirm they have it, because both people need to scan and the second scan cannot happen if the first code has already vanished.
7. Yours is gone. You cannot see where it goes next.

The crossing:
8. If the arriving ember is one you have carried before, the screen is taken over. "You have both carried TR91." Two threads in the two colours draw in from either side, the crystal grows into place with both of your marks lit and everyone else's dimmed, and the two entries slide in: you held it in Downtown Brooklyn in April 2026, they held it in Lisbon in September 2026.

Reading a journey:
9. Tap any ember to open it. The crystal rotates. The route draws itself on in chronological order, each stop a dot in that carrier's colour. Below it, every mark in order: colour, word, place, date, with your own highlighted.

The Log:
10. Everything that has ever passed through your hands, permanently, with the one you brought into the world pinned at the top and labelled. You are not looking at what you own. You are looking at what you were part of.

Judges with one phone: two controls labelled Demo control in the UI let you receive an ember and reset the data. The first simulated receive triggers a real crossing.
```

---

## 13. Design process

```
We started from the brief's own sentence rather than from an idea. Less time, fewer people, fewer resources, fewer steps. Both of the brief's examples restore something that efficiency removed; Slow Mail restores time, the recipe book restores a person. Mapping the likely field made it obvious that most entries would restore time, because the first example primes it. People was the lever left on the table.

Then we spent longer killing ideas than building. Around a dozen directions were checked against what already ships and dropped on evidence: camera roll retrospectives, failure logs, collaborative storytelling, screenshot organisers, calendar retrospectives, peer mentoring. The pattern was consistent. Anything that points a tool at data you already have is saturated, because it is the cheapest thing to build. Mechanics that need another person to show up are nearly empty.

Three decisions shaped the product more than the rest.

The exchange was a correction, not the plan. The first version had a one-way handoff: you give yours away and wait for someone to give you one. That version has a dead state where you hold nothing and can do nothing. Swapping removed the dead state, matched how people already trade things, and doubled the journeys created per meeting. It also produced the comparison the whole thing rests on: the one you gave away reached Barcelona and the one you received never left Queens.

Drawing was cut, and it hurt. A drawn mark is more expressive and more personal. It is also unmoderatable at any real scale, and it shuts out anyone who cannot draw with a thumb. A colour is a hex value and cannot be obscene; a word can be filtered and read aloud. We lost expressiveness per mark and gained a product that can exist.

The nearby-people feature was specified and then deliberately cut. Suggesting someone near you to meet is precisely what every existing proximity app does, and adding it would have recategorised this as a dating app with a gimmick attached. It stays on the roadmap in an ember-mediated form: you never browse people, you see that an object wants to move.

Two tradeoffs we made with our eyes open. No server buys a privacy guarantee that cannot be violated and costs us the ability to notify you when an ember you released moves, which was a real emotional thread we gave up. And no homecoming: an ember returning to its origin is a satisfying arc, but it contradicts "you do not control where it goes," so the crossing replaced it and turned out better, because the payoff is not your object coming back to you, it is your object turning up in the hands of someone standing in front of you.
```

---

## 14. Visual design and accessibility

```
The visual direction is light, pastel, and nearly empty: a translucent crystal with light caught inside it, over a soft pink to violet gradient. The obvious treatment for a glowing object is dark mode with neon, which is exactly why we did not use it. Dark and glowing reads as crypto, and a faceted gem with a serial number and a list of past holders is already one association away from being mistaken for a token.

That risk shaped more decisions than the palette did, and most of the defence is linguistic rather than visual. The word "owner" appears nowhere in the product or the source. No collection, no rarity, no value, no trading. The vocabulary throughout is carried by, hands, passed to, held.

Typography does three jobs. Instrument Serif for display, which gives the object a specimen-catalogue feeling rather than a product feeling. IBM Plex Mono for every ID, date, and count, because mono makes an identifier read as an object's serial number rather than as text. Inter for everything else.

Motion is used only where it carries meaning. The crystal idles at one revolution per twenty seconds with drag momentum and a spring back to neutral, so it feels physical rather than like a static render. A facet forms over 800ms when you commit, so an irreversible decision is shown rather than described. The crossing is staged over roughly two seconds, which is the only full sequence in the app, because it is the only moment that earns one. The map route draws on in chronological order, so you watch it travel.

On accessibility, the decisions that mattered most were made early enough to change the product rather than decorate it.

The camera is never required. Denied and unavailable are handled as different states, the colour step falls back to a twelve-swatch grid and a hex field, and the entire app including the demo receive works with the camera switched off.

Every piece of text sits on a solid white surface and never floats on the gradient or over the crystal. Body text is roughly 16:1 against white and secondary text roughly 7.6:1, so both clear AA and the secondary clears AAA.

Nothing is communicated by colour alone. Hand count, place, date, and the word are always present as text.

The 3D canvas is labelled with a real sentence rather than a filename: "Ember XS60, a faceted crystal carried by 15 hands. Words left in it: late, rain, stairwell..." The canvas is hidden from assistive technology and the labelled wrapper carries the role. The crystal is focusable, Enter and Space open its journey, arrow keys rotate it.

Reduced motion is handled in two separate places, because one is not enough: a CSS rule that collapses every animation, and a React hook that disables idle rotation, drag momentum, the grow-in, and the pulse inside the 3D scene, and switches the renderer to on-demand frames so a still object costs nothing.

Live regions announce swap results, scan feedback, and word validation. Every target is at least 44px. The journey map carries a text alternative naming the route and every place in it.

The one decision that ties the visual and the accessible together: because every mark carries a word, an ember's entire contents can be read aloud. A drawing-based mark would have made the object beautiful and completely opaque to a screen reader. We chose the one that can be heard.
```

---

# Three-minute video script

Shoot on a phone, screen recorded, with voiceover. Times are cumulative.

**0:00–0:20 — The hook, no logo, no title card**

> Everything on your phone is instant, infinite, and works at any distance. That is what made software scale. It is also what quietly took the other people out of almost everything we do.

*On screen: the Carry screen, crystal turning slowly. Let it breathe.*

**0:20–0:40 — The constraint**

> So we asked what is actually left that cannot be sped up. Not artificially slowed down. Genuinely impossible to optimise. There is one thing. You cannot be in two rooms at once.

> This is Ember. You carry one object, and it only moves when you are standing next to another person.

**0:40–1:20 — The mark**

*Screen record the real flow: camera up to something in the room, sample the colour, type the word, the commit screen, the facet forming.*

> While it is yours, you leave exactly one mark. One colour, taken with your camera from something physically near you, so the colour is proof of a real room. One word. One shot. No undo, no edit.

> And it becomes part of the object. Every facet on this is a person. Every seam is lit in the colour they picked up wherever they were standing.

**1:20–1:50 — The swap**

*Two phones. Show one code, scan it with the other. Make this real, not mocked.*

> Then you meet someone and you swap. Your ember goes to them, theirs comes to you. You never get yours back and you never choose where it goes next.

> There is no server in this. The entire object travels inside the code. Nothing about you is uploaded anywhere, because there is nowhere to upload it to.

**1:50–2:20 — The journey**

*Open the Detail screen. Let the map draw itself on. Scroll the Carried by list.*

> Four months later, the one you started is somewhere else. Thirty-one hands. Thirty-one words from thirty-one strangers, in colours picked up in thirty-one different rooms.

**2:20–2:50 — The crossing. This is the climax, do not rush it.**

*Trigger the crossing. Let the full animation run with no voiceover over the first beat.*

> And then this.

*pause*

> When two people swap, Ember checks whether that object has passed through both of them before. You held it in Brooklyn in April. They held it in Lisbon in September. Neither of you chose any of it.

> You just found out that a stranger standing in front of you was already connected to you by something neither of you controlled.

**2:50–3:00 — Close**

*Back to the crystal, turning.*

> Progress here cannot be bought, automated, or hurried. It only moves when people do.

**Shooting notes**

Record the swap with two real phones. It is the only sequence a judge cannot be sure of from screenshots and it is worth the extra take.

Do not narrate over the first two seconds of the crossing. Let the animation land on its own, then speak.

Do not say "any object that has ever passed through both of you." Say "that object." The broader version is not what is built, and the write-up says so.

Hold the last shot for a full second after the final line. Do not end on a logo.
