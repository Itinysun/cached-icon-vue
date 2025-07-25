# 发布指南

本文档描述了如何发布 `cached-icon-vue` 包的新版本。

## 发布前准备

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 9.0.0
- Git 配置正确的用户信息
- npm 账户且有发布权限
- GitHub 访问权限

### 环境变量

确保配置以下环境变量（用于 CI/CD）：

```bash
# npm 发布 token
NPM_TOKEN=npm_xxxxxxxxxxxx

# GitHub token (自动生成)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

## 发布流程

### 1. 手动发布（推荐）

```bash
# 确保在 main/master 分支
git checkout main
git pull origin main

# 运行发布前检查
pnpm run pre-release

# 交互式发布
pnpm run release
```

交互式发布会提示：
- 选择版本类型（patch/minor/major/prerelease）
- 确认变更日志
- 确认发布信息

### 2. 预览发布

```bash
# 预览发布过程（不执行实际操作）
pnpm run release:dry
```

这会显示：
- 将要执行的操作
- 生成的变更日志
- Git 标签和提交信息
- npm 发布信息

### 3. CI/CD 自动发布

#### 自动触发发布

推送到 `main` 或 `master` 分支会自动触发发布：

```bash
git push origin main
```

#### 手动触发发布

1. 访问 GitHub Actions 页面
2. 选择 "Release" 工作流
3. 点击 "Run workflow"
4. 选择发布类型
5. 点击 "Run workflow"

## 版本策略

### 语义化版本

项目遵循 [Semantic Versioning](https://semver.org/) 规范：

- `MAJOR`: 不兼容的 API 变更
- `MINOR`: 向后兼容的功能新增
- `PATCH`: 向后兼容的问题修正

### 版本类型示例

```bash
# 修复 bug
1.0.0 → 1.0.1 (patch)

# 新增功能
1.0.0 → 1.1.0 (minor)  

# 破坏性变更
1.0.0 → 2.0.0 (major)

# 预发布
1.0.0 → 1.0.1-beta.0 (prerelease)
1.0.1-beta.0 → 1.0.1-beta.1 (prerelease)
1.0.1-beta.1 → 1.0.1 (release)
```

## 发布检查清单

发布前请确认：

- [ ] 所有测试通过
- [ ] 代码检查通过 
- [ ] 类型检查通过
- [ ] 文档已更新
- [ ] CHANGELOG 准确反映变更
- [ ] 版本号符合语义化版本规范
- [ ] GitHub Release 信息完整
- [ ] npm 包发布成功

## 回滚发布

如果发布出现问题，可以：

### 1. 撤回 npm 发布

```bash
# 撤回最新版本（24小时内）
npm unpublish cached-icon-vue@latest

# 撤回特定版本
npm unpublish cached-icon-vue@1.0.1
```

### 2. 删除 Git 标签

```bash
# 删除本地标签
git tag -d v1.0.1

# 删除远程标签
git push origin :refs/tags/v1.0.1
```

### 3. 删除 GitHub Release

访问 GitHub Releases 页面手动删除。

## 故障排除

### 常见问题

1. **npm 权限错误**
   ```bash
   npm whoami
   npm access list packages
   ```

2. **Git 权限错误**
   ```bash
   git config --list
   ssh -T git@github.com
   ```

3. **版本冲突**
   ```bash
   git fetch --tags
   git tag -l
   ```

4. **构建失败**
   ```bash
   pnpm run clean
   pnpm install
   pnpm run build
   ```

### 联系方式

如遇问题，请：
- 提交 GitHub Issue
- 检查 Actions 日志
- 查看 npm 发布日志

## 发布历史

发布历史记录在以下位置：
- [CHANGELOG.md](../CHANGELOG.md) - 详细变更日志
- [GitHub Releases](https://github.com/your-repo/releases) - 发布页面
- [npm 版本历史](https://www.npmjs.com/package/cached-icon-vue?activeTab=versions) - npm 页面