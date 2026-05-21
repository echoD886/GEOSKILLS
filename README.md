# blog-auto

Universal top-tier blog production skill. Drop it into `~/.codex/skills/blog-auto/` or `~/.claude/skills/blog-auto/`. Works in any project.

**Quality bar** — Stripe / Vercel / Anthropic / Cloudflare engineering-blog tier. Articles must rank on Google + AI Overview, be cited by Perplexity / ChatGPT / Bing Copilot, survive Hacker News submission, and pass Medium / Substack curator review.

**Mandatory data source** — DataForSEO API. No real search data, no run. Each user uses their own account; credentials are never embedded in the skill.

---

## Install

```bash
# Codex
mkdir -p ~/.codex/skills/blog-auto
cp SKILL.md setup-check.sh ~/.codex/skills/blog-auto/
chmod +x ~/.codex/skills/blog-auto/setup-check.sh

# Claude Code (or symlink from above)
mkdir -p ~/.claude/skills/blog-auto
ln -sf ~/.codex/skills/blog-auto/SKILL.md ~/.claude/skills/blog-auto/SKILL.md
```

## One-time setup (10 minutes, ~$5)

Each user supplies their own credentials. None come from the skill author.

### 1. DataForSEO (required)

1. Register at https://app.dataforseo.com/register
2. Top up wallet ($5 minimum gets ~5,000 keyword calls)
3. Get credentials from https://app.dataforseo.com/api-access
4. Add to shell profile (`~/.zshrc` / `~/.bashrc`):

   ```bash
   export DATAFORSEO_LOGIN="your-email@example.com"
   export DATAFORSEO_PASSWORD="your-api-password"
   ```

5. Reload: `source ~/.zshrc`

### 2. Image generation (optional)

```bash
# pick ONE
export GEMINI_API_KEY="..."   # from https://aistudio.google.com/apikey
export OPENAI_API_KEY="..."   # from https://platform.openai.com/api-keys
```

Without either, articles use `<!-- IMAGE: description -->` placeholders.

### 3. Verify

```bash
~/.codex/skills/blog-auto/setup-check.sh
```

Should output:
```
[1/3] DataForSEO credentials
✅ DataForSEO OK (status 20000)
   Wallet balance: $X.XX
[2/3] Image generation (optional)
✅ GEMINI_API_KEY set
[3/3] Current project
✅ git repo detected
✅ Node project (pnpm)
✅ Blog dir: content/blog (11 existing posts)
```

## Use

```bash
cd /any/blog/project
codex                  # or `claude`
> 5 blogs in en zh ja
```

The skill:

1. Detects the project (Next.js / Astro / Hugo / Jekyll / Gatsby / generic MDX).
2. Pulls real keyword data from DataForSEO per locale.
3. Picks the top 5 topics per locale using KD + intent + SERP gap.
4. Writes each article at top-tier quality (curator-grade hooks, EEAT signals, schema, citation capsules).
5. Saves to the project's existing blog directory with matching frontmatter and locale convention.
6. Optionally commits + pushes.

Cost: ~$0.10–0.30 of DataForSEO credits for 15 articles across 3 locales.

## Sharing this skill

The skill is safe to publish. Every recipient sets up their own DataForSEO + image-gen accounts on their own machine. Credentials live only in shell env vars; nothing flows through the SKILL.md file.

When sharing:

- Point recipients at the **One-time setup** section above.
- Tell them to run `setup-check.sh` once before first use.
- They will see a clear halt message if any precondition is missing.

## What's in the skill (deeper references)

For users who want to understand how the skill decides what to write, the following supporting skills document each step in depth:

- `blog-serp-intel` — SERP analysis, AI Overview citation, Featured Snippet detection
- `blog-keyword-difficulty` — KD scoring and intent filtering
- `blog-paa-harvester` — People Also Ask → FAQ section + FAQPage schema
- `blog-eeat-injector` — Article / TechArticle / Person / Organization / BreadcrumbList schema
- `blog-ai-citation` — TL;DR callouts, citation capsules, Q-structured H2s
- `blog-fact-checker` — citation match, URL liveness, named entity verification
- `blog-anti-ai-detector` — Originality.ai-style scoring + automated rewrites
- `blog-feedback-loop` — T+14 GSC + Perplexity / ChatGPT citation check
- `blog-llms-txt` — /llms.txt and /llms-full.txt maintenance
- `medium-grade-blog-writer` — full quality-bar reference

These all live under `~/.codex/skills/`. The main `blog-auto` skill internalizes them so the user doesn't need to call any individually.
