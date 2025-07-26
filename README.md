# cached-icon-vue

一个高性能的 Vue 3 图标组件，无需安装 Iconify 包,可直接使用任意ICON, 支持 SVG 缓存、自动下载和智能状态管理。

[![npm version](https://img.shields.io/npm/v/cached-icon-vue.svg)](https://www.npmjs.com/package/cached-icon-vue)
[![npm downloads](https://img.shields.io/npm/dm/cached-icon-vue.svg)](https://www.npmjs.com/package/cached-icon-vue)
[![license](https://img.shields.io/npm/l/cached-icon-vue.svg)](https://github.com/Itinysun/cached-icon-vue/blob/main/LICENSE)

## 特性

- 🚀 **高性能缓存** - 全局 SVG 内容缓存，避免重复请求
- 📦 **智能下载** - Iconify图标无需安装,开发环境自动下载缺失图标
- 🔄 **状态管理** - 完善的加载、错误、成功状态管理
- 🔁 **智能重试** - 失败图标自动重试，确保下载成功
- 💪 **TypeScript** - 完整的 TypeScript 类型支持
- 🎨 **主题继承** - 自动继承父元素的颜色样式
- 🛠️ **灵活配置** - 支持自定义配置和扩展

## 快速开始

### 1. 安装

```bash
npm install cached-icon-vue
# 或者
pnpm add cached-icon-vue
# 或者
yarn add cached-icon-vue
```

### 2. 配置 Vite 插件

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginCachedIcon } from 'cached-icon-vue/vite-plugin'

export default defineConfig({
  plugins: [vue(), vitePluginCachedIcon()],
})
```

### 3. 引入组件

```typescript
// main.ts
import { createApp } from 'vue'
import CachedIconVue from 'cached-icon-vue'
import App from './App.vue'

const app = createApp(App)

// 全局配置
app.use(CachedIconVue, {
  // 自定义开发环境检测
  isDevelopment: () => import.meta.env.DEV,
})

app.mount('#app')
```

> **重要说明**：
> isDevelopment 用来配置是否为开发环境.需要根据你的项目情况进行配置.只有在开发环境下,才会自动下载.下载后的文件在生产环境是直接使用的,避免性能浪费.

### 4. 使用组件

```vue
<script setup lang="ts">
import { CachedIcon } from 'cached-icon-vue'
</script>

<template>
  <CachedIcon name="mdi:home" size="24px" />
  <CachedIcon name="mdi:star" size="32px" />
  <CachedIcon name="heroicons:heart-20-solid" size="20px" />
</template>
```

就这么简单！组件会自动在开发环境下载图标，并智能缓存以提高性能。生产环境则直接使用图标没有检测过程,没有副作用,不损失任何性能.

## 项目结构建议

```
src/
├── components/
│   └── icons/
│       ├── AppIcon.vue          // 封装 CachedIcon
│       └── icon-presets.ts      // 图标预设
├── assets/
│   └── icons/                   // 本地图标文件
└── main.ts

public/
└── icons/                       // 自动下载的图标
    ├── mdi-home.svg
    ├── mdi-star.svg
    └── ...
```

## 详细使用方法

### 1. 配置 Vite 插件

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginCachedIcon } from 'cached-icon-vue'

export default defineConfig({
  plugins: [
    vue(),
    // 配置图标下载插件
    vitePluginCachedIcon({
      iconDir: 'public/icons', // 图标保存目录,必须在public目录下
      iconSource: 'iconify', // 图标来源：iconify 或 custom
      customUrlTemplate: '', // 自定义URL模板（可选）
    }),
  ],
})
```

### 2. 注册组件

```typescript
// main.ts
import { createApp } from 'vue'
import CachedIconVue from 'cached-icon-vue'
import App from './App.vue'

const app = createApp(App)

app.use(CachedIconVue, {
  isDevelopment: () => process.env.NODE_ENV === 'development',
})

app.mount('#app')
```

### 3. 按需导入

```vue
<script setup lang="ts">
import { CachedIcon } from 'cached-icon-vue'
</script>

<template>
  <CachedIcon name="mdi:home" size="24px" />
</template>
```

### 基础用法

```vue
<template>
  <!-- 基础使用 -->
  <CachedIcon name="mdi:home" />

  <!-- 自定义尺寸 -->
  <CachedIcon name="mdi:star" size="32px" />
  <CachedIcon name="mdi:heart" :size="24" />

  <!-- 自定义样式 -->
  <CachedIcon name="mdi:settings" class="text-blue-500 hover:text-blue-600" size="20px" />

  <!-- 禁用自动下载 -->
  <CachedIcon name="mdi:user" :auto-download="false" />

  <!-- 隐藏状态指示器 -->
  <CachedIcon name="mdi:search" :show-loading-state="false" :show-error-state="false" />
</template>
```

## Props

| 属性               | 类型               | 默认值               | 描述                                   |
| ------------------ | ------------------ | -------------------- | -------------------------------------- |
| `name`             | `string`           | `'mdi:alert-circle'` | 图标名称                               |
| `icon`             | `string`           | `''`                 | 图标名称（同 name，优先级更高）        |
| `size`             | `string \| number` | `'1em'`              | 图标尺寸                               |
| `class`            | `string`           | `''`                 | 自定义 CSS 类名                        |
| `autoDownload`     | `boolean`          | `true`               | 是否自动下载不存在的图标（仅开发环境） |
| `showLoadingState` | `boolean`          | `true`               | 是否显示加载状态                       |
| `showErrorState`   | `boolean`          | `true`               | 是否显示错误状态                       |

## 组件方法

通过 `ref` 可以调用组件的方法：

```vue
<script setup>
import { ref } from 'vue'
import { CachedIcon } from 'cached-icon-vue'

const iconRef = ref()

// 重试加载失败的图标
const retryIcon = () => {
  iconRef.value.retryIcon()
}

// 获取图标状态
const getStatus = () => {
  const status = iconRef.value.getIconStatus()
  console.log('图标状态:', status)
}
</script>

<template>
  <CachedIcon ref="iconRef" name="mdi:home" />
  <button @click="retryIcon">重试</button>
  <button @click="getStatus">查看状态</button>
</template>
```

### 组件方法说明

| 方法名          | 参数     | 返回值           | 描述                   |
| --------------- | -------- | ---------------- | ---------------------- |
| `retryIcon`     | 无       | `Promise<void>`  | 重试加载失败的图标     |
| `getIconStatus` | 无       | `IconCacheEntry` | 获取当前图标的缓存状态 |
| `updateConfig`  | `config` | `void`           | 更新组件配置           |

## 高级用法

### Vite 插件配置

```typescript
// vite.config.ts
import { vitePluginCachedIcon } from 'cached-icon-vue/vite-plugin'

export default defineConfig({
  plugins: [
    // 基础配置
    vitePluginCachedIcon({
      iconDir: 'public/icons', // 图标保存目录
      iconSource: 'iconify', // 图标来源
      apiEndpoint: '/api/download-icon', // API 端点（可选）
    }),

    // 自定义图标源配置
    vitePluginCachedIcon({
      iconDir: 'public/custom-icons',
      iconSource: 'custom',
      customUrlTemplate: 'https://your-icon-cdn.com/{name}.svg',
      apiEndpoint: '/api/icons', // 自定义 API 端点
    }),

    // 不同项目结构的配置
    vitePluginCachedIcon({
      iconDir: 'public/assets/icons', // 深层目录
      iconSource: 'iconify',
      apiEndpoint: '/custom/icon-api', // 自定义端点
    }),
  ],
})
```

#### 配置选项说明

| 选项                | 类型                    | 默认值                 | 说明                                   |
| ------------------- | ----------------------- | ---------------------- | -------------------------------------- |
| `iconDir`           | `string`                | `'public/icons'`       | 图标保存目录，**必须在 public 目录下** |
| `iconSource`        | `'iconify' \| 'custom'` | `'iconify'`            | 图标下载源                             |
| `customUrlTemplate` | `string`                | `''`                   | 自定义图标 URL 模板                    |
| `apiEndpoint`       | `string`                | `'/api/download-icon'` | 图标下载 API 端点                      |

#### 自动配置同步

插件会自动将配置传递给前端组件：

```typescript
// 插件配置
vitePluginCachedIcon({
  iconDir: 'public/my-icons',
  apiEndpoint: '/custom/icons',
})

// 前端组件会自动使用：
// - iconPathPrefix: '/my-icons'
// - downloadApiEndpoint: '/custom/icons'
```

插件会在开发环境下提供 `/api/download-icon` API 端点，支持：

- GET 请求：`/api/download-icon?name=mdi:home`
- POST 请求：`{ "name": "mdi:home" }`
- 自动保存图标到指定目录
- 返回 SVG 内容供组件使用

### 自定义配置

```typescript
import { iconCache, IconCacheManager } from 'cached-icon-vue'

// 使用全局缓存管理器
const stats = iconCache.getStats()
console.log('缓存统计:', stats)

// 清除特定图标缓存
iconCache.clear('mdi:home')

// 重试失败的图标
iconCache.resetFailedIcon('mdi:home')

// 检查是否可以重试
const canRetry = iconCache.canRetryFailedDownload('mdi:home')

// 创建自定义缓存管理器
const customCache = new IconCacheManager({
  isDevelopment: () => true,
  cacheExpireTime: 12 * 60 * 60 * 1000, // 12小时
  iconPathPrefix: '/custom-icons',
})
```

### 开发工具

在开发环境下，组件会自动暴露调试工具到 `window` 对象：

```javascript
// 控制台中可用的调试工具
window.iconCache // 缓存管理器实例

// 缓存统计
iconCache.getStats()

// 清除缓存
iconCache.clear() // 清除全部
iconCache.clear('mdi:home') // 清除特定图标

// 重试失败的图标
iconCache.resetFailedIcon('mdi:home')

// 检查重试状态
iconCache.canRetryFailedDownload('mdi:home', 30000) // 30秒重试间隔
```

## 支持的图标格式

组件支持多种图标命名格式：

- **Material Design Icons**: `mdi:home`, `mdi:star`, `mdi:heart`
- **Iconify Collections**: `ic:round-home`, `heroicons:home-20-solid`
- **自定义图标**: 任何符合文件命名规范的图标名称

## 缓存机制

### 双层缓存设计

1. **全局内存缓存** - 所有组件实例共享的 SVG 内容缓存
2. **本地存储缓存** - 持久化缓存状态，避免刷新后重复请求

### 缓存策略

- ✅ 成功加载的图标会被永久缓存（直到手动清除）
- ⏰ 失败的请求有智能重试机制，30秒后可重试
- 🔄 失败状态不会被错误缓存，确保后续可以重试
- 🗑️ 缓存会自动清理过期条目（默认24小时）
- 💾 支持本地存储持久化

### 重试机制

- **智能重试** - 下载失败的图标会在30秒后自动重试
- **状态管理** - 失败状态不会被永久缓存，避免阻塞后续重试
- **手动重试** - 支持通过组件方法手动触发重试
- **错误区分** - 区分网络错误、下载失败、解析错误等不同类型

## 状态管理

组件提供完整的状态反馈：

- **加载状态** - 显示动画和状态指示器
- **成功状态** - 正常显示图标
- **错误状态** - 显示错误图标和提示信息
- **默认状态** - 显示默认占位图标

## 开发环境特性

### 自动下载

在开发环境下，组件会自动下载缺失的图标：

```vue
<!-- 如果 custom-icon 不存在，组件会尝试自动下载 -->
<CachedIcon name="custom:icon" />
```

### 调试信息

开发环境下提供详细的调试信息：

- 鼠标悬停显示图标名称和状态
- 可视化的状态指示器（加载/错误）
- 控制台日志和错误信息

## API 参考

### 类型定义

```typescript
interface CachedIconProps {
  name?: string
  icon?: string
  size?: string | number
  class?: string
  autoDownload?: boolean
  showLoadingState?: boolean
  showErrorState?: boolean
}

interface CachedIconConfig {
  isDevelopment?: () => boolean
  cacheExpireTime?: number
  storageKey?: string
  downloadApiEndpoint?: string
  iconPathPrefix?: string
}

interface IconDownloaderOptions {
  iconDir?: string // SVG图标保存目录
  iconSource?: 'iconify' | 'custom' // 图标下载源
  customUrlTemplate?: string // 自定义下载URL模板
  apiEndpoint?: string // API端点路径
}

interface IconCacheEntry {
  name: string
  status: 'unknown' | 'exists' | 'downloading' | 'downloaded' | 'failed'
  svgContent?: string
  error?: string
  lastChecked: number
  downloadPromise?: Promise<IconDownloadResult>
}

interface IconDownloadResult {
  success: boolean
  message: string
  path?: string
  exists: boolean
  downloaded?: boolean
  error?: string
  details?: string
  svgContent?: string
}
```

### 缓存管理器 API

```typescript
import { iconCache, IconCacheManager } from 'cached-icon-vue'

// 全局缓存管理器实例
iconCache.get(iconName: string): IconCacheEntry | undefined
iconCache.set(iconName: string, entry: Partial<IconCacheEntry>): IconCacheEntry
iconCache.clear(iconName?: string): void
iconCache.getStats(): IconCacheStats
iconCache.markAsExists(iconName: string, svgContent?: string): IconCacheEntry
iconCache.markAsDownloading(iconName: string, promise: Promise<IconDownloadResult>): IconCacheEntry
iconCache.markAsDownloaded(iconName: string, svgContent?: string): IconCacheEntry
iconCache.markAsFailed(iconName: string, error: string): IconCacheEntry
iconCache.resetFailedIcon(iconName: string): void
iconCache.canRetryFailedDownload(iconName: string, retryDelayMs?: number): boolean
iconCache.isKnownToExist(iconName: string): boolean
iconCache.isDownloading(iconName: string): boolean
iconCache.hasFailed(iconName: string): boolean
```

### Vite 插件 API

```typescript
import { vitePluginCachedIcon } from 'cached-icon-vue'

// 插件函数签名
function vitePluginCachedIcon(options?: IconDownloaderOptions): Plugin

// 使用示例
vitePluginCachedIcon({
  iconDir: 'public/icons', // 默认: 'public/icons'
  iconSource: 'iconify', // 默认: 'iconify'
  customUrlTemplate: '{name}.svg', // 仅当 iconSource 为 'custom' 时使用
  apiEndpoint: '/api/download-icon', // 默认: '/api/download-icon'
})
```

## 版本要求

- **Node.js**: >= 20.0.0
- **pnpm**: >= 9.0.0
- **Vue**: >= 3.5.0
- **Vite**: >= 4.0.0（支持 4.x、5.x、6.x、7.x）

## 常见问题

### 1. 图标无法自动下载

**问题**：组件显示默认图标，没有自动下载。

**解决方案**：

1. 确保已正确配置 Vite 插件
2. 检查是否在开发环境（`npm run dev`）
3. 确认图标名称格式正确（如 `mdi:home`）
4. 查看浏览器控制台是否有错误信息
5. 检查是否在重试冷却期内（默认30秒）

**手动重试方法**：

```javascript
// 方法1：通过组件实例
const iconRef = ref()
iconRef.value.retryIcon()

// 方法2：通过缓存管理器
import { iconCache } from 'cached-icon-vue'
iconCache.resetFailedIcon('mdi:home')
```

### 2. 导入路径错误

**问题**：`模块 "cached-icon-vue" 没有导出的成员 "vitePluginCachedIcon"`

**解决方案**：

```typescript
// ❌ 错误的导入方式
import { vitePluginCachedIcon } from 'cached-icon-vue'

// ✅ 正确的导入方式
import { vitePluginCachedIcon } from 'cached-icon-vue/vite-plugin'
```

### 3. 图标样式问题

**问题**：图标颜色不正确或无法自定义。

**解决方案**：

```vue
<template>
  <!-- 使用 CSS 自定义颜色 -->
  <CachedIcon name="mdi:home" class="text-blue-500" />

  <!-- 或者使用内联样式 -->
  <CachedIcon name="mdi:home" style="color: #3b82f6;" />
</template>
```

### 4. 构建时错误

**问题**：生产构建时出现模块解析错误。

**解决方案**：

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    // 确保插件配置正确
    vitePluginCachedIcon({
      iconDir: 'public/icons',
      iconSource: 'iconify',
    }),
  ],
  // 可能需要优化依赖
  optimizeDeps: {
    include: ['cached-icon-vue'],
  },
})
```

### 5. 缓存清理和重试

**问题**：图标缓存导致显示异常或下载失败。

**解决方案**：

```typescript
import { iconCache } from 'cached-icon-vue'

// 清除所有缓存
iconCache.clear()

// 清除特定图标缓存
iconCache.clear('mdi:home')

// 重试失败的图标
iconCache.resetFailedIcon('mdi:home')

// 检查是否可以重试
if (iconCache.canRetryFailedDownload('mdi:home')) {
  iconCache.resetFailedIcon('mdi:home')
}

// 或者清除浏览器存储
localStorage.removeItem('cached-icon-cache-v1')
```

### 6. 图标下载频繁失败

**问题**：图标下载反复失败，无法正常显示。

**原因分析**：

- 网络连接问题
- 图标名称不存在
- API 端点配置错误
- 服务器限流

**解决方案**：

```typescript
// 检查图标状态
const iconStatus = iconCache.get('mdi:home')
console.log('图标状态:', iconStatus)

// 手动重试失败的图标
if (iconStatus?.status === 'failed') {
  iconCache.resetFailedIcon('mdi:home')
}

// 配置更长的重试间隔
const canRetry = iconCache.canRetryFailedDownload('mdi:home', 60000) // 60秒
```

### 6. TypeScript 类型问题

**问题**：TypeScript 报告类型错误。

**解决方案**：

```typescript
// 确保正确导入类型
import type { CachedIconProps } from 'cached-icon-vue'

// 或者在 tsconfig.json 中添加
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

## 常见问题解答 (FAQ)

### 1. 为什么 iconDir 必须在 public 目录下？

**原因**：

- 图标文件需要作为**静态资源**被浏览器直接访问
- Vite 只会将 `public` 目录下的文件作为静态资源提供服务
- 如果图标放在 `src` 或其他目录，会导致运行时 404 错误

**正确的配置示例**：

```typescript
// ✅ 正确：iconDir 在 public 目录下
vitePluginCachedIcon({
  iconDir: 'public/icons', // 图标保存在 public/icons/
  // 运行时访问路径: /icons/mdi-home.svg
})

vitePluginCachedIcon({
  iconDir: 'public/assets/icons', // 图标保存在 public/assets/icons/
  // 运行时访问路径: /assets/icons/mdi-home.svg
})
```

**错误的配置示例**：

```typescript
// ❌ 错误：iconDir 不在 public 目录下
vitePluginCachedIcon({
  iconDir: 'src/assets/icons', // 浏览器无法访问
  // 运行时会出现 404 错误
})

vitePluginCachedIcon({
  iconDir: 'assets/icons', // 相对路径，不在 public 下
  // 运行时会出现 404 错误
})
```

### 2. 配置同步机制如何工作？

**自动同步**：插件会自动将配置传递给前端组件，无需手动配置。

```typescript
// 插件配置
vitePluginCachedIcon({
  iconDir: 'public/my-icons',
  apiEndpoint: '/custom/icons',
})

// 前端组件自动使用相同配置：
// - 图标路径: /my-icons/
// - API 端点: /custom/icons
```

**配置优先级**：

1. 全局配置（app.use 时传入）
2. Vite 插件配置（自动注入）
3. 默认配置

### 3. 图标命名规则

**支持的格式**：

- `mdi:home` → 文件名：`mdi-home.svg`
- `heroicons:home-20-solid` → 文件名：`heroicons-home-20-solid.svg`
- `ic:round-home` → 文件名：`ic-round-home.svg`

**命名转换规则**：

- 冒号 `:` 替换为短横线 `-`
- 确保文件名在不同操作系统下都有效

## 故障排除

### 开发环境调试

1. **检查环境变量**：

   ```javascript
   console.log('DEV:', import.meta.env.DEV)
   console.log('MODE:', import.meta.env.MODE)
   console.log('NODE_ENV:', process.env.NODE_ENV)
   ```

2. **查看缓存状态**：

   ```javascript
   import { iconCache } from 'cached-icon-vue'
   console.log('缓存统计:', iconCache.getStats())
   ```

3. **网络请求检查**：
   - 打开浏览器开发者工具
   - 查看 Network 标签
   - 寻找 `/api/download-icon` 请求

### 生产环境部署

1. **静态资源配置**：

   ```bash
   # 确保图标目录被正确部署
   public/
   ├── icons/
   │   ├── mdi-home.svg
   │   ├── mdi-star.svg
   │   └── ...
   ```

2. **服务器配置**：
   ```nginx
   # Nginx 配置示例
   location /icons/ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

## 性能优化建议

1. **预加载常用图标**：

   ```typescript
   // 在应用启动时预加载
   import { iconDownloader } from 'cached-icon-vue'

   const commonIcons = ['mdi:home', 'mdi:user', 'mdi:settings']
   iconDownloader.downloadIcons(commonIcons)
   ```

2. **按需加载组件**：

   ```typescript
   // 使用动态导入
   const CachedIcon = defineAsyncComponent(() => import('cached-icon-vue').then(m => m.CachedIcon))
   ```

3. **缓存配置优化**：

   ```typescript
   import { IconCacheManager } from 'cached-icon-vue'

   const cache = new IconCacheManager({
     cacheExpireTime: 7 * 24 * 60 * 60 * 1000, // 7天
     storageKey: 'my-app-icons-v1',
   })
   ```

## 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

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
