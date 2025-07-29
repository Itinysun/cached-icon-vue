/**
 * CachedIcon 组件类型定义
 */

export interface CachedIconProps {
  name?: string
  icon?: string
  size?: string | number
  class?: string
  /** 是否自动下载不存在的图标 */
  autoDownload?: boolean
  /** 是否显示加载状态 */
  showLoadingState?: boolean
  /** 是否显示错误状态 */
  showErrorState?: boolean
  /** 组件级别的配置 */
  config?: Partial<CachedIconConfig>
}

export interface IconDownloadResult {
  success: boolean
  message: string
  path?: string
  exists: boolean
  downloaded?: boolean
  error?: string
  details?: string
  svgContent?: string
}

export enum IconStatus {
  UNKNOWN = 'unknown',
  EXISTS = 'exists',
  DOWNLOADING = 'downloading',
  DOWNLOADED = 'downloaded',
  FAILED = 'failed',
}

export interface IconCacheEntry {
  name: string
  status: IconStatus
  svgContent?: string
  error?: string
  lastChecked: number
  downloadPromise?: Promise<IconDownloadResult>
}

export interface IconCacheStats {
  total: number
  exists: number
  downloading: number
  downloaded: number
  failed: number
  unknown: number
}

export interface CachedIconConfig {
  /** 开发环境判断函数 */
  isDevelopment?: () => boolean
  /** 缓存过期时间（毫秒） */
  cacheExpireTime?: number
  /** 本地存储键名 */
  storageKey?: string
  /** 图标下载API端点 */
  downloadApiEndpoint?: string
  /** 图标文件路径前缀 */
  iconPathPrefix?: string
  /** 是否按图标库分文件夹保存（默认：false） */
  organizeByLibrary?: boolean
}

// Vite 插件相关类型
export interface IconDownloaderOptions {
  /** SVG图标保存目录（必须是 public 目录下的路径） */
  iconDir?: string
  /** 图标下载源 */
  iconSource?: 'iconify' | 'custom'
  /** 自定义下载URL模板 */
  customUrlTemplate?: string
  /** 自定义API端点 */
  apiEndpoint?: string
  /** 开发环境判断函数 */
  isDevelopment?: () => boolean
  /** 是否按图标库分文件夹保存（默认：false） */
  organizeByLibrary?: boolean
}

// 插件安装选项接口（为将来扩展预留）
export type CachedIconInstallOptions = Partial<CachedIconConfig>
