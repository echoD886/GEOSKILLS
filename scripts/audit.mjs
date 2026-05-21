#!/usr/bin/env node
/**
 * blog-auto audit script — executable 8-layer audit runner.
 *
 * Usage:
 *   node ~/.codex/skills/blog-auto/scripts/audit.mjs [--blog-dir content/blog] [--slug <slug>] [--json]
 *
 * Runs layers 1, 2, 3, 4, 5, 6, 8 deterministically against the project's
 * existing blog files. Layer 7 (SERP word-count gap) requires DataForSEO
 * and is skipped here with a halt note.
 *
 * Outputs a per-article scorecard to stdout. Pass --json to emit machine-readable.
 * Read-only. Never modifies files.
 */

import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------- CLI args ----------
const args = process.argv.slice(2);
function arg(name, dflt) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : dflt;
}
const hasFlag = (n) => args.includes(`--${n}`);

const cwd = process.cwd();
const blogDir = arg("blog-dir", autoDetectBlogDir(cwd));
const slugFilter = arg("slug", null);
const jsonOut = hasFlag("json");

if (!blogDir || !existsSync(blogDir)) {
  console.error(`❌ Blog dir not found: ${blogDir || "(no auto-detect match)"}`);
  console.error(`   Pass --blog-dir <path> or run from a project that has one of:`);
  console.error(`   content/blog, src/content/blog, _posts, content/posts, posts, blog, src/blog`);
  process.exit(1);
}

// ---------- Auto-detect helpers ----------
function autoDetectBlogDir(root) {
  const candidates = [
    "content/blog",
    "src/content/blog",
    "content/posts",
    "_posts",
    "posts",
    "blog",
    "src/blog",
  ];
  for (const c of candidates) {
    const p = path.join(root, c);
    if (existsSync(p) && statSync(p).isDirectory()) return c;
  }
  return null;
}

function detectDefaultLocale(root) {
  // Probe for next-intl / astro / common patterns
  for (const f of [
    "src/i18n.ts",
    "src/i18n.js",
    "src/i18n/routing.ts",
    "i18n.ts",
    "astro.config.mjs",
    "astro.config.ts",
  ]) {
    const p = path.join(root, f);
    if (existsSync(p)) {
      const txt = readFileSync(p, "utf8");
      const m = txt.match(/defaultLocale\s*[:=]\s*['"`]([a-z\-]+)['"`]/i);
      if (m) return m[1];
    }
  }
  // messages/ folder convention
  if (existsSync(path.join(root, "messages/en.json"))) return "en";
  return "en";
}

function sh(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], ...opts }).trim();
  } catch {
    return "";
  }
}

function listBlogs() {
  return readdirSync(blogDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => path.join(blogDir, f));
}

function readFile(p) {
  return existsSync(p) ? readFileSync(p, "utf8") : "";
}

function stripFrontmatter(txt) {
  return txt.replace(/^---[\s\S]*?---\s*\n/, "");
}

function wordCount(txt) {
  return txt.split(/\s+/).filter(Boolean).length;
}

// ---------- Layers ----------

function layer1Schema(text) {
  const pat = /application\/ld\+json|@type\s*[:=]?\s*['"]?(?:BlogPosting|TechArticle|Article|NewsArticle)/i;
  const has = pat.test(text);
  return {
    layer: "1. Schema (JSON-LD)",
    score: has ? 8 : 0,
    max: 10,
    evidence: has ? "JSON-LD detected" : "No JSON-LD found in body",
    fix: has ? null : "Add BlogPosting or TechArticle JSON-LD via blog detail page template",
  };
}

function layer2AuthorEEAT(authorMdx) {
  if (!authorMdx) {
    return {
      layer: "2. Author EEAT",
      score: 0,
      max: 10,
      evidence: "Author file not found",
      fix: "Add author file with bio + sameAs external links",
    };
  }
  const text = readFile(authorMdx);
  const links = (text.match(/linkedin\.com|github\.com|x\.com|twitter\.com|mastodon/gi) || []).length;
  const score = links === 0 ? 0 : links === 1 ? 4 : links === 2 ? 7 : 10;
  return {
    layer: "2. Author EEAT",
    score,
    max: 10,
    evidence: `${links} external profile link(s) in author file`,
    fix: links < 3 ? "Add LinkedIn / GitHub / X links to author mdx (sameAs candidates)" : null,
  };
}

function layer3Freshness(text) {
  const fmDate = /^date:/m.test(text);
  const fmUpdated = /^(lastUpdated|updated|dateModified):/m.test(text);
  const bodyUpdated = /Last updated|最近更新|最終更新|Zuletzt aktualisiert|Dernière mise à jour/i.test(text);
  const readingTime = /min read|分钟阅读|分で読めます|Min\. Lesezeit|min de lecture/i.test(text);
  const score = (fmDate ? 2 : 0) + (fmUpdated ? 2 : 0) + (bodyUpdated ? 2 : 0) + (readingTime ? 2 : 0);
  return {
    layer: "3. Freshness signals",
    score,
    max: 8,
    evidence: `frontmatter date=${fmDate} lastUpdated=${fmUpdated} body-visible=${bodyUpdated} reading-time=${readingTime}`,
    fix:
      score === 8
        ? null
        : "Add visible 'Last updated YYYY-MM-DD' + 'N min read' under byline (blog layout template)",
  };
}

function layer4AICitation(text) {
  const tldr = /TL;DR|TLDR|要点|要約|要約|Zusammenfassung|À retenir/i.test(text);
  const faq = /^##\s+(FAQ|Common questions|常见问题|よくある質問)/im.test(text);
  const llmsBlock = /llms-summary/.test(text);
  // crude citation capsule check: paragraph with both a number and an outbound https link
  const capsulePat = /[^\n]*\b\d+(\.\d+)?(%|ms|s|min|hr|d|x|×)?[^\n]*https?:\/\/[^\s)\]]+/gi;
  const capsules = (text.match(capsulePat) || []).length;
  const score =
    (tldr ? 2 : 0) + (faq ? 2 : 0) + (llmsBlock ? 2 : 0) + (capsules >= 3 ? 4 : capsules >= 1 ? 2 : 0);
  return {
    layer: "4. AI citation surface",
    score,
    max: 10,
    evidence: `TL;DR=${tldr} FAQ=${faq} llms-summary=${llmsBlock} citation-capsules≈${capsules}`,
    fix:
      score >= 8
        ? null
        : "Add TL;DR callout in first 200 words; add FAQ section answering 3+ PAA; add ≥3 citation capsules (one fact + number + outbound link per paragraph)",
  };
}

function layer5Multilingual(allBlogs, defaultLocale) {
  const locales = ["en", "zh", "ja", "de", "fr", "es", "ko", "pt-BR", "id"];
  const cnt = {};
  for (const loc of locales) cnt[loc] = 0;
  for (const f of allBlogs) {
    const base = path.basename(f);
    const m = base.match(/\.([a-z\-]+)\.(mdx?|markdown)$/i);
    if (m && locales.includes(m[1])) {
      cnt[m[1]]++;
    } else if (/\.(mdx?|markdown)$/.test(base) && !m) {
      cnt[defaultLocale] = (cnt[defaultLocale] || 0) + 1;
    }
  }
  const covered = Object.values(cnt).filter((v) => v > 0).length;
  // Assume the site declares 3 locales by default (en+zh+ja is typical)
  // TODO: read actual declared locales from i18n config
  const declared = 3;
  const score = Math.round((covered / declared) * 10);
  return {
    layer: "5. Multilingual coverage",
    score: Math.min(10, score),
    max: 10,
    evidence: `covered=${covered}/${declared} ${JSON.stringify(cnt)}`,
    fix: covered < declared ? "Write native (not translated) versions for missing locales" : null,
  };
}

function layer6InternalLinks(text, allSlugs, currentSlug) {
  // CTA presence (catch both Markdown ](/path) and JSX href="/path")
  const ctaPat = /(?:\]\(|href=["'])\/(generate|signup|pricing|start|product|workbench|app|demo)/g;
  const ctaCount = (text.match(ctaPat) || []).length;
  // Internal blog links to other posts
  const intPat = /(?:\]\(|href=["'])\/blog\/([a-z0-9-]+)/g;
  const internalLinks = new Set();
  let m;
  while ((m = intPat.exec(text))) {
    if (m[1] !== currentSlug) internalLinks.add(m[1]);
  }
  const score = Math.min(10, ctaCount * 2 + internalLinks.size * 1);
  return {
    layer: "6. Internal links / CTA",
    score,
    max: 10,
    evidence: `CTAs=${ctaCount} internal-blog-links=${internalLinks.size}`,
    fix: score < 6 ? "Add 1 mid-article CTA + 2 internal links to related blogs" : null,
  };
}

function layer7SerpGap() {
  return {
    layer: "7. SERP word-count gap",
    score: null,
    max: 10,
    evidence: "SKIPPED — requires DataForSEO credentials",
    fix: "Set DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD then re-run with --include-serp",
  };
}

const BANNED = [
  "delve into",
  "navigate the",
  "tapestry",
  "ever-evolving",
  "game-changer",
  "unleash",
  "unlock the power of",
  "in conclusion",
  "it's worth noting",
  "needless to say",
  "robust",
  "leverage",
  "synergy",
  "holistic",
  "Let's dive into",
  "Let's explore",
  "在当今快节奏的时代",
  "众所周知",
  "让我们一起来探索",
  "赋能",
  "闭环",
  "打通",
  "深度赋能",
  "全方位",
  "一站式",
  "沉浸式",
  "极致体验",
];

function layer8AntiAI(text) {
  const body = stripFrontmatter(text);
  // strip code blocks + tables
  const prose = body.replace(/```[\s\S]*?```/g, "").replace(/^\|.*\|$/gm, "");
  const sentences = prose.split(/[.!?。！？]+\s/).filter((s) => s.split(/\s+/).length >= 3);
  const lengths = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / (lengths.length || 1);
  const variance = lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / (lengths.length || 1);
  const stdev = Math.sqrt(variance);

  const totalWords = wordCount(prose);
  const fp = (prose.match(/\b(I|me|my|mine|we|us|our)\b/gi) || []).length;
  const fpRatio = (fp / totalWords) * 100;

  const bannedHits = BANNED.filter((p) => prose.toLowerCase().includes(p.toLowerCase())).length;

  // Score
  let score = 0;
  if (stdev >= 8) score += 2;
  if (fpRatio >= 1 && fpRatio <= 3) score += 2;
  if (bannedHits === 0) score += 2;
  // crude idiosyncratic phrase proxy: mid-length sentences that contain a comma + a number + a noun
  const idio = sentences.filter((s) => /,/.test(s) && /\d/.test(s)).length;
  if (idio / (sentences.length || 1) > 0.05) score += 2;
  // grammar break proxy: presence of em-dash or sentence fragments under 4 words
  const fragments = sentences.filter((s) => s.split(/\s+/).length <= 4).length;
  if (fragments >= 1) score += 2;

  return {
    layer: "8. Anti-AI tells",
    score,
    max: 10,
    evidence: `stdev=${stdev.toFixed(1)} fpRatio=${fpRatio.toFixed(2)}% banned-phrases=${bannedHits} idiosyncratic=${idio} fragments=${fragments}`,
    fix:
      score >= 8
        ? null
        : `Improve sentence-length variance (stdev≥8), first-person 1-3% range, remove banned phrases, add 1 grammar-break per 500 words`,
  };
}

// ---------- Main ----------

function findAuthorFile(authorId, root) {
  const candidates = [
    `content/author/${authorId}.mdx`,
    `content/author/${authorId}.md`,
    `content/authors/${authorId}.mdx`,
    `src/content/author/${authorId}.mdx`,
  ];
  for (const c of candidates) {
    const p = path.join(root, c);
    if (existsSync(p)) return p;
  }
  return null;
}

function extractAuthorFromFrontmatter(text) {
  const m = text.match(/^author:\s*([\w-]+)/m);
  return m ? m[1] : null;
}

const defaultLocale = detectDefaultLocale(cwd);
const allBlogs = listBlogs();
const allSlugs = allBlogs.map((f) => path.basename(f, path.extname(f)).replace(/\.(en|zh|ja|de|fr|es|ko|pt-BR|id)$/, ""));

const scoped = slugFilter
  ? allBlogs.filter((f) => path.basename(f).includes(slugFilter))
  : allBlogs;

if (scoped.length === 0) {
  console.error(`❌ No matching blogs found in ${blogDir} (slug filter: ${slugFilter || "(none)"})`);
  process.exit(1);
}

const results = scoped.map((f) => {
  const text = readFile(f);
  const slug = path.basename(f, path.extname(f));
  const authorId = extractAuthorFromFrontmatter(text);
  const authorMdx = authorId ? findAuthorFile(authorId, cwd) : null;

  const layers = [
    layer1Schema(text),
    layer2AuthorEEAT(authorMdx),
    layer3Freshness(text),
    layer4AICitation(text),
    layer5Multilingual(allBlogs, defaultLocale),
    layer6InternalLinks(text, allSlugs, slug),
    layer7SerpGap(),
    layer8AntiAI(text),
  ];

  const scored = layers.filter((l) => l.score !== null);
  const total = scored.reduce((a, l) => a + l.score, 0);
  const max = scored.reduce((a, l) => a + l.max, 0);

  return {
    slug,
    file: f,
    author: authorId,
    word_count: wordCount(stripFrontmatter(text)),
    total,
    max,
    percent: ((total / max) * 100).toFixed(1),
    layers,
  };
});

// ---------- Output ----------
if (jsonOut) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const r of results) {
    console.log(`\n## ${r.slug}  (${r.word_count} words, author: ${r.author || "?"})\n`);
    console.log(`Score: ${r.total} / ${r.max}  (${r.percent}%)\n`);
    console.log(`| Layer | Score | Evidence | Fix |`);
    console.log(`|---|---:|---|---|`);
    for (const l of r.layers) {
      const score = l.score === null ? "skip" : `${l.score}/${l.max}`;
      const fix = l.fix || "—";
      console.log(`| ${l.layer} | ${score} | ${l.evidence} | ${fix} |`);
    }
  }

  // Portfolio rollup
  const avgPct = (results.reduce((a, r) => a + parseFloat(r.percent), 0) / results.length).toFixed(1);
  const best = results.reduce((a, b) => (a.total > b.total ? a : b));
  const worst = results.reduce((a, b) => (a.total < b.total ? a : b));

  console.log(`\n---\n\n## Portfolio rollup\n`);
  console.log(`Articles audited: ${results.length}`);
  console.log(`Average score: ${avgPct}%`);
  console.log(`Best:  ${best.slug} (${best.percent}%)`);
  console.log(`Worst: ${worst.slug} (${worst.percent}%)`);
}
