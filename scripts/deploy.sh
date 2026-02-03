#!/bin/bash

# ==============================================================================
# AA-PANEL NODE PROJECT DEPLOYMENT SCRIPT (STAYING IN REPO)
# ==============================================================================

# --- ARGS ---
BIT_BRANCH=${1:-main}
GITHUB_TOKEN=${2}
PROJECT_NAME=${3}
REPO_URL_INPUT=${4}

# --- ENV ---
export PATH=/www/server/nvm/versions/node/v24.13.0/bin:$PATH
corepack enable

# --- PATHS ---
# Script đang chạy từ /app/git/DIR/scripts/deploy.sh
# SOURCE_DIR là thư mục cha của thư mục chứa script này
SOURCE_DIR=$(dirname $(cd "$(dirname "$0")"; pwd))
WEB_DIR="/www/wwwroot/${PROJECT_NAME}"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}===> STARTING BUILD & SYNC FOR: ${PROJECT_NAME} ${NC}"
cd "$SOURCE_DIR"

# 1. PREPARE ENVIRONMENT (Copy .env if exists in production)
# ------------------------------------------------------------------------------
if [ -f "$WEB_DIR/.env" ]; then
    echo -e "${GREEN}---> Copying .env from production directory...${NC}"
    cp "$WEB_DIR/.env" "$SOURCE_DIR/.env"
fi

# 2. INSTALL & BUILD
# ------------------------------------------------------------------------------
echo -e "${GREEN}---> Installing dependencies...${NC}"
pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile || exit 1

echo -e "${GREEN}---> Building project...${NC}"
pnpm run build || exit 1

# 3. SYNC TO WEB ROOT
# ------------------------------------------------------------------------------
echo -e "${GREEN}---> Syncing files to ${WEB_DIR}...${NC}"
mkdir -p $WEB_DIR

rsync -az --delete \
    --exclude '.git' \
    --exclude '.github' \
    --exclude 'src' \
    --exclude 'scripts' \
    --exclude 'README.md' \
    --exclude '.env*' \
    public/ $WEB_DIR/public/

cp package.json pnpm-lock.yaml next.config.ts $WEB_DIR/
rsync -az --delete .next/ $WEB_DIR/.next/
rsync -az node_modules/ $WEB_DIR/node_modules/

# 4. RESTART (AA-PANEL NODE PROJECT)
# ------------------------------------------------------------------------------
echo -e "${GREEN}---> Restarting project via aaPanel Node Project Manager...${NC}"

export PYTHONPATH=$PYTHONPATH:/www/server/panel/class:/www/server/panel
btpython /www/server/panel/plugin/nodejs/nodejs_main.py restart "{\"project_name\":\"${PROJECT_NAME}\"}"

if [ $? -eq 0 ]; then
    echo -e "${CYAN}===> DEPLOYMENT SUCCESSFUL!${NC}"
else
    echo -e "${RED}===> FILE UPDATE SUCCESSFUL, BUT RESTART FAILED.${NC}"
    exit 1
fi
