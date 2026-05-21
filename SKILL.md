---
name: blog-auto
version: 1.1.0
calibrated_from: 37 verbatim audits across 7 categories (US SaaS engineering + AI labs + founder essays + tech-strategy / newsletter giants / big-tech engineering / solo-dev educational / Chinese deep-report+weekly+zhihu) — see references/archetypes*.md
description: Universal top-tier blog skill for any project — Next.js / Astro / Hugo / Jekyll / Gatsby / generic MDX. Three modes — (1) WRITE new blogs with full quality / EEAT / AI-citation optimization, (2) REWRITE existing blogs to lift quality + citations, (3) AUDIT existing blogs against the 8-layer top-SaaS bar (Schema / EEAT / AI citation / multilingual coverage / internal link graph / SERP gap / image evidence / anti-AI detection) and produce a per-article scorecard with concrete file:line fixes. Quality bar = Stripe / Vercel / Anthropic / Cloudflare engineering-blog tier — articles strong enough to rank in Google AI Overview, get cited by Perplexity / ChatGPT / Bing Copilot, be picked up by Hacker News / Reddit / Substack roundups, and pass curator review on Medium / Substack. Calibrated from 37 verbatim audits across 7 categories: SaaS engineering (Stripe/Vercel/Cloudflare/Linear/Supabase), AI labs (Anthropic/OpenAI/Hugging Face), founder essays (DHH/PG/Naval/patio11), tech strategy (Stratechery/Evans/a16z/Sequoia), newsletter giants (Lenny/Packy/Tunguz/Every/Pirate Wires), big-tech engineering (Netflix/Uber/Airbnb/Discord), solo-dev educational (Julia Evans/Dan Abramov), Chinese顶级 blogs (36氪/虎嗅/极客公园/阮一峰/少数派/思否/知乎). MANDATORY uses DataForSEO API. Auto-detects the project from the filesystem; never hardcodes. Invocation examples — "blog" / "5 blogs in en zh ja" / "rewrite my X for AI citation" / "audit my blogs" / "审查现有 blog". Defaults to dry-run preview; commits only when explicitly asked. Install once at `~/.codex/skills/blog-auto/`; works in every project you cd into.
---

# Blog Auto

Universal top-tier blog production skill. The user says what they want; this skill does everything: detect the project → pull real search data from DataForSEO → pick best topics → write top-tier articles → save to the right path → optionally commit.

## First-Run Setup (each user brings their own credentials)

**Credentials are never embedded in the skill.** Every recipient of this skill (including you on a fresh machine, a teammate, an open-source user who cloned it) sets up their own DataForSEO + image-gen accounts. The skill reads creds only from environment variables at runtime; nothing is shipped inside the SKILL.md file.

One-time setup, takes ~10 minutes:

### Step A — DataForSEO account (mandatory, ~$5 minimum credit)

1. Sign up at https://app.dataforseo.com/register
2. Top up wallet — $5 minimum gets you ~5,000 keyword calls + ~3,000 SERP calls (enough for ~25 articles across 3 locales)
3. Copy `API access` credentials from https://app.dataforseo.com/api-access
4. Add to shell profile (`~/.zshrc` / `~/.bashrc` / `~/.config/fish/config.fish`):

   ```bash
   export DATAFORSEO_LOGIN="your-login-email@example.com"
   export DATAFORSEO_PASSWORD="your-api-password-from-dashboard"
   ```

5. Reload shell: `source ~/.zshrc` (or open a new terminal)
6. Verify with a 1-call test (costs ~$0.0006):

   ```bash
   curl -s -u "$DATAFORSEO_LOGIN:$DATAFORSEO_PASSWORD" \
     -H "Content-Type: application/json" \
     -d '[{"keyword":"hello world","location_code":2840,"language_code":"en","limit":3}]' \
     https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live \
     | head -50
   ```

   If you see `"status_code": 20000` you're set. If `40100` / `40200` → wrong credentials. If `40400` → no credit.

### Step B — Image generation (optional but recommended)

Pick ONE:

```bash
# Option 1: Google Gemini nano-banana (recommended for cost)
export GEMINI_API_KEY="..."         # get at https://aistudio.google.com/apikey

# Option 2: OpenAI GPT Image
export OPENAI_API_KEY="..."         # get at https://platform.openai.com/api-keys
```

If neither is set, the skill leaves `<!-- IMAGE: description -->` placeholders the user can fill manually later.

### Step C — Install the skill (one-time per machine)

```bash
# Codex
mkdir -p ~/.codex/skills/blog-auto
curl -fsSL <your-skill-url>/SKILL.md > ~/.codex/skills/blog-auto/SKILL.md

# Claude Code (or any tool that reads ~/.claude/skills/)
mkdir -p ~/.claude/skills/blog-auto
ln -s ~/.codex/skills/blog-auto/SKILL.md ~/.claude/skills/blog-auto/SKILL.md
```

### Step D — Use in any project

```bash
cd /any/blog/project
codex                          # or `claude`
> 5 blogs in en zh ja
```

The skill auto-detects the project layout, halts if DataForSEO creds are missing with the install instructions above, and starts producing articles.

**Recipient of this skill needs their own DataForSEO account, their own image-gen account, and their own machine env vars. None of these come from the skill author.**

**Quality bar = top-tier SaaS engineering blogs** (Stripe, Vercel, Anthropic, Cloudflare, Linear, Supabase, Plausible, Resend, Intercom). Articles must rank on Google + AI Overview, be cited by Perplexity / ChatGPT / Bing Copilot, survive Hacker News / Reddit submission, and pass Medium / Substack curator review without rejection.

Project-agnostic by design. Same skill produces correct output in a Next.js SaaS site, an Astro personal blog, a Hugo documentation site, or a generic MDX repo. All project specifics are detected from the filesystem at runtime, never hardcoded.

## Hard Preconditions (halt if any fails)

These are not negotiable. If any precondition fails, halt with a specific error and the exact fix.

1. **DataForSEO credentials are present in env**: `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD`. No exceptions, no fallback. The skill never embeds credentials — each user supplies their own. If missing, halt with:
   ```
   ❌ DataForSEO credentials not set. This skill REQUIRES real search data — fallback heuristics are not allowed.

   Setup (~10 minutes, ~$5 minimum):
   1. Sign up at https://app.dataforseo.com/register
   2. Top up wallet ($5 minimum)
   3. Copy credentials from https://app.dataforseo.com/api-access
   4. Add to shell profile:
        export DATAFORSEO_LOGIN="your-login@example.com"
        export DATAFORSEO_PASSWORD="your-api-password"
   5. Reload shell: source ~/.zshrc
   6. Verify:
        curl -s -u "$DATAFORSEO_LOGIN:$DATAFORSEO_PASSWORD" \
          -H "Content-Type: application/json" \
          -d '[{"keyword":"hello","location_code":2840,"language_code":"en","limit":3}]' \
          https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live

   Re-run this skill when status_code 20000 is returned.
   ```
2. **Working directory is a project with a detectable blog structure** (existing blog directory + at least 1 sample post, OR an explicit `blog_dir` argument).
3. **Working directory is git-initialized** (so commit/push are possible later).

If the request is otherwise ambiguous (count / locales / topic constraint), ask exactly one clarifying question. Then proceed.

## Input Parsing

Parse the user's request into this structured intent:

```yaml
mode: write | rewrite | audit         # write new / rewrite existing / audit existing only
count: 1 | 5 | 10                     # how many articles (write/rewrite only)
locales: [en] | [en, zh, ja]          # which locales (multiplies count)
topic_constraint: null | "nano banana" # optional topic family
target_slug: null | "existing-slug"   # if rewrite
audit_scope: all | recent | slug      # for audit mode
commit: false | true                  # default false (dry-run preview)
push: false | true                    # default false
```

Examples:

| User says | Parsed |
|---|---|
| `blog` | mode=write, count=1, locales=[default] |
| `5 blogs` | mode=write, count=5, locales=[default] |
| `5 blogs in en zh ja` | mode=write, count=5, locales=[en, zh, ja] → 15 articles |
| `5 blogs about nano banana in en+ja` | mode=write, count=5, locales=[en, ja], topic_constraint="nano banana" |
| `rewrite my nano-banana-pro-complete-guide for AI citation` | mode=rewrite, target_slug="nano-banana-pro-complete-guide" |
| `audit my blogs` / `审查现有 blog` / `review my existing blog posts` | mode=audit, audit_scope=all |
| `audit my last 5 blogs` | mode=audit, audit_scope=recent, count=5 |
| `audit nano-banana-pro-complete-guide` | mode=audit, audit_scope=slug, target_slug="nano-banana-pro-complete-guide" |
| `5 blogs and commit them` | mode=write, count=5, commit=true |

Default locale = the project's primary locale (detected from `next.config.js` / `messages/` / `i18n.ts` / `astro.config`).

**Mode dispatch**: if `mode=audit`, skip Steps 1–7 (write path) and jump to "Audit Mode" below. If `mode=write` or `mode=rewrite`, follow Steps 1–7.

## Audit Mode (run when mode=audit)

When the user wants a review of existing blogs (not new content), do NOT just list structural gaps — that's surface-level and other agents already do that. Run the **8-layer top-SaaS audit** and produce a per-article scorecard with concrete file:line fixes.

### The 8 layers (each must produce evidence, not opinion)

For each article in scope, run these checks. Use `rg` / `grep` / `wc` / file reads as primary tools. Cap analysis at the article body — never speculate beyond what the file shows.

#### Layer 1 — Schema (JSON-LD) presence

```bash
# Count of articles missing JSON-LD entirely (`--files-without-match`, not `-L` which follows symlinks)
rg --files-without-match 'application/ld\+json|@type.*BlogPosting|@type.*Article|@type.*TechArticle' {blog_dir}/*.{md,mdx} 2>/dev/null | wc -l
```

For each article missing: schema score = 0/10. Required fields when present: `@type`, `headline`, `author.@type`, `author.name`, `datePublished`, `dateModified`, `mainEntityOfPage`, `image`. Score 1 point per field present out of these 8.

#### Layer 2 — Author EEAT (sameAs external links)

For each named author in the article's frontmatter, read `content/author/{author}.mdx` (or project's equivalent) and check:

```bash
rg -c 'linkedin\.com|github\.com|x\.com|twitter\.com|mastodon' content/author/{author}.mdx
```

0 external links = 0/10 EEAT (96% of AI citations flow to authors with sameAs). 3+ external links = 10/10.

#### Layer 3 — Visible freshness signals

```bash
# datePublished + dateModified in frontmatter
rg '^date:|^lastUpdated:|^dateModified:|^updated:' {blog_dir}/*.{md,mdx}

# Last-updated rendered in BODY (not just frontmatter)
rg -l 'Last updated|最近更新|最終更新|Zuletzt aktualisiert|Dernière mise à jour' {blog_dir}/*.{md,mdx}

# Reading-time indicator rendered in body
rg -l 'min read|分钟阅读|分で読めます|Min\. Lesezeit' {blog_dir}/*.{md,mdx}
```

Score: 2 points each — frontmatter date / frontmatter lastUpdated / body last-updated / body reading-time. Max 8.

#### Layer 4 — AI citation surface

Per article, count "atomic citable units":

```bash
# TL;DR block in first 200 words
rg -l 'TL;DR|TLDR|要点|要約' {blog_dir}/*.{md,mdx}

# Citation capsules — paragraphs with both a number and an outbound link
rg -B1 -A1 'https?://' {blog_dir}/*.{md,mdx} | rg -c '[0-9]+[%\$]|\b[0-9]{4}\b'

# llms.txt summary blocks
rg -l 'llms-summary' {blog_dir}/*.{md,mdx}

# FAQ section
rg -l '^##\s+(FAQ|Common questions|常见问题|よくある質問)' {blog_dir}/*.{md,mdx}

# llms.txt at site root
ls public/llms.txt 2>/dev/null || ls static/llms.txt 2>/dev/null
```

Score 2 points each for: TL;DR / citation capsules ≥3 / llms.txt summary / FAQ section / `/llms.txt` exists at site root. Max 10.

#### Layer 5 — Multilingual coverage

```bash
# Detect the default locale first (from i18n config) so plain `.mdx` files count toward it.
# Then count suffix-style (.{locale}.mdx) and subdir-style ({locale}/...).
default_locale=$(rg -oN "defaultLocale[\"' :]+([a-z-]+)" --no-line-number -r '$1' src messages 2>/dev/null | head -1)
default_locale=${default_locale:-en}

for loc in en zh ja de fr es ko pt-BR id; do
  # files with .locale.mdx suffix
  suffix_cnt=$(find {blog_dir} -name "*.${loc}.mdx" 2>/dev/null | wc -l | tr -d ' ')
  # files under locale subdir
  subdir_cnt=$(find {blog_dir} -path "*/${loc}/*.mdx" 2>/dev/null | wc -l | tr -d ' ')
  # plain .mdx files count toward default locale ONLY
  if [ "$loc" = "$default_locale" ]; then
    plain_cnt=$(find {blog_dir} -maxdepth 1 -name "*.mdx" 2>/dev/null | grep -vE "\.(en|zh|ja|de|fr|es|ko|pt-BR|id)\.mdx$" | wc -l | tr -d ' ')
  else
    plain_cnt=0
  fi
  total=$((suffix_cnt + subdir_cnt + plain_cnt))
  printf "%s: %d (suffix=%d, subdir=%d, plain=%d)\n" "$loc" "$total" "$suffix_cnt" "$subdir_cnt" "$plain_cnt"
done
```

If site i18n config declares N locales and blog covers M of them with ≥ 1 article each, score = (M/N)*10.

Also check hreflang risk: for any blog detail page, does the project's hreflang generator claim alternate language URLs that don't actually exist? Check `src/lib/hreflang.ts` (or equivalent) for whether it filters to only published locales per article, or naively lists all.

#### Layer 6 — Internal link graph

```bash
# Internal links from blog → other blogs / product pages.
# Catch BOTH Markdown link `](/path)` AND JSX/HTML `href="/path"`.
rg -oN '(?:\]\(|href=["'\''])(/[^)"'\'' ]+)' {blog_dir}/*.{md,mdx} | sort | uniq -c | sort -rn | head -20

# Orphan blogs (zero inbound from any other blog)
for f in {blog_dir}/*.mdx; do
  slug=$(basename "$f" .mdx)
  inbound=$(rg -l "blog/${slug}" {blog_dir}/*.mdx 2>/dev/null | grep -v "$f" | wc -l | tr -d ' ')
  [ "$inbound" -eq 0 ] && echo "ORPHAN: $slug"
done

# Blog → product page CTA presence. Match both Markdown links and JSX href.
# Substitute the bracketed list with the project's actual product paths (detect from src/app routes).
for f in {blog_dir}/*.mdx; do
  cnt=$(rg -c '(?:\]\(|href=["'\''])/(generate|signup|pricing|start|product|workbench|app)' "$f" 2>/dev/null)
  printf "%s: %d CTA(s)\n" "$(basename "$f")" "${cnt:-0}"
done
```

Orphan = -2 points. CTA count = 1 point each up to 3. Each inbound internal link to the post from another blog = 1 point up to 5. Max 10.

#### Layer 7 — SERP word-count gap

This requires DataForSEO. Per article, fetch SERP for the article's primary keyword (parse from `title` + `description`) and compute:

```
gap_factor = our_word_count / median(top_10_organic_word_count)
```

- ≥ 1.0 → 10/10 (we match or beat the bar)
- 0.7–1.0 → 6/10 (in striking distance)
- 0.4–0.7 → 3/10 (outgunned, will not rank without expansion)
- < 0.4 → 0/10 (rewrite-or-kill)

If DataForSEO not configured, halt this layer with the credential setup instructions and complete the other 7.

#### Layer 8 — Anti-AI detection

For each article body (strip frontmatter, code blocks, tables):

- Sentence-length stdev ≥ 8 → +2
- First-person ratio in 1–3% of total words → +2
- Idiosyncratic phrase density (regional, named, specific) ≥ 3 per 1000 words → +2
- At least 1 deliberate grammar-break per 500 words (comma splice / fragment) → +2
- Zero banned AI-default phrases ("delve into", "ever-evolving", "in conclusion", 「赋能」「闭环」etc.) → +2

Max 10.

### Output: per-article scorecard

For each audited article, emit:

```markdown
## {slug} ({locale})

| Layer | Score | Evidence | Fix |
|---|---:|---|---|
| 1. Schema | 0/10 | No JSON-LD in body | Add BlogPosting schema to `src/app/blog/[slug]/page.tsx` template |
| 2. Author EEAT | 0/10 | content/author/jacob.mdx has zero sameAs links | Add LinkedIn / GitHub / X to author file |
| 3. Freshness | 4/10 | Has `date` in frontmatter; no body lastUpdated; no reading-time | Add `*Last updated: YYYY-MM-DD*` after byline, add `N min read` |
| 4. AI citation | 0/10 | No TL;DR, no FAQ, no citation capsules, no llms.txt | Insert TL;DR block in first 200 words; add FAQ with PAA |
| 5. Multilingual | 3/10 | English only, project supports en/zh/ja | Plan native (not translated) zh + ja versions |
| 6. Internal links | 4/10 | 1 CTA, 0 inbound from other blogs | Add 2 internal links from related blogs; add 2 in-body CTAs |
| 7. SERP gap | 3/10 | 856 words; top-3 SERP median ~2,400 | Expand to ≥ 2,000 words with first-hand experiment |
| 8. Anti-AI | 7/10 | Sentence stdev 9.2, first-person 2.1%, 0 banned phrases; needs more idiosyncratic phrasing | Add 2 first-hand details |
| **Total** | **21/80** | — | — |
```

### Output: portfolio rollup

After all per-article scorecards, emit:

```markdown
## Portfolio rollup

Articles audited: 11
Average score: 26/80 (33%)
Best: ai-product-poster-generator (42/80)
Worst: gpt-image-2-vs-midjourney-vs-dalle-2026 (15/80)

### Highest-ROI fixes (apply once, lift all articles)

1. **Add JSON-LD template** to blog detail page — fixes Layer 1 for ALL 11 articles in one PR
2. **Add Person schema + sameAs** to content/author/jacob.mdx + 7 others — fixes Layer 2 for 8 articles
3. **Add reading-time + visible last-updated** to blog layout template — fixes Layer 3 for ALL
4. **Add TL;DR component** + run on top 5 articles — biggest AI citation lift
5. **Native zh + ja versions** of top-3 by GSC impressions — biggest traffic unlock
6. **Expand under-1500-word articles** to 2,000+ — fixes Layer 7 for 5 articles
```

### Audit mode hard rules

- **Never produce opinion without evidence**. Every score must be backed by a runnable command and its output.
- **Never write new files in audit mode**. Read-only. Emit suggestions as file:line references.
- **DataForSEO is required for Layer 7 only**. Other 7 layers run without it. If creds are missing, do all 7 + halt Layer 7 with setup instructions.
- **Output is the scorecard + rollup. Nothing else.** No advice paragraphs, no "consider doing X" without an exact fix command.

## Step 1: Project Auto-Detection

Read the current working directory and detect:

```yaml
framework: nextjs | astro | hugo | jekyll | gatsby | mdx-generic
package_manager: pnpm | npm | yarn | bun
blog_dir: content/blog | src/content/blog | _posts | content/posts | etc.
blog_format: mdx | md
locales: [en] | [en, zh, ja]          # from next-intl / astro i18n / files
existing_slugs: [...list from blog_dir]
frontmatter_schema: { title, description, date, ... }   # inferred from 3 sample files
site_url: detected from package.json / next-sitemap config / .env
canonical_pattern: /blog/{slug} | /{locale}/blog/{slug} | etc.
```

If the project structure is non-standard, ask the user once: "I see `content/blog/*.mdx` — should I write new posts to the same directory in the same frontmatter format?"

Read 3 existing blog files to infer:
- Frontmatter fields (use the union of what appears)
- Voice and tone (mirror, don't invent)
- Typical word count
- Existing categories (reuse, don't invent new ones unless gap exists)
- Author identifiers used
- Image path conventions (e.g., `/images/blog/{slug}/cover.png`)

## Step 2: Real Keyword Discovery via DataForSEO (mandatory)

DataForSEO is the data source. No DataForSEO call = no article. Real search volumes, real KD scores, real SERP positions, real PAA questions, real AI Overview citation lists. Heuristics and guesses are not acceptable substitutes — they produce articles that fail to rank or get cited.

### Required API calls per locale

For each locale's seed list, hit these 5 endpoints in order. All via curl (no separate script needed):

**(a) Keyword expansion** — `/v3/dataforseo_labs/google/keyword_suggestions/live`

```bash
curl -u "$DATAFORSEO_LOGIN:$DATAFORSEO_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '[{"keyword":"<seed>","location_code":<locale_loc>,"language_code":"<locale_lang>","limit":100,"include_serp_info":true}]' \
  https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live
```

Repeat per seed. Merge results, dedupe by keyword, keep `search_volume` + `cpc` + `competition_index` per candidate.

**(b) Bulk Keyword Difficulty** — `/v3/dataforseo_labs/google/bulk_keyword_difficulty/live`

```bash
# Up to 1000 keywords per call
curl -u "$DATAFORSEO_LOGIN:$DATAFORSEO_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '[{"keywords":[<candidate_array>],"location_code":<locale_loc>,"language_code":"<locale_lang>"}]' \
  https://api.dataforseo.com/v3/dataforseo_labs/google/bulk_keyword_difficulty/live
```

Returns `keyword_difficulty` 0–100 per candidate. Drop anything > site authority + 10 (estimate site authority from Domain Rank Overview if unknown, default to 25 for new sites).

**(c) Search Intent** — `/v3/dataforseo_labs/google/search_intent/live`

```bash
curl -u "$DATAFORSEO_LOGIN:$DATAFORSEO_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '[{"keywords":[<candidate_array>],"language_code":"<locale_lang>"}]' \
  https://api.dataforseo.com/v3/dataforseo_labs/google/search_intent/live
```

Returns `main_intent` per candidate. Keep only `informational` + `commercial`; drop `navigational` (brand searches) and `transactional` (purchase intent — those should be product pages, not blog).

**(d) SERP Organic Advanced** — `/v3/serp/google/organic/live/advanced`

Per shortlisted candidate (~10–15 per locale after KD + intent filter):

```bash
curl -u "$DATAFORSEO_LOGIN:$DATAFORSEO_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '[{"keyword":"<candidate>","location_code":<locale_loc>,"language_code":"<locale_lang>","device":"desktop","depth":20}]' \
  https://api.dataforseo.com/v3/serp/google/organic/live/advanced
```

From each response, extract:
- `ai_overview` block: presence + cited URLs (these are the articles your post must beat to get cited).
- `featured_snippet`: presence + type (paragraph / list / table).
- `people_also_ask`: all questions + answer URLs (feed into the article's FAQ section).
- `related_searches`: variant phrasings.
- `organic` top 10: URL + title + description (analyse content depth + author bylines for competitive gap).

**(e) Optional — Domain Rank Overview** — `/v3/dataforseo_labs/google/domain_rank_overview/live`

One call per run, to set site authority tier:

```bash
curl -u "$DATAFORSEO_LOGIN:$DATAFORSEO_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '[{"target":"<your-domain>","location_code":<locale_loc>,"language_code":"<locale_lang>"}]' \
  https://api.dataforseo.com/v3/dataforseo_labs/google/domain_rank_overview/live
```

Returns `Domain Rank` 0–100. Use to calibrate the KD ceiling in step (b).

### Cost discipline

- Keyword Suggestions: ~$0.0006 per seed call
- Bulk KD: ~$0.01 per 1000 keywords (one call)
- Search Intent: ~$0.0006 per call (up to 1000 keywords)
- SERP Advanced: ~$0.0006 per keyword
- Domain Rank: ~$0.02 per call

Typical 5 articles × 3 locales = 15 articles full run: **~$0.10–0.30 total**. Cheap. Refuse to skip it.

### Cache + idempotency

Cache responses by `(keyword, locale, endpoint)` for 7 days under `.blog-auto-cache/` in the project (auto-add to .gitignore). Re-runs within 7 days don't re-spend. Force refresh with `--no-cache`.

Locale codes:

| Locale | location_code | language_code |
|---|---:|---|
| en (US) | 2840 | en |
| en-GB | 2826 | en |
| zh-CN | 2156 | zh |
| ja | 2392 | ja |
| de | 2276 | de |
| fr | 2250 | fr |
| es | 2724 | es |
| ko | 2410 | ko |
| pt-BR | 2076 | pt |
| id | 2360 | id |

### Seed keyword derivation (from project context, never hardcoded)

Read the project's existing blog titles + categories + product/landing pages + README to derive 5–10 native seed keywords per locale at runtime. The exact seeds will differ for every project.

Illustrative shapes (do NOT reuse verbatim — derive from the actual project's domain):

- A SaaS image-generation project might surface seeds like `ai image generator`, `<flagship product name>`, `<vertical use case>`
- A SaaS analytics project might surface `web analytics`, `<product> vs <competitor>`, `<metric> dashboard`
- A personal dev blog might surface `<framework> tutorial`, `<author topic of expertise>`

For each locale, seeds must be in that locale's native phrasing — never translate from English. If the project has prior blog posts in that locale, mine them for the actual native vocabulary the writer has been using.

## Step 3: Topic Selection (the critical filter)

Build a candidate pool of 30–50 keywords per locale from DataForSEO output. Score each on:

| Signal | Weight | Source |
|---|---:|---|
| Realistic KD (≤ site authority + 10) | 30% | DataForSEO KD or estimate |
| Search volume ≥ 50/mo | 20% | DataForSEO or estimate |
| Intent in [informational, commercial] | 15% | DataForSEO search_intent |
| Competitive gap (top 10 has ≥ 2 weak results) | 15% | SERP intel |
| Product fit (article naturally bridges to our product) | 10% | Project context |
| AI Overview opportunity (AIO present + we can write better) | 10% | SERP intel |

Sort by score. Take top `count` per locale.

For each shortlisted topic, generate one of these article shapes (best fit):

- **Comparison**: `X vs Y in YYYY-MM` — when there's a known competitor product
- **Case study**: `I tested X on N Y. Only M survived.` — when first-hand experiment is possible
- **How-to**: `How to X in N minutes` — when intent is tutorial-heavy
- **Definition / explainer**: `What is X and when to use it` — when intent is informational
- **Pricing / value**: `What X actually costs in YYYY` — when intent is commercial

Skip listicles ("Top 10 X") unless explicitly asked. They rank but read as AI-slop on most SaaS sites.

## Step 4: Write Each Article (the bar)

For each selected topic in each locale, write a complete .mdx file. Apply these rules — they are non-negotiable and embody what top SaaS engineering blogs (Stripe, Vercel, Linear, Cloudflare, Anthropic, Supabase, Plausible, Intercom, Resend, Buffer, Shopify) consistently ship.

### Quality bar (a curator from Medium / Hacker News / Substack must not detect AI authorship)

- Open with a real first-person experience containing date + place + names + exact numbers. Never throat-clear.
- First 100 words must contain: concrete hook → thesis → proof of freshness → soft scroll trigger.
- ≥ 3 specific numbers (date / count / %/ price / duration) that aren't placeholders.
- ≥ 2 named real things the reader can verify (product, person, platform).
- ≥ 1 methodology disclosure (how you tested it).
- ≥ 1 limitation or failure mode (where the approach breaks).
- Paragraphs 2–4 sentences, max ~60 words, blank line between.
- H2 style by article type:
  - Engineering / comparison / case-study / launch → **declarative** H2s (≥ 70%)
  - SEO listicle / beginner guide → Q-form H2s (≥ 60%)
- Figures over code: 4–8 figures (charts, screenshots, side-by-side) per 2,000 words; code blocks only when genuinely useful.

### Banned (any occurrence = rejection)

- "In today's fast-paced world", "Let's dive into", "delve into", "navigate the", "tapestry", "realm", "landscape of", "ever-evolving", "game-changer", "unleash", "unlock the power of", "in conclusion", "it's worth noting", "needless to say", "robust", "leverage", "synergy", "holistic"
- 「在当今快节奏的时代」「众所周知」「让我们一起来探索」「赋能」「闭环」「打通」「深度赋能」「全方位」「一站式」「沉浸式」「极致体验」
- 「現代社会において」「近年、Xが注目されている」
- "Conclusion" heading. Use a real closing thought or a question.
- A bullet list where every bullet starts with the same gerund ("Building…", "Creating…").
- All-italic paragraphs longer than 2 lines.
- A "FAQ" section that just rephrases the body.
- Emoji in headings (max 1 in title if it carries meaning).

If any banned phrase appears in the draft, rewrite that line. No exceptions.

### Required structural elements

1. **Frontmatter** — match the project's existing schema exactly, plus:
   - `title` (50–60 chars, specific outcome + curiosity)
   - `description` (80–120 chars, delivers the promise)
   - `date` (today's date, ISO)
   - `lastUpdated` (today's date)
   - `categories` (reuse existing taxonomy)
   - `author` (use a real author from the project's `content/author/` if it exists)
   - `image` (hero image path)

2. **Reading-time line** under the byline: "By {author} · {N} min read · Last updated {date}". Localize the labels.

3. **TL;DR block** in first 200 words — a bordered callout summarizing the thesis in ≤ 50 words.

4. **Citation capsules** — at least 3 per article. Each is a 2–3 sentence paragraph with one concrete fact + number + date + outbound source link + one-sentence "what this means".

5. **Statistics table** — at least 1 in the first 40% of scroll (when the topic supports it).

6. **Methodology section** — if the article contains quantitative claims, disclose how the data was collected.

7. **FAQ section** — answer 3+ PAA questions (from DataForSEO SERP) with 30–80 word answers, each with 1 outbound citation when factual.

8. **Author bio block** at the bottom — name + role + LinkedIn / GitHub / X links.

9. **Visible last-updated stamp** in the body, in addition to frontmatter.

10. **JSON-LD schema** embedded in MDX (use `<Script>` if Next.js, raw `<script type="application/ld+json">` otherwise):
    - `BlogPosting` or `TechArticle` (pick the more specific)
    - `Person` for the author with `sameAs` array of profile URLs
    - `Organization` for the publisher
    - `FAQPage` if FAQ section exists
    - `BreadcrumbList` site → category → post
    - `mainEntityOfPage` set to canonical URL
    - `dateModified` ≥ `datePublished`
    - `image` `ImageObject` with explicit width × height

11. **llms.txt summary block** at end (HTML comment, 50 words): `<!-- llms-summary -->...<!-- /llms-summary -->` so a separate sweep can update site `/llms.txt`.

### Image strategy

If `GEMINI_API_KEY` is set, generate cover + inline images via Gemini nano-banana. If `OPENAI_API_KEY` is set, fall back to GPT Image. Codex's native image tool is also usable.

If no image-gen credential is set, leave clear `<!-- IMAGE: description -->` placeholders the user can fill via the project's own image tooling (whatever that is — check the project's README or scripts for image generation hints).

Image path convention: detect from the 3 sample blog files read in Step 1. Common patterns: `/images/blog/{slug}/cover.png`, `/public/blog/{slug}.jpg`, `/static/img/posts/{slug}/hero.webp`. Always match the project's existing convention exactly.

### Locale-native writing rule

Each locale's article is **not a translation** of any other. Each version:

- Starts from that locale's own keyword research (Step 2).
- Uses that locale's native phrasing in title and first 100 words.
- References that locale's market platforms (Reddit/HN for en, 小红书/掘金/知乎 for zh, Note/X.jp/Qiita for ja, t3n/Heise for de).
- Includes examples and references native to that market.

If asked to "translate" an existing article to another locale: refuse and instead offer to write a fresh native version of the same topic.

## Top-Tier Article Archetypes (pick ONE per article)

After picking a topic, pick the archetype it fits. Forcing the wrong archetype produces a hybrid that reads as AI-slop. These five are calibrated from real fetches of Stripe, Vercel, Cloudflare, Linear, Supabase, Anthropic, Plausible, PostHog, Intercom, Resend, Buffer, Shopify and from canonical founder essays (patio11, Paul Graham, DHH). Each lists when to use it, the H2 skeleton, opening + closing moves, and required proof artifacts.

### Archetype A — Engineering Case Study ("How we built / shipped / measured X")

When: there's a real internal experiment, build, or production rollout with concrete metrics. Reference: Stripe Engineering, Cloudflare blog, Vercel customer stories. Target 1,800–2,800 words.

Skeleton (declarative H2s, NEVER Q-form):

```
1. Setup — the constraint or problem in 1 paragraph; who was hurt and how
2. What we tried first — and why it didn't work (preserves credibility)
3. The shift / approach — one-paragraph thesis bolded; the new architecture or method
4. Implementation — 3–5 figures (architecture diagram, code skeleton, schema)
5. Results — numbered metrics, before/after table, p50/p95 if perf
6. Caveats / what doesn't work yet — non-negotiable; raises trust
7. What's next — 2–3 concrete future directions
```

Opening move: a concrete metric or moment. *"In Q1 we processed 4.2B Stripe API requests. 0.03% failed because of <root cause>. Here's the rebuild that brought it to 0.001%."*

Required proof: at least one public artifact (GitHub link, dataset, benchmark repo, public dashboard). Without it the post reads as marketing.

Closing move: link to the underlying repo / dataset / next post in the series. Never a generic "Try it free."

### Archetype B — Launch Announcement ("X is now generally available")

When: shipping a new product, feature, or capability. Reference: Vercel feature launches, Linear /now/, Supabase product posts, Anthropic /news. Target 600–1,400 words (keep tight — readers want to scan).

Skeleton:

```
1. One-line value prop (subtitle level)
2. For whom — concrete audience, named use-case
3. Why now — the shift that made this possible (model release, infra ready, etc.)
4. What ships — bulleted features with one-sentence "what it does" each
5. How to use — minimal code or CLI snippet, or 3-step walkthrough
6. Pricing / availability — explicit, no "contact us"
7. What's next — 1 paragraph
```

Opening move: the value prop in one sentence, then a single screenshot or chart. Vercel pattern: skip the throat-clearing, jump straight to "X is now available."

Required proof: a working demo URL or sandbox. A launch post without something the reader can click in 10 seconds is half-credible.

Closing move: docs link + sandbox link + changelog link. Three concrete next steps.

Word-count caution: don't pad. Launch posts under 1,000 words consistently outperform 2,000-word launch posts on engagement.

### Archetype C — Incident Report / Post-mortem ("What happened on <date>")

When: an outage, regression, security issue, or near-miss worth documenting publicly. Reference: Cloudflare post-mortems, GitHub incident reports, Fly.io incident write-ups. Target 1,500–3,000 words.

Skeleton (blunt, chronological — never reorder for narrative):

```
1. Impact summary at top — what broke, who was affected, total duration. Three sentences max.
2. Timeline — H3 sub-sections with UTC timestamps, what happened at each beat
3. Root cause — the actual technical reason, in plain language
4. Why our defenses didn't catch it — monitoring gaps, alerting gaps
5. Remediation — what we did to recover; what we changed permanently
6. How you'll know if it happens again — the detection or signal users / customers will see
7. Apology — single paragraph, no marketing veneer
```

Opening move: state impact bluntly with numbers and dates. *"On 2026-05-12 between 14:08 and 15:42 UTC, ~17% of API requests to api.example.com returned 503. This was caused by …"* No preamble.

Required proof: timestamps, internal metric screenshots (sanitized), the specific commit / change that caused it (when safely shareable).

Closing move: link to the specific issue tracker entry + commitment to a follow-up post if remediation is ongoing.

### Archetype D — Research Note ("New finding: X")

When: original research, novel benchmark, dataset release, or a new mechanism worth documenting. Reference: Anthropic /research, OpenAI research blog, DeepMind blog. Target 1,500–3,500 words.

Skeleton (close to academic abstract → body → discussion):

```
1. Headline finding in one sentence at the top — boldened
2. Why it matters — 2 paragraphs, what changes about the field
3. Background — what was known before, citations to prior work
4. Method — how the experiment was set up, what data, what controls
5. Results — primary chart(s), secondary chart(s), tables
6. Limitations — what this doesn't show; where confidence is low
7. Implications — what this means for practitioners
8. Citation block — bibtex-style or formal citation; links to artifacts
```

Opening move: the finding stated as a single sentence with magnitude. *"We find that models trained on X exhibit Y at Z scale, an N× improvement over the prior best."* No throat-clearing, no "We're excited to share…"

Required proof: a paper link (arXiv preferred), the eval harness or dataset, reproducible code if possible. Research notes without artifacts are press releases.

Closing move: invite replication. List the artifacts and a clear "how to reproduce" pointer.

### Archetype E — Transparency / Contrarian Take ("Why we don't do X" / "Here are our numbers")

When: making a public position that runs against the industry default, or sharing internal numbers others don't. Reference: Plausible Analytics business posts, PostHog transparency posts, DHH essays at world.hey.com, patio11 newsletter. Target 800–2,000 words.

Skeleton (single-author voice, first-person, opinionated):

```
1. Bold claim contrary to industry norm — one sentence, stated as fact
2. Personal stake — why YOU are saying this; what credibility
3. The default approach — what everyone else does and why
4. Where the default breaks — concrete failure modes
5. Our approach — what we do instead
6. Data showing it works — real numbers from your own operation, dated
7. What this means for you — actionable conclusion for the reader
```

Opening move: contrarian statement, no caveats. *"We don't run A/B tests on pricing. Here's why that's been the right call."* The opening must commit to a position the reader can either nod or argue with — never both.

Required proof: your actual numbers (revenue, growth, churn, latency, whatever your contrarian claim hinges on). The whole archetype depends on the writer having data to share. Without numbers, this becomes a generic "hot take" essay and curators reject it.

Closing move: a question or invitation for disagreement — never a hedge. Plausible / DHH consistently end with a position not a wishy-washy "what do you think?"

---

### Archetypes F–M — Extended (read the reference files when invoking)

The 5 archetypes above (A-E) are calibrated on US SaaS engineering + founder essays. For other categories of post, pick from these 8 extended archetypes and read the matching `references/archetypes-<category>.md` file before drafting:

| Archetype | Use when | Reference file |
|---|---|---|
| **F. Strategy / Industry Analysis** | Market analysis, framework-drop essay, VC perspective post. Reference: Stratechery, Benedict Evans, a16z, Sequoia | `references/archetypes-strategy.md` |
| **G. Newsletter Essay / Substack** | Recurring newsletter, Substack-style essay, opinion column, curated weekly. Reference: Lenny, Packy McCormick, Tomasz Tunguz, Every, Pirate Wires | `references/archetypes-newsletter.md` |
| **H. Big-Tech Engineering** | Hyperscale internal architecture post (PB/day, M req/sec). Reference: Netflix Tech, Uber Engineering, Airbnb Engineering, Discord | `references/archetypes-bigtech.md` |
| **I. AI Lab Research (non-Anthropic)** | Frontier-lab disclosure or community technical post. Reference: OpenAI alignment / Hugging Face community | `references/archetypes-bigtech.md` |
| **J. Solo Dev Educational** | Personal blog teaching post by a single developer. Reference: Julia Evans, Dan Abramov | `references/archetypes-bigtech.md` |
| **K. Chinese Deep Report (中文)** | Chinese-locale deep business / industry / product essay. Reference: 36氪, 虎嗅, 极客公园, 少数派, 思否 | `references/archetypes-zh.md` |
| **L. Chinese Weekly Curation (中文)** | Recurring Chinese weekly newsletter / 周刊 with templated section structure | `references/archetypes-zh.md` |
| **M. Chinese Zhihu Longform (中文)** | 知乎 platform 长文 with 利益相关 disclosure, author certification, comment-weight CTA | `references/archetypes-zh.md` |

**Routing rule**: when writing for a Chinese locale, always pick from K / L / M, not A-J. Cross-applying English archetypes to Chinese locales produces translation-tell content that fails Chinese SERP + LLM citation.

### Archetype selection rules

- Choose ONE archetype per article. Never mix.
- Don't force an archetype that doesn't fit the source material. If you have no metrics, you can't write Archetype A or E. If you have no experiment, you can't write Archetype D. If nothing broke, you can't write Archetype C.
- If none of the five archetypes fit the topic naturally, the topic is too thin or the writer doesn't have the raw material — kill the topic, don't lower the bar.
- Cross-post / syndication rules differ per archetype. Archetypes A / C / D travel well to Hacker News. Archetypes B / E perform better on Reddit + LinkedIn. Archetype E performs best on Substack and personal newsletters.

### Coherence Gate — anti-Frankenstein (apply before publish)

The most common failure mode of multi-reference skills is **stitching incompatible moves from different archetypes into one article**. Result: jarring fragments that no real top-SaaS author would produce. This gate prevents that.

#### Anchor Exclusivity Table — these moves DO NOT cross archetypes

| Signature move | Belongs ONLY to | Never use outside |
|---|---|---|
| UTC timestamp chronology (`14:08 UTC → 14:12 UTC`) | Archetype C (Incident) | Never in case study / launch / essay |
| `"Informed Speculation"` H2 (preemptive uncertainty disclosure) | Archetype C (Cloudflare) | Never elsewhere |
| Named remediation program (`"Code Orange"` style) | Archetype C only | Don't invent "Code Orange" for a launch |
| BibTeX citation block at end | Archetype D (Research) | Never in case study / launch / essay |
| Verbatim model chain-of-thought excerpt | Archetype D only | Never in marketing or case study |
| Per-month conversion table (Jan-Apr-style) | Archetype E (Transparency) | Don't use in incident or launch |
| Q&A interview format (Naval / Resend) | Archetype E only | Never in research or incident |
| `"How we built"` declarative section H2 | Archetype A (Case Study) | Don't use in launch announcement |
| Recurring "$20 example" artifact across sections | Archetype A only | Don't replicate in essay / launch |
| Sub-500-word + ≥5 em-dashes + zero outbound auth links | Archetype E (DHH-essay variant) | Don't compress a case study to this length |
| Plain-English availability + pricing in final sentence | Archetype B (Launch) | Never in research or essay |
| Sandbox / live demo URL within first 30% scroll | Archetype B only | Don't fake one for case study |
| Named capitalized framework as recurring proper noun | Archetype F (Strategy) only | Don't invent "Theory of X" in Launch / Case Study |
| Self-citation density ≥ 7 per post | Archetype F (Strategy) or G (Newsletter) | Case Study has 0 self-cites; Incident has 0 |
| Asterisk-break sectionless prose (`* * *`) | Archetype F (Evans-mode) or J (Abramov-mode) | Never in Case Study / Launch / Incident / Research |
| "Happy Thursday!" / "Hi friends 👋" greeting opener | Archetype G (Newsletter cozy) | Unprofessional in any other archetype |
| Multi-topic "Plus:..." tease in sentence 2 | Archetype G (Newsletter) only | Never in single-topic Case Study or Launch |
| Day-of-week temporal anchor in opening | Archetype G (Newsletter) only | Research / Case Study is timeless |
| Mid-essay sponsored block ("brought to you by") | Archetype G (Newsletter) only | Never in research / launch |
| Multi-co-author byline (3-5 engineers) | Archetype H (Big-Tech Eng) | SaaS Case Study uses 1-2 authors |
| Apache/OSS trademark glyph (™/®) in body | Archetype H (Big-Tech Eng) | Never in SaaS engineering or solo dev |
| Numbered Pillar/Goal framework as H2s | Archetype H (Big-Tech Eng) | SaaS prefers narrative headers |
| Production-scale numbers (PB/day, M/sec, billions) | Archetype H (Big-Tech Eng) | SaaS substitutes customer metrics |
| Self-disclosure-of-bug opening | Archetype I.1 (OpenAI alignment) | Off-brand at Anthropic; impossible at HF community |
| Upvote counter visible on post | Archetype I.2 (HF community) only | Never on OpenAI/Anthropic official research |
| CLI/bash code block as central artifact | Archetype I.2 (HF community) | Never centerpiece of Anthropic or OpenAI research |
| Hand-drawn zines / typographic ASCII art | Archetype J (Solo Dev) | Jarring in big-tech eng or SaaS |
| Lowercase headers + vulnerability ("i'm not good at X") | Archetype J (Solo Dev) | Unprofessional in big-tech H |
| Reader-supported tip-jar / Ko-fi CTA | Archetype J (Solo Dev) | Big-tech replaces with hiring CTA or omits |
| 震惊体 / 反问体 title with 引号 反讽 | Chinese K / L / M only | Direct English translation reads as clickbait |
| 公众号 QR card + "扫码关注" | Chinese K / L / M only | English version uses newsletter signup |
| 一/二/三/四 Chinese-numeral H2 序号 | Chinese K / M | English uses Arabic numerals |
| 「书名号」 wrapping concept names | Chinese K / M | English uses *italics* or "quoted" |
| 利益相关 disclosure opener | Chinese M (Zhihu) only | Never in K / L; not used in English |
| "前 XXX 公司 / 主理人 / 已发表 N 篇" author 三件套 | Chinese K / M | English byline stays minimal |
| 四字短句 / 比喻 closing | Chinese K / M | English closes with imperative |
| 12-section templated weekly structure | Chinese L (Weekly Curation) only | Don't invent templated sections per-post |

If any move on the right column shows up outside its archetype, the article is Frankenstein. Rewrite.

#### Banned cross-archetype combinations

These pairs **never** appear in a single article:

- **A (Case Study) + B (Launch)** — pick one. Are we explaining how it works, or announcing it ships? Not both in one post.
- **C (Incident) + B (Launch)** — announcing a feature inside a post-mortem destroys the apology tone.
- **D (Research) + E (Transparency)** — research speaks in third-person passive ("we find that..."); transparency speaks in first-person opinionated ("we don't run A/B tests"). Voice clash.
- **C (Incident) + A (Case Study)** — a "how we built" tone inside an outage post-mortem reads as deflection.
- **E (DHH-essay variant <500 words) + ANY archetype with charts / tables / code blocks** — the format breaks.

If the source material truly spans two archetypes (e.g., "we built X to fix the outage") — write **two separate posts**, link them. Never compress two into one.

#### Voice consistency check

Each archetype has a default voice. Don't switch voices mid-article:

| Archetype | Default voice | Person | Tense |
|---|---|---|---|
| A. Case Study | Engineering team, factual, declarative | "We" (team) | Past tense for the work, present for results |
| B. Launch | Product team, capability-first | "We" (company) | Present + future ("now available", "we expect") |
| C. Incident | Blunt operator + accountable executive | "We" (with apology) | Past tense, dated |
| D. Research | Authorial team, neutral academic | "We find that..." (collective) | Present academic |
| E. Transparency / Essay | Single author, opinionated | "I" (founder/operator) | Mixed; first-person dominant |

An article that opens "I noticed" and then switches mid-way to "We tested 16 models" reads as two writers stitched together. Pick one voice, hold it.

#### Frankenstein self-check (final pass before publish)

After the draft is complete, ask one question:

> "Could a knowledgeable reader plausibly believe this was written by Stripe Engineering / by Cloudflare / by Plausible / by DHH / by Anthropic Research — i.e., by ONE specific team in ONE house style?"

- If the answer is yes → ship.
- If the answer is "looks like 2-3 different teams stitched together" → identify the borrowed moves from foreign archetypes, **remove them**, re-anchor in the chosen archetype's own signature moves.

Concrete diagnostic prompts:

- Does the opening match the archetype's expected opening (Case Study: metric / Incident: timestamp+impact / Launch: capability statement / Research: finding / Essay: contrarian claim)? If not, rewrite the opening.
- Do the H2s share a single style (all declarative claims OR all Q-form OR all narrative)? If mixed, normalize.
- Is the closing aligned with the archetype (Case Study: next-step roadmap / Incident: apology + remediation commit / Launch: docs+sandbox / Research: BibTeX / Essay: aphorism)? If not, rewrite the closing.
- Is the recurring artifact (Stripe's `$20 example`, Linear's `@Linear prompt`, etc.) used **only if the chosen archetype requires it**? If borrowed without reason, remove.
- Is the voice (I / we-team / we-company / academic-we) consistent throughout? If switching, normalize to one.

Run this gate before declaring the draft done. Skipping it causes the most common AI-blog failure: **right-looking fragments that don't cohere as a whole article**.

### Original Research Discipline (applies to all archetypes)

Any quantitative claim must be structured as Hypothesis → Method → Result → Caveat, in that order, in the prose:

- **Hypothesis** (one sentence): what we expected to find
- **Method** (one paragraph): how we measured it; what sample; what controls
- **Result** (one or more figures + table): the actual number
- **Caveat** (one paragraph): where this could be wrong; what we didn't test

If a claim like "+22% lift" appears with no method paragraph, the curator rejects it as fabricated. Top SaaS blogs (Stripe, Cloudflare, Plausible) follow this discipline religiously — the prose around their numbers is half the credibility.

## Cross-Archetype Master Patterns (calibrated from 12 verbatim post audits)

These 8 patterns appear in 3+ of the canonical posts (Cloudflare incident 2023, Anthropic Agentic Misalignment 2025, Stripe billing analytics 2025, Vercel AI Gateway 2026, Linear Code Intelligence 2026, Supabase ChatGPT App 2026, Plausible homepage lift 2026, DHH Malleable Computer 2026, patio11 bank fraud 2026, Paul Graham Brand Age 2026, Naval Sell the Truth 2026). Encode them as hard rules; they cut across all 5 archetypes.

### 1. H2s are full subject-verb sentences, never noun labels

Verbatim examples from top SaaS posts:

- Stripe: `"Low-latency analytics required an event-driven pipeline from beginning to end"`
- Vercel: `"Anthropic leads in spend; Google leads in volume"`
- Linear: `"Bug triage can start with a hypothesis"`
- Plausible: `"Cut the prose in half"`
- Naval: `"Charisma Is Confidence + Love"`

Banned shape: `"Architecture"`, `"Background"`, `"Overview"`, `"Introduction"`, `"概览"`, `"はじめに"`. Each H2 must, on its own, communicate a finding or instruction the reader could quote.

### 2. One memorable number lives in the title or first 50 words

Each canonical post has exactly one anchor number readers carry away:

- Plausible: `+84%` (in title)
- Anthropic: `16 leading models` (sentence 1)
- Stripe: `300ms` latency, `<1 minute` aggregation
- Vercel: `35+ models in production`
- Linear: `1,055 queries → 5,200 projected`

Force this in every article. The number is the spine of citation. No anchor number = no extractable factoid for AI engines.

### 3. One concrete artifact threads through abstract sections

A single named example returns 3–4 times to ground the theory:

- Stripe re-uses `"$20 June payment"` across all three constraint sections
- Anthropic's `blackmail-scenario screenshot` returns across method + results + discussion
- Linear shows the same `@Linear prompt example` in each persona section
- Plausible re-references the `4-row Jan-Apr conversion table`

Pure abstraction never lands. Pick one artifact at outline time and weave it through every major section.

### 4. Closing zooms from specific to universal

Endings across 9 of 12 posts elevate from the post's narrow topic to a one-line generalization:

- Plausible: `"Complexity rarely arrives all at once. It accumulates a paragraph at a time."`
- DHH: `"As always, the future is already here, it's just not evenly distributed."`
- Paul Graham: `"Go where interesting problems are…and later they'll look back on what you did together and call it a golden age."`
- Cloudflare incident: `"the pain from the last couple of days will make us better."`
- Naval: `"It's better to live a couple of different lives, crammed within this one life…"`

Never close with `"In conclusion"`, `"To summarize"`, `"Hopefully this helps"`, `"Try it free"`. Close with an aphorism, an imperative, or a commitment.

### 5. CTA strategy bifurcates by archetype (no mixing)

| Archetype | CTA pattern |
|---|---|
| Launch (B) | Plain-English availability + pricing in the last sentence. Example: `"Code Intelligence is now available in public beta for Business and Enterprise plans, and free to use during the beta period."` |
| Case study (A) | Single passive mid/end link. Example: `"To learn more, read our docs or get in touch."` |
| Incident (C) | **No CTA.** Social follow only. |
| Research (D) | GitHub repo + hiring page. No "buy now". |
| Transparency / contrarian (E) | One product CTA, but never mid-paragraph. Plausible places it at the very end + the aphorism close. |
| Founder essay (DHH / PG / Naval / patio11) | **No CTA in the body.** Site-level subscribe / RSS only. |

Forcing a launch CTA into a case study or essay is a curator red flag.

### 6. Proof density scales with claim audacity

Calibrated from real fetches:

- DHH soft cultural claim (480 words) → 7 outbound links, mostly to own products
- Stripe technical case study (1,400 words) → 1 diagram, 3 outbound citations, 0 code
- Plausible business-numbers post (2,100 words) → 2 figures, conversion table, 12+ outbound links
- Linear launch (1,100 words) → 2 illustrations, 4 prompt code blocks, 3 outbound
- Vercel data report (2,400 words) → 6 stacked-bar charts, 0 code, 6+ named-model links
- Anthropic research (8,500 words) → 12 charts, BibTeX block, GitHub repo, canary string
- patio11 investigative (~45,000 words) → 40+ statutory cites, 25+ case-law refs, 15+ congressional docs, 8+ archive PDFs

Rule: if the post makes a hard quantitative or contested claim, it must ship with primary-source artillery (statutes, papers, GitHub, dataset, dashboard). If you have nothing to link, the claim is not strong enough to make.

### 7. Length IS the archetype — pick length first

| Word count | Archetype it implies |
|---|---|
| < 500 | DHH-style aphorism essay (one bold claim + ≤5 hyperlinks) |
| ~280–600 | Minimum-viable launch (Supabase ChatGPT App ≈ 280 words) |
| ~1,100–1,400 | Standard launch (Linear) or technical case study (Stripe) |
| ~2,000–2,800 | Transparency / numbers post (Plausible) or incident report (Cloudflare) |
| ~6,500–8,500 | Research note (Anthropic) or canonical founder essay (PG, Naval) |
| ~30,000+ | patio11-style investigative essay (rare; only for original document review) |

Pick the length budget first. The shape follows. A 4,000-word "launch" is broken — too long to be a launch, too short to be research. Either cut to 1,200 or commit to 6,000.

### 8. Earn the right to be cited by naming a proper noun

Each canonical post invents or claims one proper noun the reader carries away:

- Cloudflare incident → `"Code Orange"` (the named remediation program)
- Stripe case study → `"Pinot v2"` (the named query engine)
- Linear launch → `"Code Intelligence"` (the named capability)
- Vercel data → `"AI Gateway Leaderboards"` (the named dashboard)
- DHH essay → `"the malleable computer"` (the named concept)
- patio11 essay → `"coordinated pressure campaign"` (the named pattern)
- Naval essay → `"Hunt Together"`, `"Selfish Honesty"` (named maxims)

The proper noun does two jobs: gives AI engines a unique entity to attribute, and gives the reader a memorable hook to repeat. Every article should land on a noun the reader didn't know before.

## Archetype-Specific Verbatim Anchors (lift these moves directly)

Each archetype has a signature move observed in the wild. When writing in that archetype, replay it:

- **Case study (A) — Stripe pattern**: latency numbers embedded in prose with a 4-step ladder, e.g., `"24 hours → 15 minutes → under 1 minute → <300 ms"`. Show the before/after sequence inline, not in a callout box.
- **Launch (B) — Linear pattern**: organize the body around personas, one H2 per persona, each ending with a prompt example or screenshot specific to that persona's workflow.
- **Launch (B) — Supabase pattern**: if the launch's main artifact IS a capability list (e.g., new tool integrations), the post can be 280 words — capability bullets + auth instructions + done. Don't pad.
- **Incident (C) — Cloudflare pattern**: CEO byline (not SRE team) signals accountability. Section explicitly labelled `"Informed Speculation"` preemptively concedes what's unknown. Name a remediation program ("Code Orange") that turns the incident into a permanent commitment.
- **Research (D) — Anthropic pattern**: the headline chart lands BEFORE the methods deep-dive (around 25–30% scroll), not after. Methods come later. Include verbatim transcript excerpts to ground reproducibility. End with a BibTeX block.
- **Transparency (E) — Plausible pattern**: number in title (e.g., `"How simplifying our homepage helped increase trial signups by 84%"`). Each tactical change becomes its own H3 (`"Flipped the page structure"`, `"Changed the CTA wording"`, `"Cut the prose in half"`, `"Refreshed the testimonials"`). Close with a generalizable aphorism.
- **Founder essay (DHH/PG) — short form**: sub-500 words OR 7,500+ words; nothing in between reads as "essay." Em-dashes ≥ 5 per essay are signature pacing. Self-link to your own prior work as evidence, not external authorities.

## Step 5: File Output

For each (locale, topic) pair:

- Slug: lowercase, hyphenated, ≤ 80 chars. Localize for non-Latin scripts (zh and ja can use pinyin/romaji slugs or English slugs — match project's existing convention).
- Default locale → `{blog_dir}/{slug}.mdx`
- Non-default locale → match the project's existing pattern by inspecting existing localized files:
  - Pattern A (suffix in same dir): `{blog_dir}/{slug}.{locale}.mdx`
  - Pattern B (locale subdir under blog): `{blog_dir}/{locale}/{slug}.mdx`
  - Pattern C (locale subdir at content root): `content/{locale}/blog/{slug}.mdx`
  - Pattern D (locale subdomain or app routing): may write to the same `{blog_dir}` with `locale` in frontmatter — check next-intl / astro i18n config

If the project has zero existing localized blog files, ask the user once which pattern to use. Default to Pattern A (suffix) when the user doesn't care — it's the lowest-friction option for most frameworks.

## Step 6: Commit & Push (only when asked)

Default: dry-run preview. Show the user a list of files about to be written and ask "write these N files?" once. Then write.

If `commit: true` was parsed from the request:

```bash
git add {written_files}
git commit -m "blog: add N posts ({locales})"
```

If `push: true`:

```bash
git push
```

Never commit or push unless explicitly asked. Never use `--no-verify`. If a pre-commit hook fails, surface the error and stop.

## Step 7: Report Back

After completion, output a concise summary:

```
Wrote 15 articles:
  en (5): nano-banana-comparison.mdx, ai-headshot-pricing.mdx, ...
  zh (5): nano-banana-vs-gpt-image.mdx, ...
  ja (5): nano-banana-pro-prompt.mdx, ...

Total words: 28,400
Avg reading time: 7 min
Schema injected: BlogPosting + Person + Org + FAQPage on all 15
Citation capsules: 47 across all articles
DataForSEO calls: 23 ($0.04)
Committed: yes (git SHA abc123)
Pushed: no

To publish & monitor:
  - Wait for next deploy
  - In 14 days, ask: "feedback loop on the May batch"
```

## Failure Modes

- **Project structure not recognized**: ask the user once for blog_dir + frontmatter sample.
- **DataForSEO 401 (auth fail)**: halt with the credential setup instructions from "Hard Preconditions". No fallback.
- **DataForSEO 40400 (quota out)**: halt with "Top up wallet at https://app.dataforseo.com" and the remaining-credit value.
- **DataForSEO 429 (rate limit)**: backoff exponentially (1s, 2s, 4s, max 30s) up to 3 retries; if still failing, halt.
- **DataForSEO network failure**: 3 retries with 2s delay; if still failing, halt and report the last error verbatim.
- **One locale fails** (e.g., DataForSEO doesn't support ko): write the others; report which locale failed.
- **A draft fails the quality bar after 2 rewrite passes**: stop on that article, surface the specific failed rule, keep the other articles.

## One Skill, Everything Inline

This skill is fully self-contained. The user types one sentence; the skill internalizes keyword research, SERP intel, topic selection, writing, schema injection, anti-AI quality gates, fact-checking, and publishing. No supporting skills required.

Rule: never expose pipeline details to the user unless they ask. They asked for blogs, not for a pipeline.

## Install Once, Use Everywhere

The skill is global. Install location depends on tool:

```bash
# Codex
mkdir -p ~/.codex/skills/blog-auto
cp SKILL.md ~/.codex/skills/blog-auto/

# Claude Code
mkdir -p ~/.claude/skills/blog-auto
cp SKILL.md ~/.claude/skills/blog-auto/

# Both (symlink one to the other so they stay in sync)
ln -s ~/.codex/skills/blog-auto ~/.claude/skills/blog-auto
```

Env vars (set once in shell profile, applies globally):

```bash
export DATAFORSEO_LOGIN=...        # real search data (~$5 minimum credit at dataforseo.com)
export DATAFORSEO_PASSWORD=...
export GEMINI_API_KEY=...          # optional, for nano-banana image gen
export OPENAI_API_KEY=...          # optional fallback for GPT Image
```

## Usage in Any Project

In any project directory:

```bash
cd /path/to/your/project
codex
# Then in Codex prompt:
> 5 blogs in en zh ja
```

Or non-interactive:

```bash
codex exec "5 blogs in en zh ja, commit"
```

In Claude Code:

```bash
cd /path/to/your/project
claude
> 5 blogs in en zh ja
```

The skill auto-detects whether it's running in a Next.js, Astro, Hugo, Jekyll, Gatsby, or generic MDX project. It reads the existing blog directory, frontmatter schema, locale convention, and image path convention, then writes new posts that match exactly.

Zero per-project setup. No `.content-pipeline/` directory. No package.json modifications. No config files. The project's existing structure IS the config.

## What This Skill Does NOT Do (by design)

- Does not set up `.content-pipeline/` directory (overhead).
- Does not modify `package.json`.
- Does not require any pre-config beyond env vars.
- Does not require the user to choose between 10 sub-skills — picks for them.
- Does not over-explain the pipeline. The user wanted blogs; the user gets blogs.
