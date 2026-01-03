#!/bin/bash
set -e

echo "🔒 Step 1: Creating backup..."
BACKUP_DIR="backup_web_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
cp -r web/src $BACKUP_DIR/
echo "✅ Backup created at $BACKUP_DIR"

echo "🧹 Step 2: Removing conflicting folders..."
rm -rf web/src/components/Layout.tsx
rm -rf web/src/layout
rm -rf web/src/layouts/AppLayout.tsx

echo "📁 Step 3: Creating clean folder structure..."
mkdir -p web/src/components/{common,layout,ai}
mkdir -p web/src/pages/{Earnings,Savings,Learn,Profile}
mkdir -p web/src/hooks
mkdir -p web/src/layouts
mkdir -p web/src/api
mkdir -p web/src/router

echo "📦 Step 4: Moving existing files safely..."

# Layout
mv web/src/components/Layout.tsx web/src/layouts/AppLayout.tsx 2>/dev/null || true

# Pages
mv web/src/pages/AddIncome.tsx web/src/pages/Earnings/AddEarning.tsx 2>/dev/null || true
mv web/src/pages/Earnings.tsx web/src/pages/Earnings/EarningsHome.tsx 2>/dev/null || true
mv web/src/pages/CreateGoal.tsx web/src/pages/Savings/CreateGoal.tsx 2>/dev/null || true
mv web/src/pages/Savings.tsx web/src/pages/Savings/SavingsHome.tsx 2>/dev/null || true
mv web/src/pages/ChatHistory.tsx web/src/pages/Profile/ChatHistory.tsx 2>/dev/null || true
mv web/src/pages/Profile.tsx web/src/pages/Profile/ProfileHome.tsx 2>/dev/null || true
mv web/src/pages/Settings.tsx web/src/pages/Profile/Settings.tsx 2>/dev/null || true

# AI
mv web/src/components/VoiceAssistant.tsx web/src/components/ai/VoiceAssistant.tsx 2>/dev/null || true

echo "🧽 Step 5: Removing empty folders..."
find web/src -type d -empty -delete

echo "🎯 Cleanup complete."
echo "👉 Next: update imports + router (handled in next step)"



# ▶️ HOW TO RUN

    # From repo root:

        # chmod +x scripts/cleanup-web-structure.sh
        # ./scripts/cleanup-web-structure.sh


    # If anything goes wrong, you can instantly restore:

        # rm -rf web/src
        # cp -r backup_web_YYYYMMDD_HHMMSS/src web/src