#!/bin/bash

set -e

echo "🔍 执行发布前检查..."

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "master" ]]; then
  echo "❌ 错误: 只能从 main 或 master 分支发布"
  echo "当前分支: $CURRENT_BRANCH"
  exit 1
fi

# 检查工作目录是否干净
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ 错误: 工作目录不干净，请先提交所有更改"
  git status --short
  exit 1
fi

# 检查是否与远程同步
git fetch origin $CURRENT_BRANCH
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/$CURRENT_BRANCH)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "❌ 错误: 本地分支与远程不同步"
  echo "请执行 git pull 或 git push"
  exit 1
fi

# 检查 Node.js 版本
NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ 错误: 需要 Node.js >= 20.0.0"
  echo "当前版本: $(node --version)"
  exit 1
fi

# 检查 pnpm 版本
if ! command -v pnpm &> /dev/null; then
  echo "❌ 错误: 未安装 pnpm"
  exit 1
fi

PNPM_VERSION=$(pnpm --version | cut -d '.' -f 1)
if [ "$PNPM_VERSION" -lt 9 ]; then
  echo "❌ 错误: 需要 pnpm >= 9.0.0"
  echo "当前版本: $(pnpm --version)"
  exit 1
fi

# 检查依赖
echo "📦 检查依赖..."
pnpm install --frozen-lockfile

# 运行测试（如果有测试文件）
if [ -n "$(find . -name '*.test.*' -o -name '*.spec.*' | head -1)" ]; then
  echo "🧪 运行测试..."
  pnpm run test:run
else
  echo "⏭️  跳过测试（未找到测试文件）..."
fi

# 类型检查
echo "🔧 类型检查..."
pnpm run typecheck

# 代码检查
echo "🔍 代码检查..."
pnpm run lint:check

# 格式化代码
echo "💅 格式化代码..."
pnpm run format

# 构建
echo "🏗️  构建..."
pnpm run build

# 检查构建产物
if [ ! -f "lib/index.js" ] || [ ! -f "lib/index.d.ts" ]; then
  echo "❌ 错误: 构建产物不完整"
  ls -la lib/
  exit 1
fi

echo "✅ 所有检查通过，可以发布!"
echo ""
echo "发布命令："
echo "  pnpm run release        # 交互式发布"
echo "  pnpm run release:dry    # 预览发布（不执行）"
echo "  pnpm run release:ci     # CI 环境发布"