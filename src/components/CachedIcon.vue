<script lang="ts" setup>
import { computed, ref, watchEffect, onMounted, h, inject } from 'vue'
import type { Component, VNode } from 'vue'
import type { CachedIconProps, CachedIconConfig } from '../types'
import { iconCache } from '../utils/iconCache'
import { iconDownloader } from '../utils/iconDownloader'
import LoadingIcon from './LoadingIcon.vue'
import ErrorIcon from './ErrorIcon.vue'
import DefaultIcon from './DefaultIcon.vue'

const props = withDefaults(defineProps<CachedIconProps>(), {
  name: 'mdi:alert-circle',
  icon: '',
  size: '1em',
  autoDownload: true,
  showLoadingState: true,
  showErrorState: true,
})

// 全局SVG内容缓存 - 所有组件实例共享
declare global {
  interface Window {
    __iconSvgCache?: Map<string, string>
  }
}

const svgCache = (() => {
  if (!window.__iconSvgCache) {
    window.__iconSvgCache = new Map<string, string>()
  }
  return window.__iconSvgCache
})()

const iconName = computed(() => props.icon || props.name)
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const iconComponent = ref<Component | null>(null)

// 从全局配置中获取设置
const globalConfig = inject<CachedIconConfig>('cached-icon-options', {})

// 获取 Vite 插件注入的配置
const vitePluginConfig =
  typeof window !== 'undefined'
    ? (window as { __CACHED_ICON_CONFIG__?: Partial<CachedIconConfig> }).__CACHED_ICON_CONFIG__ ||
      {}
    : ({} as Partial<CachedIconConfig>)

// 配置对象，合并 Vite 插件配置、全局配置和默认配置
const config: CachedIconConfig = {
  isDevelopment:
    globalConfig.isDevelopment ||
    vitePluginConfig.isDevelopment ||
    (() => {
      // 优先使用 import.meta.env.DEV，如果不存在则检查 NODE_ENV
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
    }),
  iconPathPrefix: globalConfig.iconPathPrefix || vitePluginConfig.iconPathPrefix || '/icons',
  downloadApiEndpoint:
    globalConfig.downloadApiEndpoint ||
    vitePluginConfig.downloadApiEndpoint ||
    '/api/download-icon',
  cacheExpireTime: globalConfig.cacheExpireTime || 24 * 60 * 60 * 1000,
  storageKey: globalConfig.storageKey || 'cached-icon-cache-v1',
}

// 处理尺寸
const sizeStyle = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }
  return props.size
})

/**
 * 直接加载图标组件 - 支持SVG内联显示
 */
const loadIconComponent = async (iconName: string) => {
  try {
    const fileName = iconName.replace(/:/g, '-')
    const iconPath = `${config.iconPathPrefix}/${fileName}.svg`

    // 检查缓存
    if (svgCache.has(iconPath)) {
      const cachedSvg = svgCache.get(iconPath)!
      return createSvgComponent(cachedSvg)
    }

    // 直接获取SVG内容
    const response = await fetch(iconPath)
    if (response.ok) {
      const svgContent = await response.text()

      // 验证返回的内容是否真的是SVG
      if (
        !svgContent.includes('<svg') ||
        svgContent.includes('<!doctype html>') ||
        svgContent.includes('<html')
      ) {
        return null
      }

      // 验证SVG内容的合理性（长度检查）
      if (svgContent.length < 50) {
        return null
      }

      // 缓存SVG内容
      svgCache.set(iconPath, svgContent)

      return createSvgComponent(svgContent)
    } else {
      return null
    }
  } catch {
    return null
  }
}

/**
 * 创建SVG组件
 */
const createSvgComponent = (svgContent: string) => {
  return () =>
    h('div', {
      innerHTML: svgContent,
      style: {
        width: '100%',
        height: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      onVnodeMounted: (vnode: VNode) => {
        // 在SVG挂载后设置属性
        const svgElement = (vnode.el as Element)?.querySelector('svg')
        if (svgElement) {
          svgElement.setAttribute('width', '100%')
          svgElement.setAttribute('height', '100%')
          svgElement.style.display = 'block'

          // 设置 fill 和 stroke 为 currentColor，使其能够继承父元素颜色
          const elements = svgElement.querySelectorAll(
            'path, circle, rect, polygon, polyline, line, ellipse'
          )
          elements.forEach((element: Element) => {
            const svgElement = element as SVGElement
            if (svgElement.getAttribute('fill') && svgElement.getAttribute('fill') !== 'none') {
              svgElement.setAttribute('fill', 'currentColor')
            }
            if (svgElement.getAttribute('stroke') && svgElement.getAttribute('stroke') !== 'none') {
              svgElement.setAttribute('stroke', 'currentColor')
            }
          })
        }
      },
    })
}

/**
 * 从缓存中获取图标组件
 */
const getIconFromCache = (name: string): Component | null => {
  const cacheEntry = iconCache.get(name)

  // 优先使用iconCache中缓存的SVG内容
  if (iconCache.isKnownToExist(name) && cacheEntry?.svgContent) {
    return createSvgComponent(cacheEntry.svgContent)
  }

  // 检查全局svgCache缓存
  const fileName = name.replace(/:/g, '-')
  const iconPath = `${config.iconPathPrefix}/${fileName}.svg`
  if (svgCache.has(iconPath)) {
    const cachedSvg = svgCache.get(iconPath)!
    // 同时更新iconCache
    iconCache.markAsExists(name, cachedSvg)
    return createSvgComponent(cachedSvg)
  }

  return null
}

// 加载图标
const loadIcon = async (name: string) => {
  try {
    isLoading.value = true
    hasError.value = false
    errorMessage.value = ''

    // 再次检查缓存（可能在等待期间被其他组件加载了）
    const cachedComponent = getIconFromCache(name)
    if (cachedComponent) {
      iconComponent.value = cachedComponent
      return true
    }

    // 如果图标正在下载，等待下载完成
    if (iconCache.isDownloading(name)) {
      const downloadPromise = iconCache.getDownloadPromise(name)
      if (downloadPromise) {
        try {
          const result = await downloadPromise
          if (result.success) {
            if (result.svgContent) {
              const component = createSvgComponent(result.svgContent)
              iconComponent.value = component
              return true
            }
            const component = await loadIconComponent(name)
            if (component) {
              iconComponent.value = component
              return true
            }
          }
        } catch {
          // 忽略下载Promise错误，继续正常流程
        }
      }
    }

    // 尝试从网络加载图标
    const component = await loadIconComponent(name)
    if (component) {
      iconComponent.value = component
      // 将加载到的SVG内容保存到缓存中
      const fileName = name.replace(/:/g, '-')
      const iconPath = `${config.iconPathPrefix}/${fileName}.svg`
      const cachedSvg = svgCache.get(iconPath)
      iconCache.markAsExists(name, cachedSvg)
      return true
    }

    // 本地图标不存在，尝试自动下载（仅在开发环境）
    if (props.autoDownload && config.isDevelopment?.()) {
      // 检查是否最近下载失败过
      if (iconCache.hasFailed(name)) {
        const cacheEntry = iconCache.get(name)
        const timeSinceFailure = Date.now() - (cacheEntry?.lastChecked || 0)
        const retryDelay = 30000 // 开发环境30秒重试

        if (timeSinceFailure < retryDelay) {
          hasError.value = true
          errorMessage.value = `图标下载失败，${Math.ceil(
            (retryDelay - timeSinceFailure) / 1000
          )}秒后可重试`
          return false
        }
      }

      try {
        const result = await iconDownloader.downloadIcon(name)

        if (result.success) {
          if (result.downloaded) {
            iconCache.markAsDownloaded(name, result.svgContent || '')
          } else if (result.exists) {
            iconCache.markAsExists(name, result.svgContent || '')
          }

          // 下载/存在检查完成后，优先使用返回的SVG内容
          if (result.svgContent) {
            const component = createSvgComponent(result.svgContent)
            iconComponent.value = component
            return true
          }

          // 如果没有返回SVG内容，尝试从本地加载
          const retryComponent = await loadIconComponent(name)
          if (retryComponent) {
            iconComponent.value = retryComponent
            return true
          } else {
            hasError.value = true
            errorMessage.value = '图标处理完成，但加载失败，请刷新页面'
          }
        } else {
          iconCache.markAsFailed(name, result.error || '下载失败')
          hasError.value = true
          errorMessage.value = result.error || '图标下载失败'
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '未知错误'
        iconCache.markAsFailed(name, errorMsg)
        hasError.value = true
        errorMessage.value = `下载失败: ${errorMsg}`
      }
    } else {
      // 未启用自动下载或非开发环境
      iconCache.markAsFailed(
        name,
        config.isDevelopment?.()
          ? '图标不存在且未启用自动下载'
          : '图标不存在（自动下载仅在开发环境可用）'
      )
      hasError.value = true
      errorMessage.value = config.isDevelopment?.() ? '图标不存在' : '图标不存在'
    }

    return false
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '未知错误'
    iconCache.markAsFailed(name, errorMsg)
    hasError.value = true
    errorMessage.value = errorMsg
    return false
  } finally {
    isLoading.value = false
  }
}

// 当前要渲染的组件
const currentComponent = computed(() => {
  if (isLoading.value && props.showLoadingState) {
    return LoadingIcon
  }

  if (hasError.value && props.showErrorState) {
    return ErrorIcon
  }

  return iconComponent.value || DefaultIcon
})

// 监听图标名称变化
watchEffect(async () => {
  const name = iconName.value
  if (!name) return

  // 尝试从缓存获取图标
  const cachedComponent = getIconFromCache(name)
  if (cachedComponent) {
    iconComponent.value = cachedComponent
    return
  }

  // 只有在缓存中没有找到时才进行加载
  await loadIcon(name)
})

// 组件挂载时初始化
onMounted(() => {
  // 如果在挂载时已经有缓存，直接使用，避免watchEffect触发网络请求
  const name = iconName.value
  if (name) {
    const cachedComponent = getIconFromCache(name)
    if (cachedComponent) {
      iconComponent.value = cachedComponent
    }
  }
})

// 导出配置修改接口
defineExpose({
  updateConfig: (newConfig: Partial<CachedIconConfig>) => {
    Object.assign(config, newConfig)
  },
})
</script>

<template>
  <div
    :class="[
      'relative inline-flex items-center justify-center',
      props.class,
      {
        'animate-pulse': isLoading && props.showLoadingState,
        'text-red-500': hasError && props.showErrorState,
      },
    ]"
    :style="{ width: sizeStyle, height: sizeStyle }"
    :title="
      config.isDevelopment?.()
        ? `${iconName}${hasError ? ': ' + errorMessage : ''}${isLoading ? '\n状态: 加载中...' : ''}`
        : hasError
          ? errorMessage
          : undefined
    "
  >
    <!-- 动态渲染图标组件 -->
    <component
      :is="currentComponent"
      :style="{ width: sizeStyle, height: sizeStyle }"
      class="inline-block"
    />

    <!-- 开发环境下的状态指示器 -->
    <template v-if="config.isDevelopment?.() && (isLoading || hasError)">
      <!-- 加载指示器 -->
      <div
        v-if="isLoading && props.showLoadingState"
        class="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-blue-500"
        title="Loading icon..."
      ></div>

      <!-- 错误指示器 -->
      <div
        v-if="hasError && props.showErrorState"
        class="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"
        :title="`Failed to load: ${errorMessage}`"
      ></div>
    </template>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
