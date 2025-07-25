# 🚀 完整发布流程总结

恭喜！你的 GitHub Workflows 和项目发布系统已经配置完成。以下是完整的操作指南。

## 📋 快速开始

### 首次发布前的准备

1. **配置 NPM Token**（重要！）
   - 访问 [npmjs.com](https://www.npmjs.com/) 创建 Automation token
   - 在 GitHub 仓库的 Settings → Secrets → Actions 中添加 `NPM_TOKEN`

2. **验证配置**

   ```bash
   # 检查所有配置
   pnpm run pre-release

   # 预览发布（不实际执行）
   pnpm run release:dry
   ```

### 日常发布流程

#### 🚀 自动发布（推荐）

```bash
# 推送到 main 分支自动触发 patch 版本发布
git push origin main
```

#### 🎯 手动指定版本

1. 访问 [GitHub Actions](https://github.com/Itinysun/cached-icon-vue/actions)
2. 选择 "Release" workflow
3. 点击 "Run workflow"
4. 选择版本类型并运行

#### 💻 本地发布

```bash
# 交互式发布
pnpm run release

# 指定版本类型
pnpm run release:ci -- patch|minor|major|prerelease
```

### 发布后验证

```bash
# 验证发布是否成功
pnpm run verify-release 1.0.1
```

## 🛠️ 工作流详解

### 1. CI 工作流 (`ci.yml`)

- **触发**: 推送或 PR 到 main/master/dev
- **功能**: 多版本测试、类型检查、代码检查、构建验证
- **矩阵测试**: Node.js 18, 20, 22

### 2. 发布工作流 (`release.yml`)

- **触发**: 推送到 main/master 或手动触发
- **功能**: 完整发布流程
- **输出**: NPM 包 + GitHub Release

### 3. PR 验证工作流 (`pr-validation.yml`)

- **触发**: 创建或更新 PR
- **功能**: 深度验证、安全扫描、包安装测试
- **特性**:
  - 包大小分析
  - 安装测试
  - 安全审计

## 📁 重要文件说明

### 配置文件

- `.release-it.json` - release-it 配置
- `package.json` - 项目元数据和脚本
- `.github/workflows/` - GitHub Actions 工作流

### 脚本文件

- `scripts/pre-release-check.sh` - 发布前检查
- `scripts/verify-release.sh` - 发布后验证

### 文档文件

- `docs/RELEASE_GUIDE.md` - 详细发布指南
- `docs/SECRETS_SETUP.md` - GitHub Secrets 配置
- `CHANGELOG.md` - 变更日志（自动维护）

## 🔧 版本管理策略

### 语义化版本

- **MAJOR** (1.0.0 → 2.0.0): 破坏性变更
- **MINOR** (1.0.0 → 1.1.0): 新功能，向后兼容
- **PATCH** (1.0.0 → 1.0.1): 错误修复
- **PRERELEASE** (1.0.0 → 1.0.1-0): 预发布

### 分支策略

- `main/master`: 稳定版本，自动发布
- `dev`: 开发分支，CI 验证
- 功能分支: PR 到 main，完整验证

## 🚨 故障排除

### 常见问题

1. **NPM Token 错误**
   - 检查 GitHub Secrets 中的 `NPM_TOKEN`
   - 确认 token 有效且权限正确

2. **构建失败**
   - 运行 `pnpm run clean && pnpm run build`
   - 检查 TypeScript 错误

3. **测试失败**
   - 运行 `pnpm run test:run` 查看详细错误
   - 修复后重新提交

4. **权限问题**
   - 确认是 NPM 包的 maintainer
   - 检查 GitHub 仓库权限

### 回滚策略

如果发布有问题：

1. **NPM**: `npm unpublish cached-icon-vue@version` (24小时内)
2. **GitHub**: 删除 Release 和 Git 标签
3. **快速修复**: 发布新的 patch 版本

## 📊 监控和维护

### 定期任务

- [ ] 每月检查依赖更新
- [ ] 每季度更新 NPM Token
- [ ] 监控下载量和使用情况
- [ ] 检查安全漏洞

### 性能监控

- GitHub Actions 运行时间
- NPM 包大小变化
- 测试覆盖率趋势

## 🎯 最佳实践

### 发布前

1. 确保所有 CI 检查通过
2. 更新文档和示例
3. 测试在真实项目中的使用
4. 检查破坏性变更

### 发布时

1. 使用语义化版本号
2. 编写清晰的 commit 信息
3. 让 CHANGELOG 自动生成
4. 验证发布结果

### 发布后

1. 运行验证脚本
2. 测试安装和导入
3. 通知用户和社区
4. 监控错误报告

## 🚀 下一步

你的发布系统现在已经完整配置好了！建议：

1. **首次发布测试**

   ```bash
   # 先运行 dry-run 测试
   pnpm run release:dry

   # 然后进行真实发布
   pnpm run release
   ```

2. **配置 NPM Token**
   - 按照 `docs/SECRETS_SETUP.md` 配置

3. **团队培训**
   - 分享发布流程给团队成员
   - 建立发布检查清单

4. **监控设置**
   - 设置 GitHub 通知
   - 监控 NPM 下载统计

## 📞 支持

如有问题，请：

1. 查看相关文档
2. 检查 GitHub Actions 日志
3. 在仓库中创建 Issue
4. 参考 release-it 和 GitHub Actions 官方文档

祝你发布愉快！🎉
