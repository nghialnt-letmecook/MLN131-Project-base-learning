#!/bin/bash

# ==============================================================================
# AA-PANEL NODE PROJECT DEPLOYMENT SCRIPT
# ==============================================================================

# --- ARGS ---
BIT_BRANCH=${1:-main}
GITHUB_TOKEN=${2}

# --- ENV ---
# Ensure the correct Node.js version is in path (Adjust version if needed)
export PATH=/www/server/nvm/versions/node/v24.13.0/bin:$PATH
corepack enable

# --- CONSTANTS ---
PROJECT_NAME="mln1313d.aizy.io.vn"
REPO_NAME="motkhoivietnam-3d"
SOURCE_DIR="/app/git/${PROJECT_NAME}"
WEB_DIR="/www/wwwroot/${PROJECT_NAME}"

# Use token if provided, otherwise fallback to SSH or existing config
if [ -n "$GITHUB_TOKEN" ]; then
    REPO_URL="https://${GITHUB_TOKEN}@github.com/AIZY-Outsourcing/${REPO_NAME}.git"
else
    # Fallback to standard HTTPS or SSH if key is configured on server
    REPO_URL="https://github.com/AIZY-Outsourcing/${REPO_NAME}.git"
fi

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}===> STARTING DEPLOYMENT: ${PROJECT_NAME} (Branch: ${BIT_BRANCH})${NC}"

# 1. CLONE / UPDATE SOURCE
# ------------------------------------------------------------------------------
mkdir -p $SOURCE_DIR

if [ ! -d "$SOURCE_DIR/.git" ]; then
    echo -e "${GREEN}---> Cloning repository...${NC}"
    git clone -b $BIT_BRANCH $REPO_URL $SOURCE_DIR || { echo -e "${RED}Git clone failed${NC}"; exit 1; }
else
    echo -e "${GREEN}---> Pulling latest changes...${NC}"
    cd $SOURCE_DIR
    
    # Update remote URL if token changes (optional, but good safety)
    if [ -n "$GITHUB_TOKEN" ]; then
        git remote set-url origin $REPO_URL
    fi

    git fetch origin
    git reset --hard origin/$BIT_BRANCH
fi

cd $SOURCE_DIR || exit 1

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

# Sync public assets and built files
# Exclude git, source, and unnecessary files to keep production clean
rsync -az --delete \
    --exclude '.git' \
    --exclude '.github' \
    --exclude 'src' \
    --exclude 'scripts' \
    --exclude 'README.md' \
    public/ $WEB_DIR/public/

# Copy config files
cp package.json pnpm-lock.yaml next.config.ts $WEB_DIR/

# Sync build output (.next)
rsync -az --delete .next/ $WEB_DIR/.next/

# Sync node_modules
rsync -az node_modules/ $WEB_DIR/node_modules/

# 4. RESTART (AA-PANEL NODE PROJECT)
# ------------------------------------------------------------------------------
echo -e "${GREEN}---> Restarting project via aaPanel Node Project Manager...${NC}"

# Internal aaPanel command to validly restart the node project
python3 /www/server/panel/plugin/nodejs/nodejs_main.py restart "{\"project_name\":\"${PROJECT_NAME}\"}"

if [ $? -eq 0 ]; then
    echo -e "${CYAN}===> DEPLOYMENT SUCCESSFUL!${NC}"
else
    echo -e "${RED}===> FILE UPDATE SUCCESSFUL, BUT RESTART FAILED.${NC}"
    echo "Please check aaPanel Node Project status."
    exit 1
fi
