# 测试文档

## 概述

cached-icon-vue 包已经包含了全面的测试套件，涵盖以下方面：

## 测试类型

### 单元测试

1. **IconCacheManager 测试** (`tests/unit/iconCache.test.ts`)
   - 基础的缓存功能（设置、获取、更新）
   - 图标状态管理（下载中、已下载、失败等）
   - SVG 内容管理
   - 缓存清理功能
   - 统计信息
   - 本地存储持久化
   - 缓存过期机制

2. **CachedIcon 组件测试** (`tests/unit/CachedIcon.test.ts`)
   - 基础渲染功能
   - 属性处理（name、icon、size 等）
   - 状态显示（加载、错误状态）
   - SVG 缓存功能
   - 配置更新
   - 响应式属性
   - 错误处理

3. **Vite 插件测试** (`tests/unit/vitePlugin.test.ts`)
   - 插件创建和配置
   - 服务器中间件配置
   - 选项合并
   - 图标源配置
   - 错误处理
   - TypeScript 类型兼容性

### 集成测试

4. **包集成测试** (`tests/integration/package.test.ts`)
   - 包的主要导出功能
   - 组件类型检查
   - 类实例化测试
   - Vite 插件功能
   - 全局实例测试
   - 安装函数测试
   - API 一致性验证

## 测试覆盖率

当前测试覆盖率：

```
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   50.54 |    76.85 |   69.76 |   50.54 |
 CachedIcon.vue    |   63.79 |    71.42 |     100 |   63.79 |
 iconCache.ts      |    84.3 |     85.1 |      90 |    84.3 |
 DefaultIcon.vue   |     100 |      100 |     100 |     100 |
 ErrorIcon.vue     |     100 |      100 |     100 |     100 |
 LoadingIcon.vue   |     100 |      100 |     100 |     100 |
```

## 运行测试

### 基本测试

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test --coverage

# 运行单次测试（不监听文件变化）
pnpm test --run

# 运行特定测试文件
pnpm test iconCache.test.ts
```

### 测试命令

- `pnpm test` - 运行所有测试（监听模式）
- `pnpm test --run` - 运行所有测试（单次）
- `pnpm test --coverage` - 运行测试并生成覆盖率报告
- `pnpm test --ui` - 启动测试界面（需要安装 @vitest/ui）

## 测试配置

测试配置在 `vite.config.ts` 中：

```typescript
test: {
  environment: 'jsdom',
  globals: true,
  include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'lib/',
      'dist/',
      'tests/',
      // ...其他排除项
    ],
  },
}
```

## 模拟(Mock)

测试中使用了以下模拟：

1. **localStorage** - 模拟浏览器本地存储
2. **fetch API** - 模拟网络请求
3. **Node.js 模块** - 模拟 fs、path 等模块用于 Vite 插件测试
4. **全局缓存** - 模拟 `window.__iconSvgCache`

## 最佳实践

1. **独立性** - 每个测试都是独立的，使用 `beforeEach` 清理状态
2. **模拟外部依赖** - 所有外部依赖都被适当模拟
3. **边界情况** - 测试包含错误处理和边界情况
4. **异步测试** - 正确处理异步操作和 Promise
5. **类型安全** - 测试代码完全类型化

## 持续集成

可以在 CI/CD 管道中运行以下命令：

```bash
# 安装依赖
pnpm install

# 运行类型检查
pnpm typecheck

# 运行测试
pnpm test --run

# 运行测试并生成覆盖率报告
pnpm test --coverage --run

# 运行代码格式检查
pnpm format:check
```
