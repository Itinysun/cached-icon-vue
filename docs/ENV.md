# 开发环境识别统一方案

## 概述

为了解决项目中开发环境识别逻辑重复和不统一的问题，我们设计了一套统一的环境检测方案。该方案支持用户自定义环境检测逻辑，并提供了清晰的优先级机制。

## 核心功能

### 1. 统一的环境检测工具

位于 `src/utils/env.ts` 的工具函数提供了以下功能：

- **defaultIsDevelopment()**: 默认的开发环境检测函数
- **createEnvironmentDetector()**: 创建环境检测器的工厂函数
- **createPriorityEnvironmentDetector()**: 创建带优先级的环境检测器

### 2. 环境检测优先级

默认环境检测按以下优先级进行：

1. `import.meta.env.DEV`（Vite 环境变量）
2. `import.meta.env.MODE === 'development'`（模式检查）
3. `process.env.NODE_ENV === 'development'`（Node.js 环境变量）
4. 默认返回 `false`（生产环境）

### 3. 用户自定义支持

用户可以通过多种方式自定义环境检测逻辑：

#### 方式1: 在 Vite 插件中自定义

```typescript
import { vitePluginCachedIcon } from 'cached-icon-vue/vite-plugin'

export default {
  plugins: [
    vitePluginCachedIcon({
      isDevelopment: () => process.env.CUSTOM_ENV === 'dev',
    }),
  ],
}
```

**注意**：Vite 插件支持两种环境检测模式：

- **默认模式**：只在 `vite dev` （serve 模式）下启用
- **自定义模式**：当提供 `isDevelopment` 函数时，会结合 Vite 模式和自定义检测结果

#### 方式2: 在插件安装时自定义

```typescript
import { createApp } from 'vue'
import CachedIconVue from 'cached-icon-vue'

const app = createApp(App)

// 使用自定义环境检测函数
app.use(CachedIconVue, {
  isDevelopment: () => window.location.hostname === 'localhost',
})
```

#### 方式3: 在全局配置中自定义

```typescript
app.config.globalProperties.$cachedIcon = {
  isDevelopment: () => window.location.hostname === 'localhost',
}
```

#### 方式4: 在组件中自定义

```vue
<template>
  <CachedIcon name="home" :config="{ isDevelopment: () => myCustomCheck() }" />
</template>
```

## 配置优先级

环境检测配置按以下优先级生效：

### 插件级别环境检测

插件安装时的环境检测优先级：

1. **插件安装选项**：通过 `app.use(CachedIconVue, { isDevelopment: ... })` 设置
2. **默认检测**：使用内置的默认检测逻辑

### 组件级别环境检测

组件中的环境检测配置按以下优先级生效：

1. **组件级配置**：通过 `props.config.isDevelopment` 传入
2. **全局配置**：通过 `app.config.globalProperties.$cachedIcon.isDevelopment` 设置
3. **Vite 插件配置**：通过插件选项设置
4. **默认检测**：使用内置的默认检测逻辑

## 技术实现

### Vite 构建时环境变量优化问题

在实现环境检测时，我们遇到了 Vite 构建优化的重要问题：

**问题描述**：Vite 在构建过程中会进行静态分析，将 `import.meta.env` 相关的代码直接替换为常量值，导致运行时无法正确检测环境。

#### 触发场景

1. **直接访问环境变量**

```javascript
// ❌ 会被构建时优化
if (import.meta.env.DEV) {
  console.log('开发模式')
}
// 构建后变成: if (false) { ... }
```

2. **条件判断中的环境变量**

```javascript
// ❌ 会被优化，整个代码块会被删除
if (import.meta.env.NODE_ENV === 'development') {
  // 这部分代码在生产构建中会被完全删除
}
```

3. **函数返回值中的环境变量**

```javascript
// ❌ 会被优化为固定返回值
export function isDev() {
  return import.meta.env.DEV
}
// 构建后变成: return false
```

#### 解决方案

我们使用动态函数调用来避免静态分析：

### 核心函数

```typescript
// 修复后的默认检测函数
export function defaultIsDevelopment(): boolean {
  try {
    // 使用动态函数调用避免构建时优化
    const importMeta = new Function('return typeof import !== "undefined" ? import.meta : null')()
    if (importMeta && importMeta.env) {
      // 优先使用 import.meta.env.DEV（Vite 环境）
      if (typeof importMeta.env.DEV === 'boolean') {
        return importMeta.env.DEV
      }

      // 其次检查 MODE
      if (importMeta.env.MODE === 'development') {
        return true
      }
    }
  } catch {
    // 如果无法获取 import.meta，继续其他检查
  }

  // 检查 NODE_ENV（Node.js 环境）
  if (typeof globalThis !== 'undefined') {
    const global = globalThis as { process?: { env?: { NODE_ENV?: string } } }
    if (global.process?.env?.NODE_ENV === 'development') {
      return true
    }
  }

  // 检查 window.location（浏览器环境）
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return true
    }
  }

  return false
}

// 环境检测器工厂
export function createEnvironmentDetector(customDetector?: () => boolean): () => boolean {
  return customDetector || defaultIsDevelopment
}

// 优先级检测器
export function createPriorityEnvironmentDetector(
  ...detectors: ((() => boolean) | undefined)[]
): () => boolean {
  return () => {
    for (const detector of detectors) {
      if (detector) {
        return detector()
      }
    }
    return defaultIsDevelopment()
  }
}
```

### 使用示例

```typescript
// 在 config-bridge.ts 中
export function createConfigBridge(options: IconDownloaderOptions) {
  return {
    iconPathPrefix,
    downloadApiEndpoint: options.apiEndpoint || '/api/download-icon',
    isDevelopment: createEnvironmentDetector(options.isDevelopment),
  }
}

// 在 CachedIcon.vue 中
const config: CachedIconConfig = {
  isDevelopment: createPriorityEnvironmentDetector(
    props.config?.isDevelopment,
    globalConfig.isDevelopment,
    vitePluginConfig.isDevelopment
  ),
  // ... 其他配置
}
```

## 迁移指南

### 从旧版本迁移

如果你之前使用的是旧版本的环境检测方式，迁移步骤如下：

1. **无需更改**：现有的 `isDevelopment` 函数配置方式保持不变
2. **新功能**：可以选择使用新的优先级配置方式
3. **向后兼容**：所有现有配置都会正常工作

### 推荐的最佳实践

1. **统一配置**：建议在 Vite 插件中设置全局的环境检测逻辑
2. **特殊情况**：只在特殊需求时使用组件级别的自定义检测
3. **测试环境**：确保在不同环境下测试你的自定义检测逻辑

## 开发模式提醒

### 插件安装时的提醒

当在开发环境中安装插件时，会在控制台显示友好的提醒信息：

```
🚀 CachedIcon 开发模式已启用
• 图标自动下载功能已启用
• 支持用户自定义环境检测
• 使用 window.CachedIcon?.debugEnv() 查看详细环境信息
```

### Vite 插件启动提醒

当 Vite 插件在开发模式启动时，也会显示相关信息：

```
🔧 CachedIcon Vite 插件已启用 (开发模式)
  • 图标下载 API 端点: /api/download-icon
  • 图标保存目录: public/icons
  • 图标来源: iconify
```

### 调试工具

在开发模式下，可以使用以下方法调试环境检测：

#### 1. 使用全局调试函数

```javascript
// 在浏览器控制台中执行
window.CachedIcon?.debugEnv()

// 输出示例：
// 🔍 CachedIcon 环境检测信息
//   当前环境模式: development
//   import.meta.env.DEV: true
//   import.meta.env.MODE: development
//   process.env.NODE_ENV: development
//   最终检测结果: 开发环境
```

#### 2. 使用编程方式调试

```typescript
import { debugEnvironmentDetection } from 'cached-icon-vue'

// 在组件中调用
debugEnvironmentDetection()
```

#### 3. 自定义检测器调试

```typescript
import { createEnvironmentDetector } from 'cached-icon-vue'

const detector = createEnvironmentDetector(() => {
  console.log('Custom environment check')
  return true
})

console.log('Is development:', detector())
```

## 故障排除

### 常见问题

1. **环境检测不准确**：检查你的自定义检测函数是否正确返回布尔值
2. **配置不生效**：确认配置的优先级，高优先级的配置会覆盖低优先级的配置
3. **类型错误**：确保你的自定义检测函数返回类型为 `boolean`
4. **开发模式提醒不显示**：确认环境检测逻辑是否正确识别开发环境
5. **构建后环境检测失效**：这是由于 Vite 构建优化导致的，参考上面的"Vite 构建时环境变量优化问题"章节

### 验证构建优化问题

如果怀疑遇到了 Vite 构建优化问题，可以通过以下方法验证：

#### 1. 检查构建后的文件

```bash
# 构建项目
npm run build

# 查看构建后的环境检测函数
cat lib/env.js
```

**问题表现**：如果看到类似以下代码，说明遇到了优化问题：

```javascript
function defaultIsDevelopment() {
  return false // 硬编码，没有任何检测逻辑
}
```

**正常表现**：应该看到完整的检测逻辑：

```javascript
function defaultIsDevelopment() {
  try {
    const importMeta = new Function('...')()
    // 完整的运行时检测逻辑
  } catch {
    // 错误处理
  }
  // 其他检测方式
}
```

#### 2. 运行时测试

创建测试文件验证环境检测：

```javascript
// test-env.mjs
import { defaultIsDevelopment } from './lib/index.js'

console.log('Node.js 环境测试:')
console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
console.log('defaultIsDevelopment():', defaultIsDevelopment())

// 设置开发环境变量测试
process.env.NODE_ENV = 'development'
console.log('\n设置 NODE_ENV=development 后:')
console.log('defaultIsDevelopment():', defaultIsDevelopment())
```

```bash
# 运行测试
node test-env.mjs
NODE_ENV=development node test-env.mjs
```

### 调试步骤

1. 首先使用 `window.CachedIcon?.debugEnv()` 查看环境检测详情
2. 检查各个环境变量的值是否符合预期
3. 验证自定义检测函数的返回值
4. 确认配置的优先级顺序
5. **检查构建后的代码是否被优化**（重要！）

## 性能考虑

- 环境检测函数会被频繁调用，建议避免在检测函数中进行复杂的计算
- 推荐缓存检测结果，特别是在检测逻辑较为复杂的情况下

## 总结

通过这套统一的环境检测方案，我们：

1. **消除了代码重复**：所有环境检测逻辑都使用统一的工具函数
2. **提供了灵活性**：用户可以根据需要自定义环境检测逻辑
3. **保持了兼容性**：现有的配置方式仍然有效
4. **改善了维护性**：环境检测逻辑集中管理，便于维护和升级

这个方案既解决了代码重复问题，又为用户提供了充分的自定义能力，满足不同项目的需求。
