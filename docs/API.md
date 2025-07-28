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
