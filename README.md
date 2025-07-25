# cached-icon-vue

一个高性能的 Vue 3 图标组件，支持 SVG 缓存、自动下载和智能状态管理。

## 特性

- 🚀 **高性能缓存** - 全局 SVG 内容缓存，避免重复请求
- 📦 **智能下载** - 开发环境自动下载缺失图标
- 🔄 **状态管理** - 完善的加载、错误、成功状态管理
- 💪 **TypeScript** - 完整的 TypeScript 类型支持
- 🎨 **主题继承** - 自动继承父元素的颜色样式
- 🛠️ **灵活配置** - 支持自定义配置和扩展
- ⚡ **Vite 插件** - 集成 Vite 插件，开发环境下自动下载图标

## 安装

```bash
npm install cached-icon-vue
# 或者
pnpm add cached-icon-vue
# 或者
yarn add cached-icon-vue
```

## 使用方法

### 1. 配置 Vite 插件（推荐）

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
      iconDir: 'public/icons', // 图标保存目录
      iconSource: 'iconify', // 图标来源：iconify 或 custom
      customUrlTemplate: '', // 自定义URL模板（可选）
    }),
  ],
})
```

### 2. 全局注册组件

```typescript
// main.ts
import { createApp } from 'vue'
import CachedIconVue from 'cached-icon-vue'
import App from './App.vue'

const app = createApp(App)

app.use(CachedIconVue, {
  // 可选配置
  isDevelopment: () => process.env.NODE_ENV === 'development',
  iconPathPrefix: '/icons',
  downloadApiEndpoint: '/api/download-icon',
})

app.mount('#app')
```

### 按需导入

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

## 高级用法

### Vite 插件配置

```typescript
// vite.config.ts
import { vitePluginCachedIcon } from 'cached-icon-vue'

export default defineConfig({
  plugins: [
    // 基础配置
    vitePluginCachedIcon({
      iconDir: 'public/icons',
      iconSource: 'iconify',
    }),

    // 或者使用自定义图标源
    vitePluginCachedIcon({
      iconDir: 'public/custom-icons',
      iconSource: 'custom',
      customUrlTemplate: 'https://your-icon-cdn.com/{name}.svg',
    }),
  ],
})
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
- ⏰ 失败的请求有重试机制，30秒后可重试
- 🗑️ 缓存会自动清理过期条目（默认24小时）
- 💾 支持本地存储持久化

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
}
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
})
```

## 版本要求

- **Node.js**: >= 20.0.0
- **pnpm**: >= 9.0.0
- **Vue**: >= 3.5.0
- **Vite**: >= 6.0.0（使用插件时）

## 注意事项

1. **开发环境依赖** - 自动下载功能仅在开发环境可用
2. **API 端点** - 需要后端提供图标下载 API（可选）
3. **文件路径** - 图标文件需放置在正确的静态资源目录
4. **浏览器兼容性** - 需要支持 ES2022+ 和现代浏览器特性

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
