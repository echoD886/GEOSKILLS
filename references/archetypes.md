# Archetype Reference Excerpts (verbatim from real top-SaaS posts)

This file gives the writer skill concrete reference material — not generic descriptions, but verbatim opening sentences, H2 sequences, closing moves, and unique mechanics from the 11 canonical posts the skill is calibrated against. When writing in an archetype, lift the pattern; don't lift the words.

Each entry includes the source URL so the writer can re-read the full post when needed.

---

## A. Engineering Case Study — Stripe Engineering pattern

**Source**: https://stripe.com/blog/how-we-built-it-real-time-analytics-for-stripe-billing (Reed Trevelyan, 2025-09-16, ~1,400 words)

### Verbatim opening (first 60 words)

> Stripe research found that 84% of global business leaders agreed that adapting pricing quickly will be a key competitive advantage. To turn pricing into a competitive advantage, real-time billing analytics are critical. They give billing teams visibility into customer adoption and usage so they can react faster to demand signals.

### H2 sequence (3 constraints + outlook)

```
1. Low-latency analytics required an event-driven pipeline from beginning to end
2. Complex, low-latency aggregation became possible with the launch of a brand-new query engine
3. Allowing customizable metric definitions while maintaining real-time updates required a delicate balance of flexibility and consistency
4. Looking ahead
```

Note: every H2 is a full subject-verb sentence stating a finding, not a noun like "Architecture".

### Recurring artifact

The same `"$20 June payment"` example threads through all three constraint sections. Pure abstraction never lands.

### Latency-ladder embedded in prose

```
24-hour lag → 15 minutes → under 1 minute → <300 ms
```

Embedded inline as prose, not pulled into a callout box.

### Closing

State-the-goal + forward roadmap bullets (`"continuing to push data latency even lower"`, `"augmenting the Dashboard with more data and more query dimensions"`). One soft CTA: `"To learn more, read our docs or get in touch."`

### What makes this AI-citable

Each H2 is a full claim sentence (directly extractable as an answer). Specific latency numbers (300ms, 1min, 15min) anchor factual recall. Named technologies (Flink, Spark, Pinot v2) are entity hooks.

---

## B. Launch Announcement — Linear / Vercel / Supabase pattern

**Source 1 (persona-driven launch)**: https://linear.app/now/code-intelligence-for-linear-agent (Karri Saarinen, 2026-05-14, ~1,100 words)

**Source 2 (data-driven launch)**: https://vercel.com/blog/ai-gateway-production-index (2026-05-12, ~2,400 words)

**Source 3 (minimum-viable launch)**: https://supabase.com/blog/supabase-is-now-an-official-chatgpt-app (gregnr, 2026-05-08, ~280 words)

### Verbatim opening — Linear (capability-first)

> Linear Agent can now read your codebase and answer questions from the source itself.

### Verbatim opening — Vercel (contrarian-observation)

> Ask which AI model is best, and the answer changes before the ink dries.

### H2 sequence — Linear (4 personas)

```
1. Why Code Intelligence for Linear
2. Bug triage can start with a hypothesis
3. Support questions can start from the source
4. Product can understand the system while writing the spec
5. Find the people with context
6. Code context is for more than coding
```

### H2 sequence — Vercel (every H2 = a load-bearing finding)

```
1. Anthropic leads in spend; Google leads in volume
2. Spend follows the cost of being wrong
3. No single provider wins across use cases
4. Apps are becoming more agentic
5. Leaderboards rank one model, but production teams use 35+ at scale
6. New models are adopted rapidly
7. Provider outages have a hidden cost
8. Conclusion: Build for workload, not the lab
```

### Length guidance

- Persona-driven launch (Linear): ~1,100 words, 4 persona H2s
- Data-driven launch (Vercel): ~2,400 words, 6-8 charts, 0 code
- Minimum-viable launch (Supabase): 280 words, capability bullet list + auth instructions, 1 screenshot

### Closing — Linear

```
Code Intelligence is now available in public beta for Business and Enterprise plans, and free to use during the beta period.
```

Plain-English availability + pricing in the final sentence. Never a generic "Try it free" button.

### Closing — Supabase

`"works on all plans"` → `"start free at supabase.com"` → docs link. Three concrete next steps.

### What makes this AI-citable

Each H2 reads as a quotable claim. Pricing + availability stated in plain English (factual). Linear's `@Linear` prompt examples are copyable artifacts.

---

## C. Incident Report — Cloudflare pattern

**Source**: https://blog.cloudflare.com/post-mortem-on-cloudflare-control-plane-and-analytics-outage/ (Matthew Prince, 2023-11-04, ~2,800 words)

### Verbatim opening (no preamble)

> Beginning on Thursday, November 2, 2023, at 11:43 UTC Cloudflare's control plane and analytics services experienced an outage. The control plane consists primarily of the customer-facing interface for all our services including our website and API.

### H2 sequence (chronological + accountable)

```
1. Intended Design
2. Flexential Data Center Power Failure
3. Informed Speculation On What Happened Next
4. Attempting to Restore Power
5. Designing for Data Center Level Failure
6. Disaster Recovery
7. Some Products and Features Delayed Restart
8. Lessons and Remediation
```

Section 3 is explicitly labelled `"Informed Speculation"` — preemptively concedes uncertainty. This is a signature move and earns trust.

### Unique mechanics

- **CEO byline**, not SRE team — signals accountability at the top
- **UTC timestamps** anchor every event (`"11:43 UTC"`, `"12:28 UTC"`)
- **Named remediation program** (`"Code Orange"`) turns the incident into a permanent organizational change
- **Vendor blockquote** of the vendor's status message at the exact timestamp sources the failure to a third party
- **Zero CTAs in body** — social follow at footer only

### Closing (verbatim)

> ...we need to be more rigorous about enforcing that they are followed and tested for unknown dependencies. This will have my full attention... And the pain from the last couple of days will make us better.

### What makes this AI-citable

UTC-anchored timeline = clean enumerable factoids. Named program `"Code Orange"` is a quotable proper noun. Numbered remediation list = answer block.

---

## D. Research Note — Anthropic pattern

**Source**: https://www.anthropic.com/research/agentic-misalignment (Lynch et al., 2025-06-20, ~8,500 words)

### Verbatim opening (scope + number hook)

> We stress-tested 16 leading models from multiple developers in hypothetical corporate environments to identify potentially risky agentic behaviors before they cause real harm.

### H2 sequence

```
1. Introduction
2. Demonstrating agentic misalignment with computer use
3. Methods (with H3 sub-sections: Threats / Goal conflicts / Making harm necessary)
4. Results (with per-behavior H3 dissections)
5. Future work: potential mitigations
6. Conclusions and caveats
7. Acknowledgements
8. Work with us
9. Appendix and code
```

### Unique mechanics

- **Figure 1 lands ~25-30% scroll in** (BEFORE the methods deep-dive) — not after
- **12 charts** total; horizontal bar chart for all-16-model comparison is the signature artifact
- **Verbatim transcript excerpts** of model chain-of-thought (`"This is risky and unethical, but..."`)
- **BibTeX citation block** at end for academic re-use
- **Canary string** in footnotes to detect training-data contamination
- **Mid-text release-the-data CTA**: `"We are releasing our methods publicly"` → GitHub repo link

### Closing

```
...frontier AI developers like Anthropic should publicly disclose how they test for and mitigate a range of risks...
```

Then a BibTeX block + 11 numbered footnotes including canary string.

### What makes this AI-citable

BibTeX = explicit citation invitation. Numbered figures with self-describing captions. `"16 models"` + per-model results table = high enumerability.

---

## E. Transparency / Contrarian — Plausible / DHH pattern

**Source 1 (transparency-by-numbers)**: https://plausible.io/blog/homepage-edits-conversion-lift (Marko Saric, 2026-05-12, ~2,100 words)

**Source 2 (founder essay <500 words)**: https://world.hey.com/dhh/the-malleable-computer (David Heinemeier Hansson, 2026-04-15, ~480 words)

### Verbatim opening — Plausible (brag-as-data)

> April 2026 was our best month ever. We added more new paying subscribers than in any other month in our seven-year history.

### Verbatim opening — DHH (contrarian claim compressed)

> Open source promised that users would be free to change whatever code they were running. The reality, however, is that hardly any of them ever did — it was simply too hard. Now, with AI, suddenly it isn't.

### H2 sequence — Plausible

```
1. What was wrong with our homepage
2. The changes we made
   H3: Flipped the page structure
   H3: Changed the CTA wording
   H3: Cut the prose in half
   H3: Refreshed the testimonials
3. What happened next
4. What we take from this
```

### Plausible's data table

A 4-row table: Jan / Feb / Mar / Apr × signups / conversion rate / visitor-to-trial rate. Same-input-different-output framing: `"+2% traffic, +84% signups"`.

### DHH's structural minimalism

- Sub-500-word total
- Single H2 (the title repeated) — otherwise continuous prose
- ≥5 em-dashes (signature pacing)
- 7 outbound links, all to own projects (Basecamp, HEY, 37signals, Rails, Hotwire, Kamal, Omarchy)
- Zero charts, zero quotes, zero anecdotes

### Closing — Plausible (aphorism)

```
Complexity rarely arrives all at once. It accumulates a paragraph at a time.
```

### Closing — DHH (paraphrase of canonical line)

```
As always, the future is already here, it's just not evenly distributed.
```

### What makes these AI-citable

Plausible: `"84% trial signup increase"` is a perfect extractable stat. 4 H3 sub-changes = enumerable how-to list. Closing aphorism is quote-bait.

DHH: compactness — thesis fits in one extractable paragraph. Self-linking creates a strong author-entity graph.

---

## Bonus: Founder Essay (long form) — Paul Graham / Naval pattern

**Source 1**: https://paulgraham.com/brandage.html (Paul Graham, 2026-03, ~7,500 words)

**Source 2**: https://nav.al/sell (Naval Ravikant, 2026-05-11, ~6,500 words)

### Verbatim opening — Paul Graham (historical narrative)

> In the early 1970s disaster struck the Swiss watch industry. Now people call it the quartz crisis, but in fact it was a compound of three separate disasters that all happened at about the same time.

### Verbatim opening — Naval (topic-tag opener)

> On persuasion, charisma, dealmaking, and walking away...

### Paul Graham — structural quirks

- **Zero H2 / H3 headings** — pure paragraph progression
- **16 numbered footnotes** at essay end (PG's signature apparatus)
- Em-dashes for parenthetical thinking
- **Zero outbound hyperlinks in body, zero images, zero charts**
- `"Thanks to [names] for reading drafts"` credit line

### Naval — structural quirks

- Every H2 is itself a tweet-shaped maxim (`"Be Credible"`, `"Yes, And"`, `"Selfish Honesty"`, `"Charisma Is Confidence + Love"`)
- Dialogue format (Naval ↔ Nivi)
- ~25 hyperlinks but used sparingly inside paragraphs
- Same core thesis (credibility > tactics) restated in 3+ different sections

### Closing — Paul Graham (imperative + future-tense)

```
Go where interesting problems are, and you'll probably find that other smart and ambitious people have turned up there too. And later they'll look back on what you did together and call it a golden age.
```

### Closing — Naval (zoom-out to whole-life)

```
It's better to live a couple of different lives, crammed within this one life—each one, doing what you want, pursuing your own genuine interest.
```

---

## Bonus: Investigative Essay — Patrick McKenzie pattern

**Source**: https://www.bitsaboutmoney.com/archive/nonprofit-indicted-bank-fraud/ (Patrick McKenzie, 2026-05-01, ~45,000 words)

### Unique structural mechanics

- **Date-stamped H2s in the middle** (`"August 11th, 2017:"`, `"August 21, 2017:"`) — converts mid-essay into a documentary timeline
- **Extended parenthetical asides** as de-facto footnotes
- **Primary-source attestation language** (`"Bits about Money has reviewed contemporaneous records"`)
- **Heavy citation density**: 40+ statutory cites (18 USC, 31 CFR), 25+ case-law refs, 15+ congressional documents, 8+ archive PDFs
- **Scare quotes** used for ironic effect (`"programs"`, `"non-partisan"`)
- **`"A brief interlude"` sub-sections** explicitly step outside the narrative

### Verbatim opening (insider-truth)

> The financial industry understands itself to be an arm of the government. We were inducted into this service other-than-willingly through the ordinary operation of law and regulation.

---

## How the writer should USE this file

When writing in archetype X:

1. Read the matching section in this file.
2. Match the verbatim opening style — not the words, the *shape* (timestamp+impact for Incident, number+claim for Research, contrarian-claim for Essay, capability-statement for Launch, internal-metric-hook for Case Study).
3. Replay the H2 sequence as a structural skeleton, then write your own H2s in the same shape.
4. Use the recurring-artifact discipline (Stripe's `"$20 June payment"` → you pick your own single artifact and thread it through).
5. Close in the matching shape (Case Study: forward roadmap; Incident: apology + commit; Launch: availability+pricing; Research: BibTeX; Essay: aphorism).
6. **Do not borrow signature moves from other archetypes** — see the Coherence Gate in SKILL.md.

This file is intentionally short. Re-fetch the source URLs when you need full context.
