import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createApp } from 'vue'
import { install } from '../../src/index'

describe('插件安装时的自定义环境检测', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    // 清除全局对象
    if (typeof window !== 'undefined') {
      delete (window as { CachedIcon?: unknown }).CachedIcon
    }
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('应该使用默认环境检测（测试环境通常是开发模式）', () => {
    const app = createApp({})

    // 不传入选项，应该使用默认检测
    install(app)

    // 在测试环境中通常检测到开发模式，应该显示提醒
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('🚀 CachedIcon 开发模式已启用'),
      expect.any(String),
      expect.not.stringContaining('使用了用户自定义的环境检测函数')
    )
  })

  it('应该使用自定义环境检测（强制开发模式）', () => {
    const app = createApp({})

    // 传入自定义检测函数，强制返回开发模式
    install(app, {
      isDevelopment: () => true,
    })

    // 应该显示开发模式提醒
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('🚀 CachedIcon 开发模式已启用'),
      expect.any(String),
      expect.stringContaining('使用了用户自定义的环境检测函数')
    )
  })

  it('应该使用自定义环境检测（强制生产模式）', () => {
    const app = createApp({})

    // 传入自定义检测函数，强制返回生产模式
    install(app, {
      isDevelopment: () => false,
    })

    // 在生产模式下不应该显示开发模式启用信息，但仍会有调试信息
    const calls = consoleSpy.mock.calls
    const hasDevModeMessage = calls.some(call =>
      call.some(arg => typeof arg === 'string' && arg.includes('CachedIcon 开发模式已启用'))
    )
    expect(hasDevModeMessage).toBe(false)
  })

  it('应该根据hostname判断环境', () => {
    const app = createApp({})

    // 模拟 localhost 环境
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
      },
      writable: true,
    })

    // 传入基于hostname的检测函数
    install(app, {
      isDevelopment: () => window.location.hostname === 'localhost',
    })

    // 应该显示开发模式提醒
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('🚀 CachedIcon 开发模式已启用'),
      expect.any(String),
      expect.stringContaining('使用了用户自定义的环境检测函数')
    )
  })

  it('应该在开发模式下暴露调试函数到全局对象', () => {
    const app = createApp({})

    install(app, {
      isDevelopment: () => true,
    })

    // 应该在window对象上暴露调试函数
    expect(typeof (window as { CachedIcon?: { debugEnv?: () => void } }).CachedIcon?.debugEnv).toBe(
      'function'
    )
  })

  it('应该正确设置全局配置', () => {
    const app = createApp({})
    const customConfig = {
      isDevelopment: () => true,
      cacheExpireTime: 3600000,
    }

    install(app, customConfig)

    // 检查全局属性是否正确设置
    expect(app.config.globalProperties.$cachedIcon).toEqual(customConfig)
  })
})
