import type { IconDownloadResult, CachedIconConfig } from '../types'
import { iconCache } from './iconCache'

/**
 * 图标下载工具
 */
export class IconDownloader {
  private config: Required<CachedIconConfig>

  constructor(config: CachedIconConfig = {}) {
    this.config = {
      isDevelopment: config.isDevelopment || (() => process.env.NODE_ENV === 'development'),
      cacheExpireTime: config.cacheExpireTime || 24 * 60 * 60 * 1000,
      storageKey: config.storageKey || 'cached-icon-cache-v1',
      downloadApiEndpoint: config.downloadApiEndpoint || '/api/download-icon',
      iconPathPrefix: config.iconPathPrefix || '/icons',
    }
  }

  /**
   * 下载图标到本地（带缓存管理）
   */
  async downloadIcon(iconName: string, forceDownload = false): Promise<IconDownloadResult> {
    if (!this.config.isDevelopment()) {
      throw new Error('Icon downloader is only available in development mode')
    }

    if (!iconName) {
      const result = {
        success: false,
        message: 'Icon name is required',
        exists: false,
        error: 'Icon name is required',
      }
      iconCache.markAsFailed(iconName, result.error!)
      return result
    }

    // 检查缓存状态
    if (!forceDownload) {
      const cacheEntry = iconCache.get(iconName)

      if (iconCache.isKnownToExist(iconName)) {
        return {
          success: true,
          message: 'Icon exists in cache',
          exists: true,
          downloaded: false,
          svgContent: cacheEntry?.svgContent,
        }
      }

      if (iconCache.isDownloading(iconName)) {
        const downloadPromise = iconCache.getDownloadPromise(iconName)
        if (downloadPromise) {
          try {
            return await downloadPromise
          } catch (error) {
            // 继续执行新的下载
          }
        }
      }

      if (iconCache.hasFailed(iconName)) {
        const entry = iconCache.get(iconName)
        const timeSinceFailure = Date.now() - (entry?.lastChecked || 0)
        if (timeSinceFailure < 30000) {
          return {
            success: false,
            message: 'Icon download failed recently',
            exists: false,
            error: entry?.error || 'Download failed',
          }
        }
      }
    }

    const downloadPromise = this.performIconDownload(iconName)
    iconCache.markAsDownloading(iconName, downloadPromise)
    return downloadPromise
  }

  /**
   * 执行实际的图标下载
   */
  private async performIconDownload(iconName: string): Promise<IconDownloadResult> {
    try {
      const response = await fetch(
        `${this.config.downloadApiEndpoint}?name=${encodeURIComponent(iconName)}`
      )
      const result: IconDownloadResult = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`)
      }

      // 更新缓存状态
      if (result.success) {
        if (result.exists && !result.downloaded) {
          iconCache.markAsExists(iconName, result.svgContent)
        } else if (result.downloaded) {
          iconCache.markAsDownloaded(iconName, result.svgContent)
        }
      } else {
        iconCache.markAsFailed(iconName, result.error || 'Download failed')
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to download icon:', error)

      iconCache.markAsFailed(iconName, errorMessage)

      return {
        success: false,
        message: 'Failed to download icon',
        exists: false,
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      }
    }
  }

  /**
   * 批量下载图标
   */
  async downloadIcons(iconNames: string[]): Promise<Record<string, IconDownloadResult>> {
    const results: Record<string, IconDownloadResult> = {}
    const CONCURRENT_LIMIT = 5
    const chunks = []

    for (let i = 0; i < iconNames.length; i += CONCURRENT_LIMIT) {
      chunks.push(iconNames.slice(i, i + CONCURRENT_LIMIT))
    }

    for (const chunk of chunks) {
      const promises = chunk.map(async iconName => {
        const result = await this.downloadIcon(iconName)
        results[iconName] = result
        return result
      })

      await Promise.all(promises)
    }

    return results
  }

  /**
   * 检查图标是否存在本地
   */
  async checkIconExists(iconName: string): Promise<boolean> {
    if (!this.config.isDevelopment()) {
      return false
    }

    try {
      const result = await this.downloadIcon(iconName)
      return result.exists
    } catch {
      return false
    }
  }
}

// 默认导出一个全局实例
export const iconDownloader = new IconDownloader()
