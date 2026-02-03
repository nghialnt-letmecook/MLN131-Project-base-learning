#!/bin/bash

# ==============================================================================
# AA-PANEL GENERIC DEPLOYMENT SCRIPT
# ==============================================================================

# --- ARGS ---
BIT_BRANCH=${1:-main}
GITHUB_TOKEN=${2}
PROJECT_NAME=${3}
REPO_URL_INPUT=${4}

# --- VALIDATION ---
if [ -z "$PROJECT_NAME" ]; then
    echo "Error: PROJECT_NAME (Machine Name/Domain) is required as 3rd argument."
    exit 1
fi

# --- ENV ---
export PATH=/www/server/nvm/versions/node/v24.13.0/bin:$PATH
corepack enable

# --- CONSTANTS ---
# Use the Project Name as the directory name
SOURCE_DIR="/app/git/${PROJECT_NAME}"
WEB_DIR="/www/wwwroot/${PROJECT_NAME}"

# Determine Repo URL
if [ -n "$REPO_URL_INPUT" ]; then
    # Inject token if present and URL is HTTPS
    if [ -n "$GITHUB_TOKEN" ] && [[ "$REPO_URL_INPUT" == https://* ]]; then
        # Replace https:// with https://TOKEN@
        REPO_URL="${REPO_URL_INPUT/https:\/\//https:\/\/${GITHUB_TOKEN}@}"
    else
        REPO_URL="$REPO_URL_INPUT"
    fi
else
    echo "Error: REPO_URL is required as 4th argument."
    exit 1
fi

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}===> STARTING DEPLOYMENT FOR: ${PROJECT_NAME} (Branch: ${BIT_BRANCH})${NC}"
echo -e "${CYAN}===> REPO: ${REPO_URL_INPUT}${NC}"

# 1. CLONE / UPDATE SOURCE
# ------------------------------------------------------------------------------
mkdir -p $SOURCE_DIR

if [ ! -d "$SOURCE_DIR/.git" ]; then
    echo -e "${GREEN}---> Cloning repository...${NC}"
    git clone -b $BIT_BRANCH $REPO_URL $SOURCE_DIR || { echo -e "${RED}Git clone failed${NC}"; exit 1; }
else
    echo -e "${GREEN}---> Pulling latest changes...${NC}"
    cd $SOURCE_DIR
    
    # Update remote URL if needed (e.g. token changed)
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

rsync -az --delete \
    --exclude '.git' \
    --exclude '.github' \
    --exclude 'src' \
    --exclude 'scripts' \
    --exclude 'README.md' \
    public/ $WEB_DIR/public/

cp package.json pnpm-lock.yaml next.config.ts $WEB_DIR/
rsync -az --delete .next/ $WEB_DIR/.next/
rsync -az node_modules/ $WEB_DIR/node_modules/

# 4. RESTART (AA-PANEL NODE PROJECT)
# ------------------------------------------------------------------------------
echo -e "${GREEN}---> Restarting project via aaPanel Node Project Manager...${NC}"

# Fix for "ModuleNotFoundError: No module named 'public'"
# aaPanel internal scripts rely on libraries in /www/server/panel/class
export PYTHONPATH=$PYTHONPATH:/www/server/panel/class

# Internal aaPanel command
python3 /www/server/panel/plugin/nodejs/nodejs_main.py restart "{\"project_name\":\"${PROJECT_NAME}\"}"

if [ $? -eq 0 ]; then
    echo -e "${CYAN}===> DEPLOYMENT SUCCESSFUL!${NC}"
else
    echo -e "${RED}===> FILE UPDATE SUCCESSFUL, BUT RESTART FAILED.${NC}"
    exit 1
fi
