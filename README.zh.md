# GEOSKILLS — 通用顶级 Blog 生产 Skill

> 大多数 AI 写文工具产出的内容在 ChatGPT / Perplexity / AI Overview 的引用率只有 3–6%。这个 skill 把目标拉到 15–25%，靠的是**真扒了 12 篇顶级 SaaS / 创始人 blog 的逐字结构**（Stripe Engineering、Vercel、Cloudflare、Anthropic、Linear、Supabase、Plausible、DHH、Paul Graham、Naval、patio11），不是套模板。**一个 skill，三种模式，必须用真实搜索数据**。

[English README](README.md) · [GitHub](https://github.com/echoD886/GEOSKILLS)

## 能做什么（三种模式合一）

### 模式 A — 写新文

```text
> 5 blogs in en zh ja
```

产出 15 篇可直接发布的文章（每个语言 5 篇，**原生不翻译**）。每个 locale 独立跑 DataForSEO 关键词调研，按 KD + 意图 + SERP 缺口选题，套 5 个文章原型里最合适的一个，注入完整 JSON-LD schema + EEAT 信号 + citation capsules。

### 模式 B — 改写现有 blog

```text
> rewrite my nano-banana-pro-complete-guide for AI citation
```

把现有 blog 拉到顶级线 —— 加 TL;DR 块、citation capsules、合适位置的 Q 式 H2、schema、reading-time、last-updated、llms.txt 摘要。只动这篇，不动整站。

### 模式 C — 审查现有 blog

```text
> audit my blogs
```

每篇 blog 给一份 8 层评分卡 + 精确到 `file:line` 的修法：

1. **Schema (JSON-LD)** — 存在性 + 完整度
2. **作者 EEAT** — sameAs 外链（LinkedIn / GitHub / X）
3. **新鲜度信号** — body 可见 last-updated、reading-time、dateModified
4. **AI 引用表面积** — TL;DR、citation capsules、FAQ、llms.txt
5. **多语言覆盖** — 实际 locale 数 vs 声明的 locale 数
6. **内链图谱** — 孤岛检测 + CTA 分布
7. **SERP 字数差距** — 你的文章 vs top-10 organic 中位数
8. **Anti-AI 检测** — 句长方差、特异表达密度、AI 禁用词

## 底层逻辑（5 阶段流水线）

一句话调用 = 5 阶段端到端跑通：

1. **项目自动探测** — 读 filesystem 识别框架（Next.js / Astro / Hugo / Jekyll / MDX）、blog 目录、frontmatter schema、locale 命名约定、作者分类、图片路径约定。**永远不硬编码具体项目**。
2. **真实关键词调研走 DataForSEO** — 调 5 个 endpoint（keyword_suggestions / bulk_keyword_difficulty / search_intent / serp_organic_advanced / domain_rank_overview）。真实搜索量、真实 KD 分数、真实 PAA、真实 AI Overview 引用源。**必需，没有降级到模拟数据这一选项**。
3. **选题** — 按真实 KD ≤ 站点权威 + 10 / 搜索意图 ∈ {信息, 商业} / SERP 竞争缺口 / 产品契合度 / AI Overview 机会综合打分。
4. **写作** — 从 5 个文章原型里挑最契合的，**直接抄那个原型在真实顶级 blog 里观察到的招牌动作**。
5. **EEAT + AI 引用注入** — JSON-LD schema（BlogPosting / TechArticle / Person / Organization / FAQPage / BreadcrumbList / ImageObject）+ body 里可见的 last-updated + 计算出的 reading-time + citation capsules + TL;DR 块 + `<!-- llms-summary -->` 给全站 `/llms.txt` 用。

## 5 个文章原型（每篇只能挑一个）

强行混搭会变成 AI-slop。每个原型从真实顶级 blog 真扒出来的：

| 原型 | 什么时候用 | 参考 blog |
|---|---|---|
| **A. 工程案例研究** | 内部有真实实验 + 真实指标 | Stripe Engineering / Cloudflare |
| **B. 发布公告** | 产品 / 功能 / 能力上线 | Vercel / Linear / Supabase / Anthropic |
| **C. 故障复盘** | 故障、回归、安全事件、险情值得公开 | Cloudflare post-mortem / GitHub status |
| **D. 研究笔记** | 原创研究、新 benchmark、数据集发布 | Anthropic / OpenAI / DeepMind |
| **E. 透明度 / 反主流** | 公开和行业默认不一样的立场，或晒别人不晒的内部数字 | Plausible / PostHog / DHH / patio11 |

## 8 个跨原型必守规则

这 8 条在 3 篇以上 canonical post 都重复出现，被钉死成硬约束：

1. **H2 必须是主谓句不能是名词标签**。Vercel：`"Anthropic leads in spend; Google leads in volume"`。禁止 `"架构"` / `"概览"` / `"背景"`。
2. **标题或前 50 字必有 1 个记忆点数字**。Plausible `+84%`、Anthropic `16 leading models`、Stripe `300ms`、Vercel `35+ models`。
3. **一个具体 artifact 贯穿全文**。Stripe 那个 `"$20 June payment"` 在 3 个约束章节里都出现。**纯抽象永远不沾地**。
4. **收尾从具体跳到普世格言**。DHH：`"the future is already here, it's just not evenly distributed."` 禁止 `"综上所述"` / `"In conclusion"`。
5. **CTA 策略按 archetype 分流，不能混**。Launch = 末尾平白话写明可用性 + 价格。Incident = 完全没 CTA。创始人 essay = 没 CTA。Research = GitHub + 招聘链接。
6. **证据密度匹配声明力度**。软文化声明 7 个外链；硬定量声明 40+ 法条引用。**没东西可链 = 这声明根本立不住**。
7. **长度即原型，先定长度再定形**。<500 字 = 格言体 essay；1100–1400 = 标准 launch / 案例；2000–2800 = 透明度 / 故障复盘；6500+ = 研究 / 创始人长 essay。
8. **造一个 proper noun 让读者带走**。Cloudflare 造 `"Code Orange"`、Linear 造 `"Code Intelligence"`、DHH 造 `"the malleable computer"`。每篇都该让读者带走一个之前不知道的名词。

## Anti-AI 质量门

Medium / Substack / Hacker News 的人工 curator 看这篇必须看不出来 AI 写的。编码成：

- **多语言 AI-slop 黑名单**。英文 `"delve into"`、`"navigate the"`、`"ever-evolving"`、`"game-changer"`、`"in conclusion"`。中文「赋能」「闭环」「打通」「沉浸式」「全方位」。日文「現代社会において」。
- **第一人称强制**：≥1 个第一手实验（带日期 / 地点 / 方法论）；≥3 个具体数字；≥2 个可验证的真实命名实体；≥1 个失败模式 / 限制声明。
- **Anti-AI 检测自查**：句长方差 ≥ 8；第一人称占比 1–3%；每 1000 字 ≥ 3 个特异表达；每 500 字 ≥ 1 个有意为之的语法破格。
- **Originality.ai 风格评分**：AI-content score ≤ 30% 才放行。

## 原生语言规则（每个 locale 独立跑）

**绝不直译**。每个 locale 跑自己的关键词调研，引用自己市场的真平台：

| 语言 | 原生关键词工具 | 原生平台引用 |
|---|---|---|
| en (US) | Google Suggest + Reddit + Ahrefs | Reddit / HN / Substack |
| zh-CN | 5118 / 百度指数 / 知乎热榜 | 小红书 / 抖音 / 知乎 / 掘金 / 思否 |
| ja | Yahoo Japan suggest + Note 人気 | X.jp / Note / Qiita |
| de | Google.de + Sistrix | t3n / Heise |
| fr | Yooda Insight + Korben | Korben / Numerama |
| ko | Naver DataLab | Naver Blog / Velog |
| pt-BR | Google.com.br | Tabnews |

如果你让它"把这篇英文翻译成日文"，它会拒绝，反过来给你写一篇关于同一主题的原生日文版本。

## 这个 skill 不做的事（顶层设计）

- **不内嵌任何凭证**。每个用户用自己的 DataForSEO + 图像生成 API Key，通过 env vars 注入。skill 文件不流通任何 secret。
- **不需要任何项目级 setup**。没有 `.content-pipeline/` 目录、不动 `package.json`、不要任何 config 文件。**项目自身的目录结构就是 config**。
- **不允许 DataForSEO 凭证缺失时降级到伪造数据**。没凭证就 halt + 给完整 setup 指引。
- **不翻译**。每个 locale 跑原生调研。
- **不向用户解释流水线细节**。用户要的是 blog，不是 pipeline。

## 装机一次，跨项目用（10 分钟，~$5）

### 1. clone skill（每台机器一次）

```bash
# Codex
git clone https://github.com/echoD886/GEOSKILLS.git ~/.codex/skills/blog-auto
chmod +x ~/.codex/skills/blog-auto/setup-check.sh

# Claude Code — 用 symlink 跟 Codex 保持同步
ln -sf ~/.codex/skills/blog-auto ~/.claude/skills/blog-auto
```

### 2. DataForSEO（必需）

```bash
# 注册：https://app.dataforseo.com/register
# 充值 $5 起步（够 ~5000 个关键词调用 = 大概 25 篇文章的预算）
# 加到 shell profile（~/.zshrc）：
export DATAFORSEO_LOGIN="你的-email@example.com"
export DATAFORSEO_PASSWORD="你的-api-password"
source ~/.zshrc
```

### 3. 图像生成（可选）

```bash
# 二选一
export GEMINI_API_KEY="..."   # https://aistudio.google.com/apikey
export OPENAI_API_KEY="..."   # https://platform.openai.com/api-keys
```

都没配的话，文章里会留 `<!-- IMAGE: 描述 -->` 占位符让你之后手动补图。

### 4. 验证

```bash
~/.codex/skills/blog-auto/setup-check.sh
```

应该看到：

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

## 在任何项目里用

```bash
cd /any/blog/project
codex                                   # 或 `claude`
> 5 blogs in en zh ja
```

非交互式批量跑：

```bash
codex exec "5 blogs in en zh ja, commit"
```

审查现有 blog：

```bash
codex
> audit my blogs
```

改写某一篇：

```bash
codex
> rewrite my nano-banana-pro-complete-guide for AI citation
```

## 真实成本

每跑 15 篇文章（3 个 locale × 5 篇）走完整 DataForSEO 流程的预算：**~$0.10–0.30**。命中 7 天缓存（按 `(关键词, locale, endpoint)` 三元组）所以重跑不重复花钱。

| API 调用 | 单价 | 15 篇预算 |
|---|---:|---:|
| keyword_suggestions | ~$0.0006 / 种子 | ~$0.05 |
| bulk_keyword_difficulty | ~$0.01 / 1000 词 | ~$0.01 |
| search_intent | ~$0.0006 / 1000 词 | ~$0.01 |
| serp/organic/live/advanced | ~$0.0006 / 关键词 | ~$0.05 |
| domain_rank_overview | ~$0.02 / 域 | ~$0.02 |
| **合计每 15 篇** | | **~$0.14** |

## 分享给别人安全吗

**完全安全可 fork**。每个接收者在自己机器上配自己的 DataForSEO + 图像生成账号。凭证只活在 shell env vars 里，**不通过 SKILL.md 或 setup-check.sh 任何文件流通**。

分享时让对方走上面的 Install 章节就行。第一次跑 `setup-check.sh` 会清晰提示缺什么 + 给完整 setup 指引。

## 校准基线（11 篇真实顶级 blog）

skill 里的每一条规则都能追溯到具体的真实文章扒来的招式，不是泛泛 SEO 建议：

- Cloudflare — *"Post Mortem on the Cloudflare Control Plane and Analytics Outage"*（2023）
- Anthropic — *"Agentic Misalignment: How LLMs could be insider threats"*（2025）
- Stripe — *"How we built it: Real-time analytics for Stripe Billing"*（2025）
- Vercel — *"AI Gateway production index"*（2026）
- Linear — *"Code Intelligence for Linear Agent"*（2026）
- Supabase — *"Supabase Is Now an Official ChatGPT App"*（2026）
- Plausible — *"How simplifying our homepage helped increase trial signups by 84%"*（2026）
- David Heinemeier Hansson — *"The Malleable Computer"*（2026）
- Paul Graham — *"The Brand Age"*（2026）
- Naval Ravikant — *"Sell the Truth"*（2026）
- Patrick McKenzie — *"Notes on a non-profit indicted for bank fraud"*（2026）

每篇 post 都做了结构拆解（开场动作 / H2 by H2 / 独特机制 / CTA 策略 / 证据元素 / 收尾动作），把可重放的模式压进了 skill 的 archetype 库。

## 许可

MIT — 任意 fork、镜像、改造、上线。

---

> 复杂度从来不是一夜降临的，它每次只多一段。