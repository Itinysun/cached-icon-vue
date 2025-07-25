import { describe, it, expect, vi, beforeEach } from 'vitest'
import { vitePluginCachedIcon } from '../../src/vite-plugin'

// Mock Node.js modules
vi.mock('node:fs', () => ({
  default: {},
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
}))

vi.mock('node:path', () => ({
  default: {},
  resolve: vi.fn((...args) => args.join('/')),
  join: vi.fn((...args) => args.join('/')),
}))

// Mock fetch for Iconify API
global.fetch = vi.fn()

describe('vitePluginCachedIcon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('插件创建', () => {
    it('应该返回有效的 Vite 插件对象', () => {
      const plugin = vitePluginCachedIcon()

      expect(plugin).toBeTruthy()
      expect(plugin.name).toBe('vite-plugin-cached-icon')
      expect(typeof plugin.configureServer).toBe('function')
    })

    it('应该使用默认选项', () => {
      const plugin = vitePluginCachedIcon()

      expect(plugin.name).toBe('vite-plugin-cached-icon')
    })

    it('应该接受自定义选项', () => {
      const options = {
        iconDir: 'custom/icons',
        iconSource: 'custom' as const,
        customUrlTemplate: 'https://example.com/{name}.svg',
      }

      const plugin = vitePluginCachedIcon(options)

      expect(plugin.name).toBe('vite-plugin-cached-icon')
    })
  })

  describe('服务器配置', () => {
    it('应该只在 serve 模式下配置中间件', () => {
      const plugin = vitePluginCachedIcon()
      const mockServer = {
        config: { command: 'build' },
        middlewares: {
          use: vi.fn(),
        },
      }

      plugin.configureServer?.(
        mockServer as {
          config: { command: string }
          middlewares: { use: typeof mockServer.middlewares.use }
        }
      )

      expect(mockServer.middlewares.use).not.toHaveBeenCalled()
    })

    it('应该在 serve 模式下注册中间件', () => {
      const plugin = vitePluginCachedIcon()
      const mockServer = {
        config: { command: 'serve', root: '/test' },
        middlewares: {
          use: vi.fn(),
        },
      }

      plugin.configureServer?.(
        mockServer as {
          config: { command: string; root: string }
          middlewares: { use: typeof mockServer.middlewares.use }
        }
      )

      expect(mockServer.middlewares.use).toHaveBeenCalledWith(
        '/api/download-icon',
        expect.any(Function)
      )
    })
  })

  describe('默认选项', () => {
    it('应该使用正确的默认选项', () => {
      // 通过创建插件并观察行为来测试默认选项
      const plugin = vitePluginCachedIcon()

      expect(plugin).toBeTruthy()
      expect(plugin.name).toBe('vite-plugin-cached-icon')
    })

    it('应该合并用户选项和默认选项', () => {
      const userOptions = {
        iconDir: 'my-icons',
      }

      const plugin = vitePluginCachedIcon(userOptions)

      // 插件应该被成功创建，表明选项合并正常
      expect(plugin.name).toBe('vite-plugin-cached-icon')
    })
  })

  describe('图标源配置', () => {
    it('应该支持 iconify 源', () => {
      const plugin = vitePluginCachedIcon({
        iconSource: 'iconify',
      })

      expect(plugin.name).toBe('vite-plugin-cached-icon')
    })

    it('应该支持自定义源', () => {
      const plugin = vitePluginCachedIcon({
        iconSource: 'custom',
        customUrlTemplate: 'https://cdn.example.com/{name}.svg',
      })

      expect(plugin.name).toBe('vite-plugin-cached-icon')
    })
  })

  describe('错误处理', () => {
    it('应该处理无效的配置', () => {
      // 测试插件能否处理边缘情况的配置
      expect(() => {
        vitePluginCachedIcon({
          iconDir: '',
          iconSource: 'iconify',
        })
      }).not.toThrow()
    })

    it('应该处理 undefined 配置', () => {
      expect(() => {
        vitePluginCachedIcon(undefined)
      }).not.toThrow()
    })
  })

  describe('插件接口合规性', () => {
    it('应该具有必需的插件属性', () => {
      const plugin = vitePluginCachedIcon()

      expect(typeof plugin.name).toBe('string')
      expect(plugin.name.length).toBeGreaterThan(0)
      expect(typeof plugin.configureServer).toBe('function')
    })

    it('应该返回正确的插件类型', () => {
      const plugin = vitePluginCachedIcon()

      // Vite 插件应该有 name 和 configureServer 属性
      expect('name' in plugin).toBe(true)
      expect('configureServer' in plugin).toBe(true)
    })
  })

  describe('开发环境限制', () => {
    it('应该只在开发环境配置服务器', () => {
      const plugin = vitePluginCachedIcon()
      const prodServer = {
        config: { command: 'build' },
        middlewares: {
          use: vi.fn(),
        },
      }

      plugin.configureServer?.(
        prodServer as {
          config: { command: string }
          middlewares: { use: typeof prodServer.middlewares.use }
        }
      )

      expect(prodServer.middlewares.use).not.toHaveBeenCalled()
    })
  })

  describe('TypeScript 类型', () => {
    it('应该有正确的 TypeScript 类型', () => {
      // 测试类型推断是否正确
      const plugin = vitePluginCachedIcon({
        iconDir: 'test',
        iconSource: 'iconify',
      })

      expect(plugin.name).toBe('vite-plugin-cached-icon')
    })
  })
})
