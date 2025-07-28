## 开发

### 本地开发

```bash
# 克隆仓库
git clone <repository-url>
cd cached-icon-vue

# 安装依赖
pnpm install

# 开发模式（监听文件变化）
pnpm run dev

# 运行测试
pnpm run test

# 类型检查
pnpm run typecheck

# 代码检查
pnpm run lint

# 构建
pnpm run build
```

### 发布流程

本项目使用 [release-it](https://github.com/release-it/release-it) 进行自动化发布管理。

#### 手动发布

```bash
# 发布前检查
pnpm run pre-release

# 交互式发布（推荐）
pnpm run release

# 预览发布（不执行实际操作）
pnpm run release:dry
```

#### 自动发布

- 推送到 `main`/`master` 分支会触发自动发布
- 支持手动触发 GitHub Actions 工作流选择发布类型
- 自动生成 CHANGELOG 和 GitHub Release

#### 版本管理

项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- **patch**: 修复 bug (`1.0.0` → `1.0.1`)
- **minor**: 新增功能，向后兼容 (`1.0.0` → `1.1.0`)
- **major**: 破坏性变更 (`1.0.0` → `2.0.0`)
- **prerelease**: 预发布版本 (`1.0.0` → `1.0.1-beta.0`)

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 提交规范

项目使用 [Conventional Commits](https://conventionalcommits.org/) 规范：

```bash
feat: 新增功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具变动
```