#!/bin/bash
# 用法：./deploy.sh [环境名]，环境名对应 deploy/<环境名>.env，默认 production
set -e

REMOTE="origin"
BRANCH="main"
DEPLOY_ENV="${1:-production}"
ENV_FILE="deploy/${DEPLOY_ENV}.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ 未找到环境配置 ${ENV_FILE}，可选：$(ls deploy)"
  exit 1
fi

echo "🔀 切换到 ${BRANCH} 分支..."
git checkout $BRANCH

echo "🔄 从 ${REMOTE}/${BRANCH} 拉取最新代码..."
git pull $REMOTE $BRANCH

echo "🐳 构建并启动容器（环境：${DEPLOY_ENV}）..."
docker compose -p "expert-rating-${DEPLOY_ENV}" --env-file "$ENV_FILE" up -d --build

echo "✅ 部署完成。"
