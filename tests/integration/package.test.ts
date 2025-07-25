import { describe, it, expect } from 'vitest'

// 测试包的主要导出
import CachedIconVue, {
  CachedIcon,
  LoadingIcon,
  ErrorIcon,
  DefaultIcon,
  iconCache,
  IconCacheManager,
  iconDownloader,
  IconDownloader,
  vitePluginCachedIcon,
  VitePluginCachedIcon,
  IconStatus,
  install,
} from '../../src/index'

describe('Package Integration', () => {
  describe('主要导出', () => {
    it('应该导出默认对象', () => {
      expect(CachedIconVue).toBeTruthy()
      expect(typeof CachedIconVue).toBe('object')
      expect(CachedIconVue.install).toBeTruthy()
      expect(CachedIconVue.CachedIcon).toBeTruthy()
    })

    it('应该导出所有组件', () => {
      expect(CachedIcon).toBeTruthy()
      expect(LoadingIcon).toBeTruthy()
      expect(ErrorIcon).toBeTruthy()
      expect(DefaultIcon).toBeTruthy()
    })

    it('应该导出缓存管理相关', () => {
      expect(iconCache).toBeTruthy()
      expect(IconCacheManager).toBeTruthy()
      expect(typeof IconCacheManager).toBe('function')
    })

    it('应该导出下载器相关', () => {
      expect(iconDownloader).toBeTruthy()
      expect(IconDownloader).toBeTruthy()
      expect(typeof IconDownloader).toBe('function')
    })

    it('应该导出 Vite 插件', () => {
      expect(vitePluginCachedIcon).toBeTruthy()
      expect(VitePluginCachedIcon).toBeTruthy()
      expect(typeof vitePluginCachedIcon).toBe('function')
    })

    it('应该导出枚举和类型', () => {
      expect(IconStatus).toBeTruthy()
      expect(typeof IconStatus).toBe('object')
      expect(IconStatus.UNKNOWN).toBe('unknown')
      expect(IconStatus.EXISTS).toBe('exists')
      expect(IconStatus.DOWNLOADING).toBe('downloading')
      expect(IconStatus.DOWNLOADED).toBe('downloaded')
      expect(IconStatus.FAILED).toBe('failed')
    })

    it('应该导出安装函数', () => {
      expect(install).toBeTruthy()
      expect(typeof install).toBe('function')
    })
  })

  describe('组件类型检查', () => {
    it('CachedIcon 应该是 Vue 组件', () => {
      expect(CachedIcon).toBeTruthy()
      // Vue 组件应该有 __vccOpts 或 render 函数
      expect(CachedIcon.__vccOpts || CachedIcon.render).toBeTruthy()
    })

    it('LoadingIcon 应该是 Vue 组件', () => {
      expect(LoadingIcon).toBeTruthy()
      expect(LoadingIcon.__vccOpts || LoadingIcon.render).toBeTruthy()
    })

    it('ErrorIcon 应该是 Vue 组件', () => {
      expect(ErrorIcon).toBeTruthy()
      expect(ErrorIcon.__vccOpts || ErrorIcon.render).toBeTruthy()
    })

    it('DefaultIcon 应该是 Vue 组件', () => {
      expect(DefaultIcon).toBeTruthy()
      expect(DefaultIcon.__vccOpts || DefaultIcon.render).toBeTruthy()
    })
  })

  describe('类实例化', () => {
    it('IconCacheManager 应该可以实例化', () => {
      const cacheManager = new IconCacheManager()
      expect(cacheManager).toBeTruthy()
      expect(typeof cacheManager.get).toBe('function')
      expect(typeof cacheManager.set).toBe('function')
      expect(typeof cacheManager.clear).toBe('function')
    })

    it('IconDownloader 应该可以实例化', () => {
      const downloader = new IconDownloader()
      expect(downloader).toBeTruthy()
      expect(typeof downloader.downloadIcon).toBe('function')
    })
  })

  describe('Vite 插件功能', () => {
    it('vitePluginCachedIcon 应该返回有效插件', () => {
      const plugin = vitePluginCachedIcon()
      expect(plugin).toBeTruthy()
      expect(plugin.name).toBe('vite-plugin-cached-icon')
      expect(typeof plugin.configureServer).toBe('function')
    })

    it('VitePluginCachedIcon 应该是同一个函数', () => {
      expect(VitePluginCachedIcon).toBe(vitePluginCachedIcon)
    })
  })

  describe('全局实例', () => {
    it('iconCache 应该是 IconCacheManager 的实例', () => {
      expect(iconCache).toBeTruthy()
      expect(iconCache instanceof IconCacheManager).toBe(true)
    })

    it('iconDownloader 应该是 IconDownloader 的实例', () => {
      expect(iconDownloader).toBeTruthy()
      expect(iconDownloader instanceof IconDownloader).toBe(true)
    })
  })

  describe('安装函数', () => {
    it('install 函数应该接受 Vue app 实例', () => {
      const mockApp = {
        component: vi.fn(),
        provide: vi.fn(),
      }

      expect(() => {
        install(mockApp as any)
      }).not.toThrow()

      expect(mockApp.component).toHaveBeenCalledWith('CachedIcon', CachedIcon)
      expect(mockApp.component).toHaveBeenCalledWith('LoadingIcon', LoadingIcon)
      expect(mockApp.component).toHaveBeenCalledWith('ErrorIcon', ErrorIcon)
      expect(mockApp.component).toHaveBeenCalledWith('DefaultIcon', DefaultIcon)
    })

    it('默认导出应该包含所有必要组件', () => {
      expect(CachedIconVue.install).toBe(install)
      expect(CachedIconVue.CachedIcon).toBe(CachedIcon)
      expect(CachedIconVue.LoadingIcon).toBe(LoadingIcon)
      expect(CachedIconVue.ErrorIcon).toBe(ErrorIcon)
      expect(CachedIconVue.DefaultIcon).toBe(DefaultIcon)
      expect(CachedIconVue.vitePluginCachedIcon).toBe(vitePluginCachedIcon)
    })
  })

  describe('API 一致性', () => {
    it('所有导出的 API 应该保持一致', () => {
      // 测试重要 API 的签名
      expect(typeof iconCache.get).toBe('function')
      expect(typeof iconCache.set).toBe('function')
      expect(typeof iconDownloader.downloadIcon).toBe('function')
      expect(typeof vitePluginCachedIcon).toBe('function')
    })

    it('枚举值应该正确', () => {
      const statusValues = Object.values(IconStatus)
      expect(statusValues).toContain('unknown')
      expect(statusValues).toContain('exists')
      expect(statusValues).toContain('downloading')
      expect(statusValues).toContain('downloaded')
      expect(statusValues).toContain('failed')
    })
  })
})
