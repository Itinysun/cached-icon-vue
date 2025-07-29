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

## 图标路径转换工具

### generateIconPath()

生成图标路径信息。

```typescript
function generateIconPath(iconName: string, config?: IconPathConfig): IconPathInfo

interface IconPathConfig {
  iconPathPrefix?: string
}

interface IconPathInfo {
  library: string
  name: string
  fileName: string
  fullPath: string
}
```

**使用示例：**

```typescript
import { generateIconPath } from 'cached-icon-vue'

// 扁平结构（默认）
const result1 = generateIconPath('mdi:home')
// {
//   library: 'mdi',
//   name: 'home',
//   fileName: 'home.svg',
//   fullPath: '/icons/mdi-home.svg'
// }

// 按库分文件夹
const result2 = generateIconPath('mdi:home', {
  iconPathPrefix: '/assets/icons',
})
// {
//   library: 'mdi',
//   name: 'home',
//   fileName: 'home.svg',
//   fullPath: '/assets/icons/mdi/home.svg'
// }
```

### parseIconName()

解析图标名称，提取图标库和名称。

```typescript
function parseIconName(iconName: string): {
  library: string
  name: string
}
```

**使用示例：**

```typescript
import { parseIconName } from 'cached-icon-vue'

parseIconName('mdi:home') // { library: 'mdi', name: 'home' }
parseIconName('mdi-home') // { library: 'mdi', name: 'home' }
parseIconName('heroicons:heart-20-solid') // { library: 'heroicons', name: 'heart-20-solid' }
parseIconName('custom-icon') // { library: 'custom', name: 'custom-icon' }
```

### legacyIconNameToFileName()

向后兼容的文件名转换函数。

```typescript
function legacyIconNameToFileName(iconName: string): string
```

**使用示例：**

```typescript
import { legacyIconNameToFileName } from 'cached-icon-vue'

legacyIconNameToFileName('mdi:home') // 'mdi-home'
legacyIconNameToFileName('fa:user') // 'fa-user'
```
