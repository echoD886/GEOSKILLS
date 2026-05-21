#!/usr/bin/env bash
# blog-auto setup verifier — run this once after first install to confirm
# environment is wired up correctly. Each user runs it on their own machine.
# No credentials are stored in this file.

set -u

green() { printf "\033[32m%s\033[0m\n" "$1"; }
red() { printf "\033[31m%s\033[0m\n" "$1"; }
yellow() { printf "\033[33m%s\033[0m\n" "$1"; }
bold() { printf "\033[1m%s\033[0m\n" "$1"; }

bold "blog-auto setup check"
echo

# ---- DataForSEO (mandatory) ----
bold "[1/3] DataForSEO credentials"
if [ -z "${DATAFORSEO_LOGIN:-}" ] || [ -z "${DATAFORSEO_PASSWORD:-}" ]; then
  red "❌ DATAFORSEO_LOGIN or DATAFORSEO_PASSWORD not set."
  echo "   Sign up at https://app.dataforseo.com/register"
  echo "   Then add to ~/.zshrc (or ~/.bashrc):"
  echo "     export DATAFORSEO_LOGIN='your-email@example.com'"
  echo "     export DATAFORSEO_PASSWORD='your-api-password'"
  echo "   Reload: source ~/.zshrc"
  exit 1
fi

echo "   Testing live API call (cost ~\$0.0006)..."
response=$(curl -s -u "$DATAFORSEO_LOGIN:$DATAFORSEO_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '[{"keyword":"hello world","location_code":2840,"language_code":"en","limit":3}]' \
  https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live)

status=$(echo "$response" | grep -o '"status_code":[0-9]*' | head -1 | cut -d: -f2)
case "$status" in
  20000) green "✅ DataForSEO OK (status 20000)";;
  40100|40200) red "❌ DataForSEO auth failed (status $status) — check your login/password"; exit 1;;
  40400) red "❌ DataForSEO out of credit (status 40400) — top up wallet"; exit 1;;
  *) red "❌ DataForSEO unexpected status $status — full response:"; echo "$response"; exit 1;;
esac

# Check remaining credit
balance=$(curl -s -u "$DATAFORSEO_LOGIN:$DATAFORSEO_PASSWORD" \
  https://api.dataforseo.com/v3/appendix/user_data \
  | grep -o '"money":[^,}]*' | head -1 | cut -d: -f2 | tr -d '"')
if [ -n "$balance" ]; then
  echo "   Wallet balance: \$${balance}"
fi
echo

# ---- Image generation (optional) ----
bold "[2/3] Image generation (optional)"
if [ -n "${GEMINI_API_KEY:-}" ]; then
  green "✅ GEMINI_API_KEY set — will use nano-banana for images"
elif [ -n "${OPENAI_API_KEY:-}" ]; then
  green "✅ OPENAI_API_KEY set — will use GPT Image for images"
else
  yellow "⚠️  No image-gen key set — articles will use <!-- IMAGE: ... --> placeholders"
  echo "   To enable auto image generation, add one of:"
  echo "     export GEMINI_API_KEY='...'   # https://aistudio.google.com/apikey"
  echo "     export OPENAI_API_KEY='...'   # https://platform.openai.com/api-keys"
fi
echo

# ---- Project detection ----
bold "[3/3] Current project"
echo "   cwd: $(pwd)"
if [ -d ".git" ]; then
  green "✅ git repo detected"
else
  yellow "⚠️  Not a git repo — commit/push features will not work"
fi

if [ -f "package.json" ]; then
  pm="npm"
  [ -f "pnpm-lock.yaml" ] && pm="pnpm"
  [ -f "yarn.lock" ] && pm="yarn"
  [ -f "bun.lockb" ] && pm="bun"
  green "✅ Node project ($pm)"
fi

# Detect blog dir
for d in content/blog src/content/blog content/posts _posts posts blog src/blog; do
  if [ -d "$d" ]; then
    cnt=$(find "$d" -maxdepth 2 -type f \( -name '*.mdx' -o -name '*.md' \) | wc -l | tr -d ' ')
    green "✅ Blog dir: $d ($cnt existing posts)"
    break
  fi
done

echo
bold "Setup check complete."
echo "Run \`codex\` or \`claude\` in this directory, then ask: \"5 blogs in en zh ja\""
