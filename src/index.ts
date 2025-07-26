import type { App } from 'vue'
import CachedIcon from './components/CachedIcon.vue'
import LoadingIcon from './components/LoadingIcon.vue'
import ErrorIcon from './components/ErrorIcon.vue'
import DefaultIcon from './components/DefaultIcon.vue'

// 导出组件
export { CachedIcon, LoadingIcon, ErrorIcon, DefaultIcon }

// 导出工具类和类型
export { iconCache, IconCacheManager } from './utils/iconCache'
export { iconDownloader, IconDownloader } from './utils/iconDownloader'

// 导出 Vite 插件
export { vitePluginCachedIcon, VitePluginCachedIcon } from './vite-plugin'

// 注意：Vite 插件也可以从 'cached-icon-vue/vite-plugin' 单独导入

// 导出类型和枚举
export type {
  CachedIconProps,
  IconDownloadResult,
  IconCacheEntry,
  IconCacheStats,
  CachedIconConfig,
  IconDownloaderOptions,
} from './types'
export { IconStatus } from './types'

// 插件安装函数
export const install = (app: App, options?: Record<string, unknown>) => {
  // 注册全局组件
  app.component('CachedIcon', CachedIcon)
  app.component('LoadingIcon', LoadingIcon)
  app.component('ErrorIcon', ErrorIcon)
  app.component('DefaultIcon', DefaultIcon)

  // 如果提供了选项，可以在这里进行全局配置
  if (options) {
    // 例如：配置全局选项
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
