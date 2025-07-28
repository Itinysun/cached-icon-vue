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
