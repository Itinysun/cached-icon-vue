# 🔐 GitHub Secrets 配置指南

为了确保自动发布功能正常工作，你需要在 GitHub 仓库中配置以下 Secrets。

## 📋 必需的 Secrets

### 1. NPM_TOKEN (必需)

用于将包发布到 NPM registry。

#### 获取 NPM Token:

1. 访问 [npmjs.com](https://www.npmjs.com/) 并登录
2. 点击头像 → "Access Tokens"
3. 点击 "Generate New Token"
4. 选择 "Automation" 类型
5. 复制生成的 token

#### 添加到 GitHub Secrets:

1. 进入你的仓库：https://github.com/Itinysun/cached-icon-vue
2. 点击 "Settings" 标签
3. 在左侧菜单点击 "Secrets and variables" → "Actions"
4. 点击 "New repository secret"
5. Name: `NPM_TOKEN`
6. Secret: 粘贴你的 NPM token
7. 点击 "Add secret"

### 2. GITHUB_TOKEN (自动提供)

这个 token 由 GitHub 自动提供，不需要手动配置。用于：

- 创建 Git 标签
- 创建 GitHub Releases
- 更新仓库内容

### 3. CODECOV_TOKEN (可选)

如果你想要详细的代码覆盖率报告：

1. 访问 [codecov.io](https://codecov.io/) 并用 GitHub 登录
2. 添加你的仓库
3. 复制 Repository Upload Token
4. 在 GitHub Secrets 中添加 `CODECOV_TOKEN`

## 🔧 验证配置

### 检查 NPM 包权限

确保你的 NPM 账户有发布权限：

```bash
# 检查当前登录用户
npm whoami

# 检查包名是否可用（如果是新包）
npm view cached-icon-vue

# 如果包不存在，说明名称可用
# 如果包存在，确保你是 maintainer
npm owner ls cached-icon-vue
```

### 测试发布流程

在真正发布前，建议先运行 dry-run：

```bash
# 预览发布过程
pnpm run release:dry

# 或者在 GitHub Actions 中手动触发一次测试
```

## 🚨 安全最佳实践

### NPM Token 权限

确保 NPM token 具有最小必要权限：

- ✅ 只允许发布特定包
- ✅ 设置 IP 地址限制（如果可能）
- ✅ 定期轮换 token

### GitHub 权限

Release workflow 需要以下权限（已在 workflow 中配置）：

- `contents: write` - 创建标签和更新文件
- `issues: write` - 更新相关 issues
- `pull-requests: write` - 更新相关 PRs
- `packages: write` - 发布包

## 🔄 Token 维护

### 定期更新

建议每 3-6 个月更新一次 NPM token：

1. 在 NPM 生成新 token
2. 在 GitHub Secrets 中更新 `NPM_TOKEN`
3. 删除旧 token

### 监控使用

- 在 NPM 中监控 token 使用情况
- 在 GitHub Actions 中检查发布日志
- 设置 NPM 包发布通知

## 📞 故障排除

### 常见错误

#### "401 Unauthorized" - NPM Token 问题

- 检查 token 是否正确
- 确认 token 未过期
- 验证包发布权限

#### "403 Forbidden" - 权限问题

- 检查是否为包的 maintainer
- 确认包名拼写正确
- 验证 NPM 账户状态

#### GitHub Token 问题

- GitHub Token 是自动提供的，通常不会有问题
- 如果有权限错误，检查 workflow 中的 permissions 配置

### 获取帮助

如果遇到问题：

1. 查看 GitHub Actions 运行日志
2. 检查 NPM 账户和包状态
3. 参考 [NPM 文档](https://docs.npmjs.com/)
4. 在项目中创建 Issue

## ✅ 配置验证清单

在首次发布前，请确认：

- [ ] NPM_TOKEN 已添加到 GitHub Secrets
- [ ] NPM 账户可以发布到 `cached-icon-vue` 包名
- [ ] 包名在 NPM 上可用或你是现有包的 maintainer
- [ ] GitHub Actions 有必要的权限
- [ ] 已测试过 dry-run 发布流程
- [ ] CHANGELOG.md 已正确配置
- [ ] package.json 中的版本号正确

完成以上配置后，你的自动发布流程就可以正常工作了！
