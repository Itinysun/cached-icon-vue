import type { App } from 'vue'
import CachedIcon from './components/CachedIcon.vue'
import LoadingIcon from './components/LoadingIcon.vue'
import ErrorIcon from './components/ErrorIcon.vue'
import DefaultIcon from './components/DefaultIcon.vue'
import { debugEnvironmentDetection, createEnvironmentDetector } from './utils/env'
import type { CachedIconInstallOptions } from './types'

// 导出组件
export { CachedIcon, LoadingIcon, ErrorIcon, DefaultIcon }

// 导出工具类和类型
export { iconCache, IconCacheManager } from './utils/iconCache'
export { iconDownloader, IconDownloader } from './utils/iconDownloader'
export { generateIconPath, parseIconName, legacyIconNameToFileName } from './utils/iconPath'
export {
  defaultIsDevelopment,
  createEnvironmentDetector,
  createPriorityEnvironmentDetector,
  debugEnvironmentDetection,
  getEnvironmentMode,
} from './utils/env'

// 注意：Vite 插件从 'cached-icon-vue/vite-plugin' 导入
// 不在主入口导出避免 Node.js 模块被包含在客户端代码中

// 导出类型和枚举
export type {
  CachedIconProps,
  IconDownloadResult,
  IconCacheEntry,
  IconCacheStats,
  CachedIconConfig,
  IconDownloaderOptions,
  CachedIconInstallOptions,
} from './types'
export type { IconPathConfig, IconPathInfo } from './utils/iconPath'
export { IconStatus } from './types'

// 插件安装函数
export const install = (app: App, options?: CachedIconInstallOptions) => {
  // 创建环境检测器，优先使用用户自定义的检测函数
  const environmentDetector = createEnvironmentDetector(options?.isDevelopment)

  // 开发模式提醒
  if (environmentDetector()) {
    console.log(
      '%c🚀 CachedIcon 开发模式已启用',
      'color: #42b883; font-weight: bold; background: #f0f9ff; padding: 2px 8px; border-radius: 4px;',
      '\n• 图标自动下载功能已启用\n• 支持用户自定义环境检测' +
        (options?.isDevelopment ? '\n• 使用了用户自定义的环境检测函数' : '') +
        '\n• 使用 window.CachedIcon?.debugEnv() 查看详细环境信息'
    )

    // 在全局对象上暴露调试函数
    if (typeof window !== 'undefined') {
      ;(window as { CachedIcon?: { debugEnv: () => void } }).CachedIcon = {
        debugEnv: () => debugEnvironmentDetection(options?.isDevelopment),
      }
    }
  }

  // 注册全局组件
  app.component('CachedIcon', CachedIcon)
  app.component('LoadingIcon', LoadingIcon)
  app.component('ErrorIcon', ErrorIcon)
  app.component('DefaultIcon', DefaultIcon)

  // 如果提供了选项，进行全局配置
  if (options) {
    // 设置全局配置
    app.config.globalProperties.$cachedIcon = options
    app.provide('cached-icon-options', options)
  }
}

// 默认导出
const CachedIconVue = {
  install,
  CachedIcon,
  LoadingIcon,
  ErrorIcon,
  DefaultIcon,
}

export default CachedIconVue
