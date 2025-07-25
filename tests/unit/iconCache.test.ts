import { describe, it, expect, beforeEach } from 'vitest'
import { IconCacheManager } from '../../src/utils/iconCache'
import { IconStatus } from '../../src/types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('IconCacheManager', () => {
  let cacheManager: IconCacheManager

  beforeEach(() => {
    localStorageMock.clear()
    cacheManager = new IconCacheManager({
      isDevelopment: () => true,
      cacheExpireTime: 1000,
      storageKey: 'test-icon-cache',
    })
  })

  describe('基础功能', () => {
    it('应该能够设置和获取缓存条目', () => {
      const iconName = 'mdi:home'
      const entry = cacheManager.set(iconName, { status: IconStatus.EXISTS })

      expect(entry.name).toBe(iconName)
      expect(entry.status).toBe(IconStatus.EXISTS)

      const retrieved = cacheManager.get(iconName)
      expect(retrieved).toBeTruthy()
      expect(retrieved?.name).toBe(iconName)
      expect(retrieved?.status).toBe(IconStatus.EXISTS)
    })

    it('应该能够更新图标状态', () => {
      const iconName = 'mdi:star'

      cacheManager.updateStatus(iconName, IconStatus.DOWNLOADING)
      let entry = cacheManager.get(iconName)
      expect(entry?.status).toBe(IconStatus.DOWNLOADING)

      cacheManager.updateStatus(iconName, IconStatus.DOWNLOADED, { svgContent: '<svg>test</svg>' })
      entry = cacheManager.get(iconName)
      expect(entry?.status).toBe(IconStatus.DOWNLOADED)
      expect(entry?.svgContent).toBe('<svg>test</svg>')
    })

    it('应该能够标记图标为存在', () => {
      const iconName = 'mdi:heart'
      const svgContent = '<svg>heart</svg>'

      cacheManager.markAsExists(iconName, svgContent)

      const entry = cacheManager.get(iconName)
      expect(entry?.status).toBe(IconStatus.EXISTS)
      expect(entry?.svgContent).toBe(svgContent)
    })

    it('应该能够标记图标为下载中', () => {
      const iconName = 'mdi:download'
      const promise = Promise.resolve('test')

      cacheManager.markAsDownloading(iconName, promise)

      const entry = cacheManager.get(iconName)
      expect(entry?.status).toBe(IconStatus.DOWNLOADING)
      expect(entry?.downloadPromise).toBe(promise)
    })

    it('应该能够标记图标为下载成功', () => {
      const iconName = 'mdi:success'
      const svgContent = '<svg>success</svg>'

      // 先标记为下载中
      cacheManager.markAsDownloading(iconName, Promise.resolve())

      // 然后标记为下载成功
      cacheManager.markAsDownloaded(iconName, svgContent)

      const entry = cacheManager.get(iconName)
      expect(entry?.status).toBe(IconStatus.DOWNLOADED)
      expect(entry?.svgContent).toBe(svgContent)
      expect(entry?.downloadPromise).toBeUndefined()
    })

    it('应该能够标记图标为下载失败', () => {
      const iconName = 'mdi:error'
      const error = 'Download failed'

      cacheManager.markAsFailed(iconName, error)

      const entry = cacheManager.get(iconName)
      expect(entry?.status).toBe(IconStatus.FAILED)
      expect(entry?.error).toBe(error)
    })
  })

  describe('状态检查方法', () => {
    it('应该正确检查图标是否已知存在', () => {
      const iconName = 'mdi:check'

      expect(cacheManager.isKnownToExist(iconName)).toBe(false)

      cacheManager.markAsExists(iconName)
      expect(cacheManager.isKnownToExist(iconName)).toBe(true)

      cacheManager.markAsDownloaded(iconName)
      expect(cacheManager.isKnownToExist(iconName)).toBe(true)

      cacheManager.markAsFailed(iconName, 'error')
      expect(cacheManager.isKnownToExist(iconName)).toBe(false)
    })

    it('应该正确检查图标是否正在下载', () => {
      const iconName = 'mdi:loading'

      expect(cacheManager.isDownloading(iconName)).toBe(false)

      cacheManager.markAsDownloading(iconName, Promise.resolve())
      expect(cacheManager.isDownloading(iconName)).toBe(true)

      cacheManager.markAsDownloaded(iconName)
      expect(cacheManager.isDownloading(iconName)).toBe(false)
    })

    it('应该正确检查图标是否下载失败', () => {
      const iconName = 'mdi:fail'

      expect(cacheManager.hasFailed(iconName)).toBe(false)

      cacheManager.markAsFailed(iconName, 'error')
      expect(cacheManager.hasFailed(iconName)).toBe(true)

      cacheManager.markAsExists(iconName)
      expect(cacheManager.hasFailed(iconName)).toBe(false)
    })
  })

  describe('SVG 内容管理', () => {
    it('应该能够获取 SVG 内容', () => {
      const iconName = 'mdi:content'
      const svgContent = '<svg>content</svg>'

      expect(cacheManager.getSvgContent(iconName)).toBeUndefined()

      cacheManager.markAsExists(iconName, svgContent)
      expect(cacheManager.getSvgContent(iconName)).toBe(svgContent)
    })

    it('应该能够获取下载 Promise', () => {
      const iconName = 'mdi:promise'
      const promise = Promise.resolve('test')

      expect(cacheManager.getDownloadPromise(iconName)).toBeUndefined()

      cacheManager.markAsDownloading(iconName, promise)
      expect(cacheManager.getDownloadPromise(iconName)).toBe(promise)
    })
  })

  describe('缓存清理', () => {
    it('应该能够清除特定图标缓存', () => {
      const iconName1 = 'mdi:clear1'
      const iconName2 = 'mdi:clear2'

      cacheManager.markAsExists(iconName1)
      cacheManager.markAsExists(iconName2)

      expect(cacheManager.get(iconName1)).toBeTruthy()
      expect(cacheManager.get(iconName2)).toBeTruthy()

      cacheManager.clear(iconName1)

      expect(cacheManager.get(iconName1)).toBeFalsy()
      expect(cacheManager.get(iconName2)).toBeTruthy()
    })

    it('应该能够清除所有缓存', () => {
      const iconName1 = 'mdi:clearall1'
      const iconName2 = 'mdi:clearall2'

      cacheManager.markAsExists(iconName1)
      cacheManager.markAsExists(iconName2)

      expect(cacheManager.get(iconName1)).toBeTruthy()
      expect(cacheManager.get(iconName2)).toBeTruthy()

      cacheManager.clear()

      expect(cacheManager.get(iconName1)).toBeFalsy()
      expect(cacheManager.get(iconName2)).toBeFalsy()
    })
  })

  describe('统计信息', () => {
    it('应该提供正确的缓存统计信息', () => {
      cacheManager.markAsExists('icon1')
      cacheManager.markAsDownloading('icon2', Promise.resolve())
      cacheManager.markAsDownloaded('icon3')
      cacheManager.markAsFailed('icon4', 'error')

      const stats = cacheManager.getStats()

      expect(stats.total).toBe(4)
      expect(stats.exists).toBe(1)
      expect(stats.downloading).toBe(1)
      expect(stats.downloaded).toBe(1)
      expect(stats.failed).toBe(1)
      expect(stats.unknown).toBe(0)
    })
  })

  describe('本地存储持久化', () => {
    it('应该能够保存和加载缓存', () => {
      const iconName = 'mdi:persist'
      const svgContent = '<svg>persist</svg>'

      cacheManager.markAsExists(iconName, svgContent)

      // 创建新的缓存管理器实例，应该能够从 localStorage 加载数据
      const newCacheManager = new IconCacheManager({
        isDevelopment: () => true,
        cacheExpireTime: 1000,
        storageKey: 'test-icon-cache',
      })

      const entry = newCacheManager.get(iconName)
      expect(entry).toBeTruthy()
      expect(entry?.status).toBe(IconStatus.EXISTS)
      expect(entry?.svgContent).toBe(svgContent)
    })
  })

  describe('缓存过期', () => {
    it('应该自动清理过期缓存', async () => {
      // 使用很短的过期时间
      const shortExpireCacheManager = new IconCacheManager({
        isDevelopment: () => true,
        cacheExpireTime: 1, // 1 毫秒
        storageKey: 'test-expire-cache',
      })

      const iconName = 'mdi:expire'
      shortExpireCacheManager.markAsExists(iconName)

      // 等待缓存过期
      await new Promise(resolve => setTimeout(resolve, 10))

      const entry = shortExpireCacheManager.get(iconName)
      expect(entry?.status).toBe(IconStatus.UNKNOWN)
    })
  })
})
