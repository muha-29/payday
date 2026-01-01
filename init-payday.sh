#!/usr/bin/env bash
set -e

echo "🚀 Initializing PayDay Monorepo..."

# Root folders
mkdir -p apps/web
mkdir -p apps/edge/functions
mkdir -p packages/shared
mkdir -p packages/ai
mkdir -p infra/mongo
mkdir -p infra/ollama
mkdir -p docs

# -------------------------
# Root config
# -------------------------
cat > .gitignore << 'EOF'
node_modules
.env
.env.local
dist
build
.supabase
EOF

cat > .env.example << 'EOF'
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

MONGODB_URI=

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=tinyllama
EOF

cat > README.md << 'EOF'
# PayDay

Personal financial assistant for Indian gig workers.

## Monorepo Structure
- apps/web        → React frontend
- apps/edge       → Supabase Edge Functions
- packages/shared → Shared types & constants
- packages/ai     → AI prompts & schemas
- infra           → MongoDB & Ollama configs
EOF

# -------------------------
# packages/shared
# -------------------------
cat > packages/shared/package.json << 'EOF'
{
  "name": "@payday/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module"
}
EOF

cat > packages/shared/types.ts << 'EOF'
export type WorkType =
  | 'delivery'
  | 'driver'
  | 'food_delivery'
  | 'daily_wage'
  | 'freelance'
  | 'other';

export type IncomeRange =
  | 'below_10k'
  | '10k_15k'
  | '15k_20k'
  | '20k_25k'
  | 'above_25k';
EOF

cat > packages/shared/constants.ts << 'EOF'
export const APP_NAME = 'PayDay';
export const CURRENCY = 'INR';
EOF

# -------------------------
# packages/ai
# -------------------------
cat > packages/ai/package.json << 'EOF'
{
  "name": "@payday/ai",
  "version": "0.1.0",
  "private": true,
  "type": "module"
}
EOF

cat > packages/ai/prompts.ts << 'EOF'
export const SYSTEM_PROMPT = `
You are a friendly financial advisor for Indian gig workers.
Use simple Indian English.
Be encouraging.
Never suggest loans or risky investments.
`.trim();

export function buildInsightPrompt(context: string) {
  return `
${SYSTEM_PROMPT}

Context:
${context}

Give ONE practical suggestion.
Max 15 words.
`.trim();
}
EOF

cat > packages/ai/schemas.ts << 'EOF'
export const insightSchema = {
  type: 'object',
  properties: {
    insight: { type: 'string' }
  },
  required: ['insight']
};
EOF

# -------------------------
# apps/edge (Supabase)
# -------------------------
cat > apps/edge/README.md << 'EOF'
# Supabase Edge Functions

Run locally:
supabase start
supabase functions serve
EOF

cat > apps/edge/functions/_shared.ts << 'EOF'
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

export function getSupabaseClient(req: Request) {
  const authHeader = req.headers.get('Authorization')!;
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );
}
EOF

cat > apps/edge/functions/health/index.ts << 'EOF'
export const handler = async () => {
  return new Response(
    JSON.stringify({ status: 'ok', service: 'payday-edge' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
EOF

# -------------------------
# apps/web (Frontend skeleton)
# -------------------------
cat > apps/web/package.json << 'EOF'
{
  "name": "payday-web",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
EOF

cat > apps/web/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PayDay</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

mkdir -p apps/web/src

cat > apps/web/src/main.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return <h1>PayDay – App Bootstrapped</h1>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
EOF

# -------------------------
# infra/mongo
# -------------------------
cat > infra/mongo/README.md << 'EOF'
# MongoDB

Recommended: MongoDB Atlas (Free Tier)

Collections:
- users
- incomes
- expenses
- savings_goals
- ai_snapshots
EOF

# -------------------------
# infra/ollama
# -------------------------
cat > infra/ollama/README.md << 'EOF'
# Ollama

Start Ollama:
ollama serve

Pull model:
ollama pull tinyllama
EOF

# -------------------------
# docs
# -------------------------
cat > docs/architecture.md << 'EOF'
# PayDay Architecture

Frontend → Supabase Edge Functions → MongoDB → Ollama (TinyLlama)
EOF

echo "✅ PayDay monorepo initialized successfully."
