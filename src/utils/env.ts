/**
 * 环境检测工具函数
 * 提供统一的开发环境识别逻辑，支持用户自定义
 */

/**
 * 默认的开发环境检测函数
 * 按优先级检查不同的环境变量
 * 使用动态检查避免构建时优化
 */
export function defaultIsDevelopment(): boolean {
  try {
    // 动态检查 import.meta.env 避免构建时优化
    // 使用 eval 防止构建时被优化掉
    const importMeta = new Function('return typeof import !== "undefined" ? import.meta : null')()
    if (importMeta && importMeta.env) {
      // 优先使用 import.meta.env.DEV（Vite 环境）
      if (typeof importMeta.env.DEV === 'boolean') {
        return importMeta.env.DEV
      }

      // 其次检查 MODE
      if (importMeta.env.MODE === 'development') {
        return true
      }
    }
  } catch {
    // 如果无法获取 import.meta，继续其他检查
  }

  // 检查 NODE_ENV（Node.js 环境）
  if (typeof globalThis !== 'undefined') {
    const global = globalThis as { process?: { env?: { NODE_ENV?: string } } }
    if (global.process?.env?.NODE_ENV === 'development') {
      return true
    }
  }

  // 检查 window.location（浏览器环境）
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return true
    }
  }

  return false
}

/**
 * 创建环境检测器工厂函数
 * 支持用户自定义检测逻辑
 */
export function createEnvironmentDetector(customDetector?: () => boolean): () => boolean {
  if (typeof customDetector === 'function') {
    return customDetector
  } else {
    // 如果没有提供自定义检测，使用默认检测
    console.log(
      '%c⚠️ CachedIcon 使用默认的开发环境检测函数,请阅读文档了解如何自定义',
      'color: #ff6b35; font-weight: bold; background: #fff3e0; padding: 4px 12px; border-radius: 6px; border-left: 3px solid #ff6b35;'
    )
    return defaultIsDevelopment
  }
}

/**
 * 默认的生产环境检测函数
 */
export function defaultIsProduction(): boolean {
  return !defaultIsDevelopment()
}

/**
 * 获取当前环境模式
 */
export function getEnvironmentMode(): string {
  try {
    // 动态检查 import.meta.env 避免构建时优化
    const importMeta = new Function('return typeof import !== "undefined" ? import.meta : null')()
    if (importMeta && importMeta.env && importMeta.env.MODE) {
      return importMeta.env.MODE
    }
  } catch {
    // 如果无法获取 import.meta，继续其他检查
  }

  if (typeof globalThis !== 'undefined') {
    const global = globalThis as { process?: { env?: { NODE_ENV?: string } } }
    if (global.process?.env?.NODE_ENV) {
      return global.process.env.NODE_ENV
    }
  }

  return 'production'
}

/**
 * 环境检测器类型定义
 */
export type EnvironmentDetector = () => boolean

/**
 * 创建带有优先级的环境检测器
 * 按照优先级顺序检查多个检测器
 */
export function createPriorityEnvironmentDetector(
  ...detectors: (EnvironmentDetector | undefined)[]
): EnvironmentDetector {
  return () => {
    for (const detector of detectors) {
      if (detector) {
        return detector()
      }
    }
    return defaultIsDevelopment()
  }
}

/**
 * 调试环境检测的工具函数
 * 在开发模式下打印环境检测信息
 */
export function debugEnvironmentDetection(customDetector?: () => boolean): void {
  console.group('🔍 CachedIcon 环境检测信息')
  console.log('当前环境模式:', getEnvironmentMode())
  console.log('import.meta.env.DEV:', import.meta.env?.DEV)
  console.log('import.meta.env.MODE:', import.meta.env?.MODE)
  console.log(
    'process.env.NODE_ENV:',
    typeof globalThis !== 'undefined'
      ? (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV
      : '未定义'
  )
  
  // 检查是否使用自定义环境检测函数
  const isUsingCustomDetector = typeof customDetector === 'function'
  const detector = isUsingCustomDetector ? customDetector : defaultIsDevelopment
  const result = detector()
  
  console.log('使用自定义环境检测:', isUsingCustomDetector ? '是' : '否')
  if (isUsingCustomDetector) {
    console.log('自定义检测函数结果:', result ? '开发环境' : '生产环境')
  }
  console.log('默认检测函数结果:', defaultIsDevelopment() ? '开发环境' : '生产环境')
  console.log('最终检测结果:', result ? '开发环境' : '生产环境')
  console.groupEnd()
}
