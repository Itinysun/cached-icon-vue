#!/bin/bash

set -e

echo "🔍 验证发布是否成功..."

if [ $# -eq 0 ]; then
  echo "用法: $0 <版本号>"
  echo "例如: $0 1.0.1"
  exit 1
fi

VERSION=$1
PACKAGE_NAME="cached-icon-vue"

echo "📦 验证包: $PACKAGE_NAME@$VERSION"

# 1. 验证 NPM 包
echo ""
echo "1️⃣  验证 NPM 包..."
if npm view $PACKAGE_NAME@$VERSION > /dev/null 2>&1; then
  echo "✅ NPM 包 $PACKAGE_NAME@$VERSION 存在"
  
  # 获取包信息
  echo "📋 包信息:"
  npm view $PACKAGE_NAME@$VERSION --json | jq '{
    name: .name,
    version: .version,
    publishTime: .time[.version],
    main: .main,
    types: .types,
    files: .files
  }'
else
  echo "❌ NPM 包 $PACKAGE_NAME@$VERSION 不存在"
  exit 1
fi

# 2. 验证 GitHub Release
echo ""
echo "2️⃣  验证 GitHub Release..."
GITHUB_API="https://api.github.com/repos/Itinysun/cached-icon-vue/releases/tags/v$VERSION"

if curl -s "$GITHUB_API" | jq -e '.tag_name' > /dev/null; then
  echo "✅ GitHub Release v$VERSION 存在"
  
  # 获取 release 信息
  echo "📋 Release 信息:"
  curl -s "$GITHUB_API" | jq '{
    tag_name: .tag_name,
    name: .name,
    published_at: .published_at,
    draft: .draft,
    prerelease: .prerelease
  }'
else
  echo "❌ GitHub Release v$VERSION 不存在"
fi

# 3. 验证 Git 标签
echo ""
echo "3️⃣  验证 Git 标签..."
if git ls-remote --tags origin | grep -q "refs/tags/v$VERSION"; then
  echo "✅ Git 标签 v$VERSION 存在"
else
  echo "❌ Git 标签 v$VERSION 不存在"
fi

# 4. 测试包安装
echo ""
echo "4️⃣  测试包安装..."
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

echo "创建临时测试项目..."
npm init -y > /dev/null
echo "安装包 $PACKAGE_NAME@$VERSION..."

if npm install "$PACKAGE_NAME@$VERSION" > /dev/null 2>&1; then
  echo "✅ 包安装成功"
  
  # 测试导入
  cat > test.mjs << EOF
import { CachedIcon } from '$PACKAGE_NAME';
console.log('✅ ES 模块导入成功');
EOF

  cat > test.cjs << EOF
const { CachedIcon } = require('$PACKAGE_NAME');
console.log('✅ CommonJS 导入成功');
EOF

  echo "测试 ES 模块导入..."
  if node test.mjs 2>/dev/null; then
    echo "✅ ES 模块导入测试通过"
  else
    echo "❌ ES 模块导入测试失败"
  fi

  echo "测试 CommonJS 导入..."
  if node test.cjs 2>/dev/null; then
    echo "✅ CommonJS 导入测试通过"
  else
    echo "❌ CommonJS 导入测试失败"
  fi

  # 检查包内容
  echo "📁 包内容:"
  ls -la node_modules/$PACKAGE_NAME/lib/

else
  echo "❌ 包安装失败"
fi

# 清理
cd - > /dev/null
rm -rf "$TEMP_DIR"

# 5. 验证 package.json 版本
echo ""
echo "5️⃣  验证本地版本..."
LOCAL_VERSION=$(node -pe "require('./package.json').version")
if [ "$LOCAL_VERSION" = "$VERSION" ]; then
  echo "✅ 本地 package.json 版本匹配: $LOCAL_VERSION"
else
  echo "❌ 版本不匹配 - 本地: $LOCAL_VERSION, 预期: $VERSION"
fi

# 6. 验证 CHANGELOG
echo ""
echo "6️⃣  验证 CHANGELOG..."
if grep -q "$VERSION" CHANGELOG.md; then
  echo "✅ CHANGELOG.md 包含版本 $VERSION"
else
  echo "❌ CHANGELOG.md 不包含版本 $VERSION"
fi

echo ""
echo "🎉 验证完成！"
echo ""
echo "📊 验证摘要:"
echo "- NPM 包: https://www.npmjs.com/package/$PACKAGE_NAME/v/$VERSION"
echo "- GitHub Release: https://github.com/Itinysun/cached-icon-vue/releases/tag/v$VERSION"
echo "- 安装命令: npm install $PACKAGE_NAME@$VERSION"
