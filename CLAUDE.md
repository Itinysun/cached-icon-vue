# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目介绍

cached-icon-vue 是一个高性能的 Vue 3 图标组件库，支持自动下载 Iconify 图标、SVG 缓存和智能状态管理。

## 开发环境要求

- Node.js: >= 20.0.0
- pnpm: >= 9.0.0
- Vue: >= 3.2.0
- Vite: >= 4.0.0

## 常用命令

### 构建相关

```bash
# 构建项目
pnpm build

# 监听构建（开发时）
pnpm dev

# 清理构建产物
pnpm clean
```

### 代码质量

```bash
# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 仅检查代码风格（不修复）
pnpm lint:check
pnpm format:check
```

### 测试

```bash
# 运行测试
pnpm test

# 单次测试（用于 CI）
pnpm test:run

# 带界面的测试
pnpm test:ui

# 生成测试覆盖率报告
pnpm test:coverage
```

### 发布相关

```bash
# 发布前检查
pnpm pre-release

# 发布
pnpm release

# 验证发布
pnpm verify-release
```

## 项目架构

### 核心目录结构

```
src/
├── components/           # Vue 组件
│   ├── CachedIcon.vue   # 主图标组件
│   ├── LoadingIcon.vue  # 加载状态图标
│   ├── ErrorIcon.vue    # 错误状态图标
│   └── DefaultIcon.vue  # 默认图标
├── utils/               # 工具函数
│   ├── iconCache.ts     # 图标缓存管理
│   ├── iconDownloader.ts # 图标下载器
│   ├── iconPath.ts      # 图标路径转换工具
│   └── env.ts          # 环境检测
├── vite-plugin/         # Vite 插件
│   └── index.ts        # 插件入口
└── types/              # TypeScript 类型定义
```

### 关键架构概念

1. **双层缓存机制**：
   - 全局 SVG 内容缓存（`window.__iconSvgCache`）
   - 持久化状态缓存（`IconCacheManager`）

2. **环境检测系统**：
   - 支持用户自定义环境检测函数
   - 开发环境自动下载功能
   - 生产环境无副作用

3. **Vite 插件集成**：
   - 提供构建时配置注入
   - 支持图标预处理

4. **统一路径转换系统**：
   - 智能解析图标名称（支持 `:` 和 `-` 分隔符）
   - 统一的文件路径生成规则
   - 支持扁平结构和按库分文件夹两种组织方式

5. **组件状态管理**：
   - 支持加载、错误、默认状态
   - 智能重试机制

### 入口文件

- `src/index.ts` - 主入口，导出组件和工具
- `src/vite-plugin/index.ts` - Vite 插件入口

### 构建配置

- 输出 ES 模块和 CommonJS 格式
- 支持 Vue 3 和 Vite 的 peer dependencies
- 生成 TypeScript 声明文件

## 测试架构

- 使用 Vitest 作为测试框架
- 测试环境：jsdom
- 测试覆盖率：V8 provider
- 测试文件位置：`tests/` 和 `__tests__/`

## 关键依赖

### 运行时依赖

- Vue 3.2+ (peer dependency)
- Vite 4.0+ (peer dependency, 可选)

### 开发依赖

- TypeScript 5.7+
- Vue Test Utils
- Vitest
- ESLint + Vue ESLint plugin

## 常见开发任务

### 添加新组件

1. 在 `src/components/` 创建组件文件
2. 在 `src/components/index.ts` 导出组件
3. 在 `src/index.ts` 主入口导出
4. 添加相应的 TypeScript 类型定义

### 修改缓存逻辑

- 核心逻辑在 `src/utils/iconCache.ts`
- 下载逻辑在 `src/utils/iconDownloader.ts`
- 环境检测在 `src/utils/env.ts`

### 修改图标路径转换

- 路径转换工具在 `src/utils/iconPath.ts`
- 主要函数：`generateIconPath()`, `parseIconName()`
- 支持扁平结构和按库分文件夹两种模式
- 测试文件：`tests/unit/iconPath.test.ts`

### 修改 Vite 插件

- 插件代码在 `src/vite-plugin/index.ts`
- 配置桥接在 `src/vite-plugin/config-bridge.ts`

### 项目文档

主要说明文档在 `README.md`
模块说明文档在 `./docs`
