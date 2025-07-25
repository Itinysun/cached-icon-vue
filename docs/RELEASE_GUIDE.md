# 🚀 发布指南

本文档详细介绍了 cached-icon-vue 项目的完整发布流程。

## 📋 发布前检查清单

在进行任何发布操作前，请确保：

- [ ] 所有功能已开发完成并测试通过
- [ ] 代码已通过所有 CI 检查
- [ ] 文档已更新（README.md、API 文档等）
- [ ] 示例代码已验证
- [ ] 版本号符合[语义化版本规范](https://semver.org/lang/zh-CN/)

## 🛠️ 发布方式

### 方式一：GitHub Actions 自动发布（推荐）

#### 小版本发布（自动）

当你将代码推送到 `main` 分支时，会自动触发 patch 版本发布：

```bash
git checkout main
git pull origin main
# 确保所有更改已提交
git push origin main
```

#### 指定版本发布（手动）

1. 访问 [GitHub Actions](https://github.com/Itinysun/cached-icon-vue/actions)
2. 选择 "Release" 工作流
3. 点击 "Run workflow"
4. 选择发布类型：
   - **patch** (1.0.0 → 1.0.1): 错误修复
   - **minor** (1.0.0 → 1.1.0): 新功能，向后兼容
   - **major** (1.0.0 → 2.0.0): 破坏性变更
   - **prerelease** (1.0.0 → 1.0.1-0): 预发布版本

### 方式二：本地发布

```bash
# 交互式发布（推荐用于开发环境）
pnpm run release

# 预览发布（查看将要执行的操作，不实际发布）
pnpm run release:dry

# CI 模式发布（用于自动化环境）
pnpm run release:ci -- patch|minor|major|prerelease
```

## 🔄 发布流程详解

### 1. 预发布检查

发布前会自动执行以下检查：

- ✅ 当前分支必须是 `main` 或 `master`
- ✅ 工作目录必须干净（无未提交的更改）
- ✅ 本地分支与远程同步
- ✅ Node.js >= 18.0.0
- ✅ pnpm >= 9.0.0
- ✅ 所有依赖安装完成
- ✅ 测试通过
- ✅ 类型检查通过
- ✅ 代码检查通过
- ✅ 格式检查通过
- ✅ 构建成功

### 2. 版本管理

- 自动更新 `package.json` 中的版本号
- 生成或更新 `CHANGELOG.md`
- 创建 Git 标签 `v{version}`
- 提交版本更改

### 3. 发布到平台

- 🐙 **GitHub**: 创建 Release，包含自动生成的发布说明
- 📦 **NPM**: 发布到 npm registry

## 📝 版本号规范

本项目遵循[语义化版本](https://semver.org/lang/zh-CN/)规范：

### MAJOR.MINOR.PATCH (例：2.1.3)

- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向下兼容的功能性新增
- **PATCH**: 向下兼容的问题修正

### 预发布版本

格式：`1.0.0-alpha.1`、`1.0.0-beta.1`、`1.0.0-rc.1`

## 🚨 发布故障排除

### 常见问题

#### 1. 工作目录不干净

```bash
# 查看未提交的更改
git status

# 提交或撤销更改
git add .
git commit -m "chore: prepare for release"
# 或
git reset --hard HEAD
```

#### 2. 与远程不同步

```bash
# 拉取最新代码
git pull origin main

# 或推送本地更改
git push origin main
```

#### 3. 测试失败

```bash
# 手动运行测试查看详细错误
pnpm run test:run

# 修复后重新运行
pnpm run test:run
```

#### 4. 构建失败

```bash
# 清理并重新构建
pnpm run clean
pnpm run build

# 检查构建产物
ls -la lib/
```

### 回滚版本

如果发布后发现问题，可以：

1. **NPM 回滚**（24小时内）:

```bash
npm unpublish cached-icon-vue@版本号
```

2. **GitHub Release 回滚**:
   删除对应的 Release 和 Git 标签

3. **快速修复**:
   发布一个新的 patch 版本修复问题

## 📊 发布后验证

发布完成后，请验证：

- [ ] NPM 包可以正常安装：`npm install cached-icon-vue@latest`
- [ ] GitHub Release 页面显示正确
- [ ] 文档站点更新（如果有）
- [ ] 示例项目仍然工作正常

## 🔔 发布通知

发布完成后，考虑通知用户：

- 更新项目 README
- 发布推特/微博
- 通知相关社区
- 更新相关文档

## 📞 获取帮助

如果在发布过程中遇到问题：

1. 查看 GitHub Actions 日志
2. 检查 `release-it` 日志
3. 参考本文档的故障排除部分
4. 在项目仓库创建 Issue
