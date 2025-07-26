import type { IconDownloaderOptions } from '../types'

/**
 * 将 Vite 插件配置转换为前端组件配置
 */
export function createConfigBridge(options: IconDownloaderOptions) {
  // 计算 iconPathPrefix
  const iconPathPrefix = options.iconDir?.startsWith('public/')
    ? `/${options.iconDir.replace('public/', '')}`
    : `/${options.iconDir || 'icons'}`

  return {
    iconPathPrefix,
    downloadApiEndpoint: options.apiEndpoint || '/api/download-icon',
    isDevelopment: () => {
      if (typeof import.meta.env?.DEV === 'boolean') {
        return import.meta.env.DEV
      }
      return (
        import.meta.env?.MODE === 'development' ||
        (typeof globalThis !== 'undefined' &&
          (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV ===
            'development') ||
        false
      )
    },
  }
}

/**
 * 在开发环境中注入配置到 window 对象
 */
export function injectConfigToWindow(options: IconDownloaderOptions) {
  if (typeof window !== 'undefined') {
    const config = createConfigBridge(options)
    ;(window as { __CACHED_ICON_CONFIG__?: Record<string, unknown> }).__CACHED_ICON_CONFIG__ =
      config
  }
}
