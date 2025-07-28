import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { vitePluginCachedIcon } from '../../src/vite-plugin/index'

describe('Vite 插件自定义环境检测', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('应该在 Vite serve 模式下显示开发模式提醒', () => {
    const plugin = vitePluginCachedIcon()

    // 模拟 Vite 的 config 钩子
    const mockConfig = { define: {} }
    const mockContext = { command: 'serve' as const }

    if (plugin.config) {
      plugin.config(mockConfig, mockContext)
    }

    // 应该显示开发模式提醒
    expect(consoleSpy).toHaveBeenCalledWith(
      '\x1b[36m%s\x1b[0m',
      '🔧 CachedIcon Vite 插件已启用 (开发模式)'
    )
  })

  it('应该在 Vite build 模式下不显示开发模式提醒', () => {
    const plugin = vitePluginCachedIcon()

    // 模拟 Vite 的 config 钩子
    const mockConfig = { define: {} }
    const mockContext = { command: 'build' as const }

    if (plugin.config) {
      plugin.config(mockConfig, mockContext)
    }

    // 不应该显示开发模式提醒
    expect(consoleSpy).not.toHaveBeenCalledWith(
      '\x1b[36m%s\x1b[0m',
      '🔧 CachedIcon Vite 插件已启用 (开发模式)'
    )
  })

  it('应该使用用户自定义环境检测（强制开发模式）', () => {
    const plugin = vitePluginCachedIcon({
      isDevelopment: () => true,
    })

    // 模拟 Vite 的 config 钩子（非 serve 模式）
    const mockConfig = { define: {} }
    const mockContext = { command: 'build' as const }

    if (plugin.config) {
      plugin.config(mockConfig, mockContext)
    }

    // 应该显示开发模式提醒
    expect(consoleSpy).toHaveBeenCalledWith(
      '\x1b[36m%s\x1b[0m',
      '🔧 CachedIcon Vite 插件已启用 (开发模式)'
    )

    // 应该显示用户自定义环境检测的警告
    expect(consoleSpy).toHaveBeenCalledWith(
      '\x1b[33m%s\x1b[0m',
      '  ⚠️  使用用户自定义环境检测（非 Vite serve 模式）'
    )
  })

  it('应该使用用户自定义环境检测（强制生产模式）', () => {
    const plugin = vitePluginCachedIcon({
      isDevelopment: () => false,
    })

    // 模拟 Vite 的 config 钩子（即使是 serve 模式）
    const mockConfig = { define: {} }
    const mockContext = { command: 'serve' as const }

    if (plugin.config) {
      plugin.config(mockConfig, mockContext)
    }

    // 仍然应该显示开发模式提醒（因为 Vite 是 serve 模式）
    expect(consoleSpy).toHaveBeenCalledWith(
      '\x1b[36m%s\x1b[0m',
      '🔧 CachedIcon Vite 插件已启用 (开发模式)'
    )

    // 不应该显示用户自定义环境检测的警告
    expect(consoleSpy).not.toHaveBeenCalledWith(
      '\x1b[33m%s\x1b[0m',
      '  ⚠️  使用用户自定义环境检测（非 Vite serve 模式）'
    )
  })

  it('应该正确设置配置信息', () => {
    const plugin = vitePluginCachedIcon({
      apiEndpoint: '/custom/api',
      iconDir: 'custom/icons',
      iconSource: 'custom',
    })

    // 模拟 Vite 的 config 钩子
    const mockConfig = { define: {} }
    const mockContext = { command: 'serve' as const }

    if (plugin.config) {
      plugin.config(mockConfig, mockContext)
    }

    // 应该显示自定义配置信息
    expect(consoleSpy).toHaveBeenCalledWith('  • 图标下载 API 端点:', '/custom/api')
    expect(consoleSpy).toHaveBeenCalledWith('  • 图标保存目录:', 'custom/icons')
    expect(consoleSpy).toHaveBeenCalledWith('  • 图标来源:', 'custom')
  })

  it('应该在配置中注入桥接配置', () => {
    const plugin = vitePluginCachedIcon({
      apiEndpoint: '/custom/api',
      iconDir: 'custom/icons',
    })

    const mockConfig = { define: {} }
    const mockContext = { command: 'serve' as const }

    if (plugin.config) {
      plugin.config(mockConfig, mockContext)
    }

    // 应该注入桥接配置
    expect(mockConfig.define.__CACHED_ICON_CONFIG__).toBeDefined()

    // 解析注入的配置
    const injectedConfig = JSON.parse(mockConfig.define.__CACHED_ICON_CONFIG__)
    expect(injectedConfig.downloadApiEndpoint).toBe('/custom/api')
    expect(injectedConfig.iconPathPrefix).toBe('/custom/icons')
  })

  it('应该支持基于条件的自定义环境检测', () => {
    let shouldBeDev = false

    const plugin = vitePluginCachedIcon({
      isDevelopment: () => shouldBeDev,
    })

    const mockConfig = { define: {} }
    const mockContext = { command: 'build' as const }

    // 首次调用：生产模式
    if (plugin.config) {
      plugin.config(mockConfig, mockContext)
    }

    // 不应该显示开发模式提醒
    expect(consoleSpy).not.toHaveBeenCalledWith(
      '\x1b[36m%s\x1b[0m',
      '🔧 CachedIcon Vite 插件已启用 (开发模式)'
    )

    // 重置 mock
    consoleSpy.mockClear()

    // 改变条件
    shouldBeDev = true

    // 再次调用：开发模式
    if (plugin.config) {
      plugin.config(mockConfig, mockContext)
    }

    // 现在应该显示开发模式提醒
    expect(consoleSpy).toHaveBeenCalledWith(
      '\x1b[36m%s\x1b[0m',
      '🔧 CachedIcon Vite 插件已启用 (开发模式)'
    )
  })
})
