# GEOSKILLS — Universal top-tier blog production skill

> Most AI blog generators produce content with a 3–6% AI-search citation rate. This skill targets 15–25% by encoding what top SaaS engineering blogs actually do — calibrated from verbatim audits of 12 canonical posts (Stripe Engineering, Vercel, Cloudflare, Anthropic, Linear, Supabase, Plausible, DHH, Paul Graham, Naval, patio11). One skill. Three modes. Real search data only.

[![Skill](https://img.shields.io/badge/Codex-skill-blue)](https://github.com/echoD886/GEOSKILLS) [![Skill](https://img.shields.io/badge/Claude_Code-skill-purple)](https://github.com/echoD886/GEOSKILLS) [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

📖 [中文 README](README.zh.md) · 🇺🇸 English (this page)

## What it does (three modes in one skill)

### Mode A — Write new blogs

```text
> 5 blogs in en zh ja
```

Produces 15 publishable articles (5 per locale, native — not translated). Each runs its own DataForSEO keyword research, picks topics by KD + intent + SERP gap, writes against one of 5 article archetypes, and ships with full JSON-LD schema + EEAT signals + citation capsules.

### Mode B — Rewrite existing blogs

```text
> rewrite my nano-banana-pro-complete-guide for AI citation
```

Lifts an existing post — adds TL;DR block, citation capsules, Q-structured H2s where they fit, schema, reading-time, last-updated, llms.txt summary. Touches the article, not the rest of the site.

### Mode C — Audit existing blogs

```text
> audit my blogs
```

Produces an 8-layer scorecard per article with concrete `file:line` fixes:

1. **Schema (JSON-LD)** — presence + completeness
2. **Author EEAT** — sameAs external profile links (LinkedIn / GitHub / X)
3. **Freshness signals** — visible last-updated, reading-time, dateModified
4. **AI citation surface** — TL;DR, citation capsules, FAQ, llms.txt
5. **Multilingual coverage** — actual locales vs declared locales
6. **Internal link graph** — orphan detection, CTA distribution
7. **SERP word-count gap** — your post vs top-10 organic median
8. **Anti-AI detection** — sentence-length variance, idiosyncratic phrases, banned phrases

## How it works (底层逻辑)

Five-stage pipeline that runs end-to-end on one user command:

1. **Project auto-detection** — reads the filesystem to detect framework (Next.js / Astro / Hugo / Jekyll / MDX), blog directory, frontmatter schema, locale convention, author taxonomy, image conventions. Never hardcodes a specific project.
2. **Real keyword discovery via DataForSEO** — 5 API endpoints (keyword_suggestions / bulk_keyword_difficulty / search_intent / serp_organic_advanced / domain_rank_overview). Real search volumes, real KD scores, real PAA, real AI Overview citation lists. **Mandatory — no fallback, no synthesized data.**
3. **Topic selection** — scored by realistic KD vs site authority (+10 headroom), search intent in [informational, commercial], SERP competitive gap, product fit, AI Overview opportunity.
4. **Writing** — picks one of 5 article archetypes (see below) and applies that archetype's verbatim moves observed in real top-SaaS posts.
5. **EEAT + AI-citation injection** — JSON-LD schema (BlogPosting / TechArticle / Person / Organization / FAQPage / BreadcrumbList / ImageObject), visible last-updated stamp in the body, computed reading-time, citation capsules, TL;DR callout, `<!-- llms-summary -->` block for site-wide `/llms.txt` assembly.

## The five article archetypes (pick one per article)

Calibrated from verbatim audits of real top-SaaS posts. Forcing the wrong archetype produces hybrid AI-slop.

| Archetype | When to use | Reference posts |
|---|---|---|
| **A. Engineering Case Study** | Real internal experiment with concrete metrics | Stripe Engineering, Cloudflare |
| **B. Launch Announcement** | Shipping a new product, feature, or capability | Vercel, Linear, Supabase, Anthropic |
| **C. Incident Report** | Outage, regression, or near-miss worth documenting | Cloudflare post-mortems, GitHub status |
| **D. Research Note** | Original research, novel benchmark, dataset release | Anthropic, OpenAI, DeepMind |
| **E. Transparency / Contrarian** | Public position against industry default, or sharing internal numbers | Plausible, PostHog, DHH, patio11 |

## The 8 cross-archetype master patterns

These appear in 3+ canonical posts and are encoded as hard rules:

1. **H2s are full subject-verb sentences, never noun labels.** Vercel: `"Anthropic leads in spend; Google leads in volume"`. Never `"Architecture"` or `"Background"`.
2. **One memorable number in the title or first 50 words.** Plausible `+84%`, Anthropic `16 leading models`, Stripe `300ms`, Vercel `35+ models`.
3. **One concrete artifact threads through abstract sections.** Stripe's `"$20 June payment"` returns in all three constraint sections. Pure abstraction never lands.
4. **Closing zooms from specific to universal.** DHH: `"the future is already here, it's just not evenly distributed."` Never close with `"In conclusion"`.
5. **CTA strategy bifurcates by archetype — never mix.** Launch = plain-English availability + pricing. Incident = no CTA. Founder essay = no CTA. Research = GitHub + hiring.
6. **Proof density scales with claim audacity.** Soft cultural claim → 7 outbound links. Hard contested claim → 40+ statutory cites. If you have nothing to link, the claim is not strong enough.
7. **Length IS the archetype.** <500 = aphorism essay. 1,100–1,400 = standard launch or case study. 2,000–2,800 = transparency / incident. 6,500–8,500 = research or canonical essay.
8. **Earn citation by naming a proper noun.** Cloudflare names `"Code Orange"`. Linear names `"Code Intelligence"`. DHH names `"the malleable computer"`. Each post invents one entity AI engines and readers can carry away.

## Anti-AI quality bar

A Medium / Substack / Hacker News curator reading the draft must not detect AI authorship. Encoded as:

- **AI-slop blacklist** (multi-language): English `"delve into"`, `"navigate the"`, `"ever-evolving"`, `"game-changer"`, `"in conclusion"`. Chinese 「赋能」「闭环」「打通」「沉浸式」. Japanese 「現代社会において」.
- **First-person mandate**: ≥1 first-hand experiment with date / place / methodology; ≥3 specific numbers; ≥2 named real things; ≥1 limitation or failure mode.
- **Anti-AI-detection self-check**: sentence-length stdev ≥ 8, first-person ratio 1–3%, ≥3 idiosyncratic phrases per 1000 words, ≥1 deliberate grammar-break per 500 words.
- **Originality.ai-style scoring** before publish: AI-content score must be ≤ 30%.

## Native-language locale rule

Each locale runs its **own keyword research**, not a translation of another locale's:

| Locale | Native keyword source | Native platform references |
|---|---|---|
| en (US) | Google Suggest + Reddit + Ahrefs | Reddit, HN, Substack |
| zh-CN | 5118 / 百度指数 / 知乎热榜 | 小红书 / 抖音 / 知乎 / 掘金 |
| ja | Yahoo Japan suggest + Note 人気 | X.jp / Note / Qiita |
| de | Google.de + Sistrix | t3n / Heise |
| fr | Yooda Insight + Korben | Korben / Numerama |
| ko | Naver DataLab | Naver Blog / Velog |
| pt-BR | Google.com.br | Tabnews |

Asking the skill to "translate this English article to Japanese" is refused. It offers to write a fresh native Japanese version of the same topic instead.

## What this skill does NOT do (by design)

- **Does not embed credentials.** Each user supplies their own DataForSEO + image-gen API keys via env vars. Nothing flows through the skill files.
- **Does not require per-project setup.** No `.content-pipeline/` directory, no `package.json` modifications, no config files. The project's existing structure IS the config.
- **Does not allow fallback to fake search data.** No DataForSEO credentials → halt with setup instructions. Real data only.
- **Does not translate.** Each locale gets native research.
- **Does not over-explain the pipeline to the user.** They asked for blogs, not for a pipeline.

## Install (10 minutes, ~$5)

### 1. Clone the skill (one-time per machine)

```bash
# Codex
git clone https://github.com/echoD886/GEOSKILLS.git ~/.codex/skills/blog-auto
chmod +x ~/.codex/skills/blog-auto/setup-check.sh

# Claude Code — symlink to keep in sync
ln -sf ~/.codex/skills/blog-auto ~/.claude/skills/blog-auto
```

### 2. DataForSEO (required)

```bash
# Sign up at https://app.dataforseo.com/register
# Top up wallet — $5 minimum gets ~5,000 keyword calls (enough for ~25 articles)
# Then in your shell profile (~/.zshrc):
export DATAFORSEO_LOGIN="your-email@example.com"
export DATAFORSEO_PASSWORD="your-api-password"
source ~/.zshrc
```

### 3. Image generation (optional)

```bash
# pick ONE
export GEMINI_API_KEY="..."   # https://aistudio.google.com/apikey
export OPENAI_API_KEY="..."   # https://platform.openai.com/api-keys
```

Without either, articles ship with `<!-- IMAGE: description -->` placeholders.

### 4. Verify

```bash
~/.codex/skills/blog-auto/setup-check.sh
```

Expected output:

```
[1/3] DataForSEO credentials
✅ DataForSEO OK (status 20000)
   Wallet balance: $X.XX
[2/3] Image generation (optional)
✅ GEMINI_API_KEY set
[3/3] Current project
✅ git repo detected
✅ Node project (pnpm)
✅ Blog dir: content/blog (N existing posts)
```

## Use in any project

```bash
cd /any/blog/project
codex                                   # or `claude`
> 5 blogs in en zh ja
```

For non-interactive batch:

```bash
codex exec "5 blogs in en zh ja, commit"
```

Audit existing blogs:

```bash
codex
> audit my blogs
```

Rewrite a specific post:

```bash
codex
> rewrite my nano-banana-pro-complete-guide for AI citation
```

## Cost

Typical DataForSEO spend per 15-article batch across 3 locales: **~$0.10–0.30**. Cached for 7 days per `(keyword, locale, endpoint)` triple to avoid re-spend.

| API call | Unit cost | Per 15-article batch |
|---|---:|---:|
| keyword_suggestions | ~$0.0006 / seed | ~$0.05 |
| bulk_keyword_difficulty | ~$0.01 / 1000 KW | ~$0.01 |
| search_intent | ~$0.0006 / 1000 KW | ~$0.01 |
| serp/organic/live/advanced | ~$0.0006 / keyword | ~$0.05 |
| domain_rank_overview | ~$0.02 / domain | ~$0.02 |
| **Total per 15 articles** | | **~$0.14** |

## Sharing this skill

Safe to fork, mirror, or redistribute. Every recipient sets up their own DataForSEO + image-gen accounts on their own machine. Credentials live only in shell env vars; nothing flows through SKILL.md or setup-check.sh.

When sharing, point recipients at the **Install** section above. The first run of `setup-check.sh` shows a clean halt message if any precondition is missing.

## Calibrated against real top-SaaS posts

The patterns in this skill are not generic SEO advice. Each rule is traced to verbatim audits of:

- Cloudflare — *"Post Mortem on the Cloudflare Control Plane and Analytics Outage"* (2023)
- Anthropic — *"Agentic Misalignment: How LLMs could be insider threats"* (2025)
- Stripe — *"How we built it: Real-time analytics for Stripe Billing"* (2025)
- Vercel — *"AI Gateway production index"* (2026)
- Linear — *"Code Intelligence for Linear Agent"* (2026)
- Supabase — *"Supabase Is Now an Official ChatGPT App"* (2026)
- Plausible — *"How simplifying our homepage helped increase trial signups by 84%"* (2026)
- David Heinemeier Hansson — *"The Malleable Computer"* (2026)
- Paul Graham — *"The Brand Age"* (2026)
- Naval Ravikant — *"Sell the Truth"* (2026)
- Patrick McKenzie — *"Notes on a non-profit indicted for bank fraud"* (2026)

Each post was fetched, structurally decomposed (opening move / H2-by-H2 / unique mechanics / CTAs / proof elements / closing move), and its repeatable patterns folded into the skill's archetypes.

## License

MIT — fork, mirror, modify, ship.

---

> Complexity rarely arrives all at once. It accumulates a paragraph at a time.
