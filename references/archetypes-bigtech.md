# Archetypes H / I / J — Big-Tech Eng + AI Lab Research + Solo Dev Educational

Calibrated from 8 verbatim audits: Netflix Tech, Uber Engineering, Airbnb Engineering, Discord Engineering, OpenAI Alignment, Hugging Face Blog, Julia Evans (jvns.ca), Dan Abramov (overreacted.io).

These are three distinct archetypes that the original 5 (A–E) didn't cover well. The original Archetype A "Engineering Case Study" was calibrated on Stripe / Vercel / Cloudflare — those are SaaS engineering. Big-tech engineering, AI-lab research (non-Anthropic), and solo-dev educational each have their own discipline.

---

## Archetype H — Big-Tech Engineering (Netflix / Uber / Airbnb / Discord)

### When to use

When the company is operating at hyperscale (PB/day, M req/sec, hundreds of nodes) and the post documents an internal architecture or platform. NOT when shipping a public product or feature (that's Archetype B Launch).

### Verbatim opening patterns

```
[Continuity reference + narrow component]
"In an earlier post we introduced Data Bridge. Today we focus on
one component, Casspactor..."
                          — Netflix Tech, Cassandra movement

[Result-first business outcome]
"6% accuracy uplift, $100M annualized revenue, 2M forecasts/sec.
DeepETT is..."
                          — Uber Engineering, DeepETT

[Story pain scenario]
"An engineer faces a grueling 36-hour process to add nodes to a
ScyllaDB cluster. What if this took less than two hours?"
                          — Discord Engineering, ScyllaDB
```

### Required structure

- **Multi-author byline (3–5 co-authors)** with explicit team affiliation
- **Numbered Pillar/Goal framework** as H2s ("Pillar 1: Validation," "Pillar 2: Visibility," "Pillar 3: Safety")
- **Architecture diagrams mandatory**: 4–12 figures per post (Uber: 12 / Netflix: 5 / Airbnb: 13 papers / Discord: 3 code blocks + workflow)
- **Apache project genealogy** with trademark glyphs (Cassandra™, Spark™, Flink®, ScyllaDB)
- **Production-scale numbers**: PB/day, M req/sec, time-reduction ratios (36h → 2h)
- **Named internal tools**: DeepETT, Casspactor, Decider Pattern, SCP, Maestro
- **Hiring CTA OR no CTA at all**: Discord ends "we're hiring!"; Netflix/Uber/Airbnb omit CTA entirely

### Exclusivity rules (only in H, never elsewhere)

1. **Multi-co-author byline (3–5 authors)** — exclusive to big-tech; SaaS Case Study (A) uses 1–2 authors
2. **Apache/OSS trademark footer with ™/®** — exclusive to big-tech; never in SaaS engineering or solo dev
3. **Raw production-scale numbers (PB/day, M/sec, billions of events)** — required for big-tech credibility; SaaS substitutes customer metrics (MRR, conversions)
4. **Numbered Pillar/Goal framework section headers** — idiomatic for big-tech; SaaS prefers narrative headers
5. **Conference-as-section convention** (Airbnb: "Academic Publications" using KDD / CIKM / EMNLP as H2s) — exclusive to big-tech academic-prestige variant
6. **Story-pain opening with gaming-vocabulary headers** ("Final Boss," "Reckoning") — Discord variant; never in formal Stripe/Vercel SaaS engineering posts

### Word count

- Architecture deep-dive: 2,800–3,500 words
- Academic year-in-review: 2,500–3,200 words (paper roster)
- Tool/CLI release: 2,500–3,500 words (with code blocks)

---

## Archetype I — AI Lab Research (OpenAI / Hugging Face — non-Anthropic)

### When to use

Original research disclosure, training-bug post-mortem, novel benchmark, dataset release. Anthropic-style research uses Archetype D directly. OpenAI and Hugging Face have distinct sub-styles within this category.

### Two sub-modes

**I.1 — Institutional alignment disclosure (OpenAI)**

```
[Self-disclosure-of-bug opening]
"We discovered Chain-of-Thought had accidentally been graded in some
RL runs for released models. Affected models: GPT-5.4 Thinking,
5.1–5.4 Instant, 5.3/5.4 mini..."
```

- Unsigned / institutional voice (no human byline)
- Admit-fault opening as a governance signal
- No eval tables — qualitative behavioral analyses
- Explicit "cannot rule out effects which are harder to measure" hedges
- Closes with process commitment, not a roadmap

**I.2 — Community / product-pitch variant (Hugging Face)**

```
[Aphoristic personal opening]
"Even before agents wrote half of it, codebases were hard to explain.
Sometimes the original author was me."
```

- Single-author handle (cfahlgren1) with upvote counter visible
- Coined phrase as title ("Agent Traces Are the Memory")
- One central CLI/bash code block as the artifact
- Commercial pitch dressed as observation
- Cross-links to outside thinkers (Sean Goedecke, Ramp, OpenAI)

### Exclusivity rules

1. **Self-disclosure-of-bug opening** — exclusive to OpenAI alignment; off-brand at Anthropic, impossible at HF community
2. **Upvote counter visible on post** — exclusive to HF community blogs; never on OpenAI/Anthropic official research
3. **Naming specific deployed-model SKUs in a research post** — OpenAI variant only; Anthropic doesn't SKU-name Claude versions in alignment posts
4. **No benchmark tables in a "research" post** — acceptable for OpenAI alignment and HF community; conspicuous at Anthropic
5. **CLI/bash code block as central artifact** — exclusive to HF community / product-leaning AI posts; never the centerpiece of OpenAI alignment or Anthropic research

### Word count

- OpenAI alignment disclosure: 2,000–3,000 words
- HF community technical post: 600–1,200 words (short and punchy)

---

## Archetype J — Solo Dev Educational (Julia Evans / Dan Abramov)

### When to use

Personal blog post by a single developer, teaching or thinking-out-loud about a technical topic. NEVER for big-tech eng posts (Archetype H), never for SaaS product launches (B), never for research notes (D / I).

### Verbatim opening patterns

```
[First-person admission, lowercase enthusiasm]
"8 years with Tailwind, and I now migrated away. It was SO fun and
SO interesting. I'm not very good at structuring my CSS, but here's
what I learned..."
                          — Julia Evans, "Moving away from Tailwind"

[Provocation + nostalgia hook]
"Remember files?"
                          — Dan Abramov, "A Social Filesystem"
```

### Required structure

- **Single byline. Always.** Solo dev = solo author.
- **Lowercase headers** ("it turns out Tailwind taught me a lot," "the systems i'm going to talk about") — Evans signature
- **Numbered learning steps** (1–9) — Evans-mode for catalog posts
- **Asterisk dividers (`* * *`)** — Abramov-mode for essay form
- **No architecture diagrams.** Replace with typographic visuals: ASCII repetition (`.doc.doc.doc.jpg`), pseudo-paths (`C:\Users\alice`), hand-drawn zine references
- **Vulnerability admissions** ("I'm not very good at," "Sometimes the original author was me")
- **Cultural / political essay references as primary citations** (Evans cites "Tailwind and the Femininity of CSS")

### Closing moves

- Evans: `"that's all for now!"` + gratitude shoutout + RSS subscribe CTA
- Abramov: `"Pay what you like"` → Ko-fi donation link

### Exclusivity rules

1. **Hand-drawn zines / comics / typographic art** — exclusive to solo-dev educational. Inserting a zine into a Netflix tech post is jarring.
2. **Lowercase headers + emoji-free intimate tone** — idiomatic for jvns.ca; unprofessional in big-tech (H).
3. **Reader-supported tip-jar / Ko-fi CTA** — exclusive to solo-dev. Big-tech (H) replaces with hiring CTA or omits.
4. **Vulnerability admissions** ("I'm not good at X") — solo-dev signature. Big-tech frames learning as institutional, never personal.
5. **Cultural / political essay references as primary citations** — solo-dev exclusive. Big-tech (H) cites Apache projects, papers, RFCs.
6. **Single-section-with-divider essay form** (Abramov's `* * *`) — solo-dev exclusive; big-tech requires H2 hierarchy.

### Word count

- Catalog learning post (Evans-mode): 1,800–2,500 words
- Philosophical essay (Abramov-mode): 2,500–4,500 words

---

## Cross-category summary

| Archetype | Byline | Diagrams | Code blocks | CTA |
|---|---|---|---|---|
| H. Big-tech eng | 3–5 co-authors | 4–12 mandatory | 0–4 | Hiring or none |
| I.1 OpenAI alignment | Institutional / unsigned | 0 (qualitative) | 0 | Process commit |
| I.2 HF community | Single handle + upvote count | 0–1 | 1 (CLI center) | Soft product pitch |
| J. Solo dev educational | 1 author | 0 (typographic visuals) | small inline | Tip jar / RSS |

When unsure, ask: "Is this a hyperscale team output? a frontier lab disclosure? a personal blog?" Pick one. Never mix.
