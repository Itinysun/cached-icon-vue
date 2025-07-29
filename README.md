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
- 📁 **文件组织** - 支持扁平结构或按图标库分文件夹保存
- 🔧 **统一转换** - 智能解析图标名称，统一文件路径转换规则
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
  plugins: [vue(), vitePluginCachedIcon({
    // 可选：按图标库分文件夹保存（默认：false）
    organizeByLibrary: false, // true: /icons/mdi/home.svg, false: /icons/mdi-home.svg
  })],
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
app.use(CachedIconVue)

app.mount('#app')
```

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

就这么简单！组件会自动在 **开发环境** 下载图标，并智能缓存以提高性能。生产环境则直接使用图标没有检测过程,没有副作用,不损失任何性能.

如果按照上面的配置,没有自动下载,也没有控制台报错.请先查看 [常见问题](./docs/FAQ.md)

## 项目结构建议

```
src/
├── components/
│   └── icons/
│       ├── AppIcon.vue          // 封装 CachedIcon
│       └── icon-presets.ts      // 图标预设(可选)
├── assets/
│   └── icons/                   // 本地图标文件
└── main.ts

public/
└── icons/                       // 自动下载的图标,请确保使用GIT进行追踪,以确保生产环境可以直接使用
    ├── mdi-home.svg            // 默认扁平结构
    ├── mdi-star.svg
    └── mdi/                    // 或者按库分文件夹 (organizeByLibrary: true)
        ├── home.svg
        ├── star.svg
        └── ...
```

## 支持的图标格式

所有[iconiFy](https://icon-sets.iconify.design) 的图标均可直接使用.

组件支持多种图标命名格式：

- **Material Design Icons**: `mdi:home`, `mdi:star`, `mdi:heart`
- **Iconify Collections**: `ic:round-home`, `heroicons:home-20-solid`
- **自定义图标**: 任何符合文件命名规范的图标名称

## 文件组织方式

### 扁平结构（默认）

```bash
organizeByLibrary: false  # 默认设置

# 图标文件保存位置
public/icons/
├── mdi-home.svg
├── mdi-star.svg
├── heroicons-heart-20-solid.svg
└── fa-user.svg
```

### 按库分文件夹

```bash
organizeByLibrary: true  # 启用分文件夹

# 图标文件保存位置  
public/icons/
├── mdi/
│   ├── home.svg
│   └── star.svg
├── heroicons/
│   └── heart-20-solid.svg
└── fa/
    └── user.svg
```

### 配置方法

**Vite 插件配置：**
```typescript
vitePluginCachedIcon({
  organizeByLibrary: true,  // 启用按库分文件夹
  iconDir: 'public/icons'   // 图标保存目录
})
```

**组件配置：**
```typescript
app.use(CachedIconVue, {
  organizeByLibrary: true,  // 启用按库分文件夹
  iconPathPrefix: '/icons'  // 图标路径前缀
})
```

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

## 版本要求

- **Node.js**: >= 20.0.0
- **pnpm**: >= 9.0.0
- **Vue**: >= 3.2.0
- **Vite**: >= 4.0.0（支持 4.x、5.x、6.x、7.x）

## 更多使用方法和示例

[USAGE](./docs/USAGE.MD)

## API 参考

[API](./docs/API.md)

## 常见问题

[FAQ](./docs/FAQ.md)

## 故障排除 和 优化建议

[FIX](./docs/FIX.md)

## 开发

欢迎提交 Issue 和 Pull Request！

[DEV](./docs/DEV.md)

## 许可证

MIT License
