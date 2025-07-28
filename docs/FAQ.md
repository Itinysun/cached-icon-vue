## 常见问题

### 1. 图标无法自动下载

**问题**：组件显示默认图标(三角形轮廓的感叹号)，没有自动下载。

**解决方案**：

1. 确保已正确配置 Vite 插件
2. 检查是否在开发环境（`npm run dev`）.这个尤为重要.请查看[环境配置](ENV.md)
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
