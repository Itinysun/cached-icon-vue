import type { IconStatus, IconCacheEntry, IconCacheStats, CachedIconConfig } from '../types'

/**
 * 图标缓存管理器
 * 在内存中跟踪图标的状态，避免重复请求
 */
export class IconCacheManager {
  private cache = new Map<string, IconCacheEntry>()
  private readonly config: Required<CachedIconConfig>
  private readonly STORAGE_ENABLED = typeof localStorage !== 'undefined'

  constructor(config: CachedIconConfig = {}) {
    this.config = {
      isDevelopment: config.isDevelopment || (() => process.env.NODE_ENV === 'development'),
      cacheExpireTime: config.cacheExpireTime || 24 * 60 * 60 * 1000, // 24小时
      storageKey: config.storageKey || 'cached-icon-cache-v1',
      downloadApiEndpoint: config.downloadApiEndpoint || '/api/download-icon',
      iconPathPrefix: config.iconPathPrefix || '/icons',
    }

    this.loadFromStorage()
  }

  /**
   * 从 localStorage 加载缓存
   */
  private loadFromStorage(): void {
    if (!this.STORAGE_ENABLED) return

    try {
      const stored = localStorage.getItem(this.config.storageKey)
      if (stored) {
        const data = JSON.parse(stored) as Record<string, IconCacheEntry>
        Object.entries(data).forEach(([key, entry]) => {
          if (Date.now() - entry.lastChecked > this.config.cacheExpireTime) {
            return
          }
          this.cache.set(key, { ...entry, downloadPromise: undefined })
        })
      }
    } catch (error) {
      console.warn('Failed to load icon cache from localStorage:', error)
    }
  }

  /**
   * 保存缓存到 localStorage
   */
  private saveToStorage(): void {
    if (!this.STORAGE_ENABLED) return

    try {
      const cacheData: Record<string, IconCacheEntry> = {}
      this.cache.forEach((entry, key) => {
        const { downloadPromise, ...persistentEntry } = entry
        cacheData[key] = persistentEntry
      })
      localStorage.setItem(this.config.storageKey, JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Failed to save icon cache to localStorage:', error)
    }
  }

  /**
   * 获取图标缓存条目
   */
  get(iconName: string): IconCacheEntry | undefined {
    const entry = this.cache.get(iconName)

    if (entry && Date.now() - entry.lastChecked > this.config.cacheExpireTime) {
      entry.status = IconStatus.UNKNOWN
      entry.lastChecked = Date.now()
      entry.error = undefined
    }

    return entry
  }

  /**
   * 设置图标缓存条目
   */
  set(iconName: string, entry: Partial<IconCacheEntry>): IconCacheEntry {
    const existing = this.cache.get(iconName)
    const newEntry: IconCacheEntry = {
      name: iconName,
      status: IconStatus.UNKNOWN,
      lastChecked: Date.now(),
      ...existing,
      ...entry,
    }

    this.cache.set(iconName, newEntry)
    this.saveToStorage()
    return newEntry
  }

  /**
   * 更新图标状态
   */
  updateStatus(
    iconName: string,
    status: IconStatus,
    extra?: Partial<IconCacheEntry>
  ): IconCacheEntry {
    return this.set(iconName, { status, lastChecked: Date.now(), ...extra })
  }

  /**
   * 标记图标为存在
   */
  markAsExists(iconName: string, svgContent?: string): IconCacheEntry {
    return this.updateStatus(iconName, IconStatus.EXISTS, { svgContent })
  }

  /**
   * 标记图标为正在下载
   */
  markAsDownloading(iconName: string, downloadPromise: Promise<any>): IconCacheEntry {
    return this.updateStatus(iconName, IconStatus.DOWNLOADING, { downloadPromise })
  }

  /**
   * 标记图标为下载成功
   */
  markAsDownloaded(iconName: string, svgContent?: string): IconCacheEntry {
    const entry = this.updateStatus(iconName, IconStatus.DOWNLOADED, { svgContent })
    if (entry.downloadPromise) {
      delete entry.downloadPromise
    }
    return entry
  }

  /**
   * 标记图标为下载失败
   */
  markAsFailed(iconName: string, error: string): IconCacheEntry {
    const entry = this.updateStatus(iconName, IconStatus.FAILED, { error })
    if (entry.downloadPromise) {
      delete entry.downloadPromise
    }
    return entry
  }

  /**
   * 检查图标是否已知存在
   */
  isKnownToExist(iconName: string): boolean {
    const entry = this.get(iconName)
    return entry?.status === IconStatus.EXISTS || entry?.status === IconStatus.DOWNLOADED
  }

  /**
   * 检查图标是否正在下载
   */
  isDownloading(iconName: string): boolean {
    const entry = this.get(iconName)
    return entry?.status === IconStatus.DOWNLOADING
  }

  /**
   * 检查图标是否下载失败
   */
  hasFailed(iconName: string): boolean {
    const entry = this.get(iconName)
    return entry?.status === IconStatus.FAILED
  }

  /**
   * 获取图标的SVG内容
   */
  getSvgContent(iconName: string): string | undefined {
    const entry = this.get(iconName)
    return entry?.svgContent
  }

  /**
   * 获取下载Promise（如果正在下载）
   */
  getDownloadPromise(iconName: string): Promise<any> | undefined {
    const entry = this.get(iconName)
    return entry?.downloadPromise
  }

  /**
   * 清除图标缓存
   */
  clear(iconName?: string): void {
    if (iconName) {
      this.cache.delete(iconName)
    } else {
      this.cache.clear()
    }
    this.saveToStorage()
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): IconCacheStats {
    const stats: IconCacheStats = {
      total: this.cache.size,
      exists: 0,
      downloading: 0,
      downloaded: 0,
      failed: 0,
      unknown: 0,
    }

    for (const entry of this.cache.values()) {
      switch (entry.status) {
        case IconStatus.EXISTS:
          stats.exists++
          break
        case IconStatus.DOWNLOADING:
          stats.downloading++
          break
        case IconStatus.DOWNLOADED:
          stats.downloaded++
          break
        case IconStatus.FAILED:
          stats.failed++
          break
        default:
          stats.unknown++
      }
    }

    return stats
  }

  /**
   * 验证缓存中标记为存在的图标是否真的存在
   */
  async validateExistingIcons(): Promise<void> {
    if (!this.config.isDevelopment()) return

    const existingEntries = Array.from(this.cache.entries()).filter(
      ([_, entry]) =>
        entry.status === IconStatus.EXISTS || entry.status === IconStatus.DOWNLOADED
    )

    for (const [iconName] of existingEntries) {
      const fileName = iconName.replace(/:/g, '-')
      const iconPath = `${this.config.iconPathPrefix}/${fileName}.svg`

      try {
        const response = await fetch(iconPath)
        if (!response.ok) {
          this.updateStatus(iconName, IconStatus.UNKNOWN)
        }
      } catch (error) {
        this.updateStatus(iconName, IconStatus.UNKNOWN)
      }
    }
  }
}

// 默认导出一个全局实例，也可以创建自定义实例
export const iconCache = new IconCacheManager()