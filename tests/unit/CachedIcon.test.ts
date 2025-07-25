import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CachedIcon from '../../src/components/CachedIcon.vue'
import LoadingIcon from '../../src/components/LoadingIcon.vue'
import ErrorIcon from '../../src/components/ErrorIcon.vue'
import DefaultIcon from '../../src/components/DefaultIcon.vue'

// Mock fetch
global.fetch = vi.fn()

// Mock window.__iconSvgCache
Object.defineProperty(window, '__iconSvgCache', {
  value: new Map(),
  writable: true,
})

describe('CachedIcon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.__iconSvgCache?.clear()
  })

  describe('基础渲染', () => {
    it('应该使用默认属性渲染', () => {
      const wrapper = mount(CachedIcon)

      expect(wrapper.classes()).toContain('relative')
      expect(wrapper.classes()).toContain('inline-flex')
      expect(wrapper.classes()).toContain('items-center')
      expect(wrapper.classes()).toContain('justify-center')
    })

    it('应该应用自定义类名', () => {
      const customClass = 'custom-icon-class'
      const wrapper = mount(CachedIcon, {
        props: {
          class: customClass,
        },
      })

      expect(wrapper.classes()).toContain(customClass)
    })

    it('应该设置正确的尺寸样式', () => {
      const wrapper = mount(CachedIcon, {
        props: {
          size: '32px',
        },
      })

      expect(wrapper.attributes('style')).toContain('width: 32px')
      expect(wrapper.attributes('style')).toContain('height: 32px')
    })

    it('应该支持数字尺寸', () => {
      const wrapper = mount(CachedIcon, {
        props: {
          size: 24,
        },
      })

      expect(wrapper.attributes('style')).toContain('width: 24px')
      expect(wrapper.attributes('style')).toContain('height: 24px')
    })
  })

  describe('图标名称处理', () => {
    it('应该优先使用 icon 属性而不是 name', () => {
      const wrapper = mount(CachedIcon, {
        props: {
          name: 'mdi:home',
          icon: 'mdi:star',
        },
      })

      // 检查是否使用了 icon 属性的值
      expect(wrapper.vm.iconName).toBe('mdi:star')
    })

    it('应该在没有 icon 时使用 name 属性', () => {
      const wrapper = mount(CachedIcon, {
        props: {
          name: 'mdi:heart',
        },
      })

      expect(wrapper.vm.iconName).toBe('mdi:heart')
    })
  })

  describe('状态显示', () => {
    it('应该显示加载状态', async () => {
      // Mock fetch to return a pending promise
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockReturnValue(new Promise(() => {})) // Never resolves

      const wrapper = mount(CachedIcon, {
        props: {
          name: 'mdi:loading',
          showLoadingState: true,
        },
      })

      // 等待组件更新
      await wrapper.vm.$nextTick()

      // 应该包含加载状态的类
      expect(wrapper.classes()).toContain('animate-pulse')
    })

    it('应该能够隐藏加载状态', async () => {
      const wrapper = mount(CachedIcon, {
        props: {
          name: 'mdi:no-loading',
          showLoadingState: false,
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).not.toContain('animate-pulse')
    })

    it('应该显示错误状态', async () => {
      // Mock fetch to reject
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockRejectedValue(new Error('Network error'))

      const wrapper = mount(CachedIcon, {
        props: {
          name: 'mdi:error-test',
          showErrorState: true,
          autoDownload: false, // 禁用自动下载以触发错误状态
        },
      })

      // 等待组件处理错误
      await new Promise(resolve => setTimeout(resolve, 100))
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('text-red-500')
    })

    it('应该能够隐藏错误状态', async () => {
      const wrapper = mount(CachedIcon, {
        props: {
          name: 'mdi:no-error',
          showErrorState: false,
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).not.toContain('text-red-500')
    })
  })

  describe('SVG 缓存', () => {
    it('应该使用缓存的 SVG 内容', async () => {
      const svgContent = '<svg><path d="test"/></svg>'
      const iconName = 'mdi:cached'

      // 添加到缓存
      window.__iconSvgCache?.set(`/icons/${iconName.replace(/:/g, '-')}.svg`, svgContent)

      const wrapper = mount(CachedIcon, {
        props: {
          name: iconName,
        },
      })

      await wrapper.vm.$nextTick()

      // 应该渲染 SVG 内容或者至少不显示默认图标
      const defaultIcon = wrapper.findComponent(DefaultIcon)
      expect(defaultIcon.exists()).toBeFalsy()
    })

    it('应该处理无效的 SVG 内容', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<!doctype html><html>Not an SVG</html>'),
      } as Response)

      const wrapper = mount(CachedIcon, {
        props: {
          name: 'mdi:invalid-svg',
          autoDownload: false,
        },
      })

      await new Promise(resolve => setTimeout(resolve, 100))
      await wrapper.vm.$nextTick()

      // 应该显示默认图标或错误状态
      const defaultIcon = wrapper.findComponent(DefaultIcon)
      const errorIcon = wrapper.findComponent(ErrorIcon)
      expect(defaultIcon.exists() || errorIcon.exists()).toBeTruthy()
    })
  })

  describe('配置更新', () => {
    it('应该支持运行时配置更新', () => {
      const wrapper = mount(CachedIcon, {
        props: {
          name: 'mdi:config-test',
        },
      })

      // 测试 updateConfig 方法
      expect(() => {
        wrapper.vm.updateConfig({
          isDevelopment: () => false,
          iconPathPrefix: '/custom-icons',
        })
      }).not.toThrow()
    })
  })

  describe('组件集成', () => {
    it('应该渲染 LoadingIcon 组件', () => {
      const wrapper = mount(LoadingIcon)

      expect(wrapper.find('svg').exists()).toBeTruthy()
      expect(wrapper.find('circle').exists()).toBeTruthy()
      expect(wrapper.find('animate').exists()).toBeTruthy()
    })

    it('应该渲染 ErrorIcon 组件', () => {
      const wrapper = mount(ErrorIcon)

      expect(wrapper.find('svg').exists()).toBeTruthy()
      expect(wrapper.find('path').exists()).toBeTruthy()
    })

    it('应该渲染 DefaultIcon 组件', () => {
      const wrapper = mount(DefaultIcon)

      expect(wrapper.find('svg').exists()).toBeTruthy()
      expect(wrapper.find('circle').exists()).toBeTruthy()
    })
  })

  describe('响应式属性', () => {
    it('应该响应属性变化', async () => {
      const wrapper = mount(CachedIcon, {
        props: {
          name: 'mdi:initial',
          size: '16px',
        },
      })

      // 更改属性
      await wrapper.setProps({
        name: 'mdi:updated',
        size: '24px',
      })

      expect(wrapper.vm.iconName).toBe('mdi:updated')
      expect(wrapper.attributes('style')).toContain('width: 24px')
      expect(wrapper.attributes('style')).toContain('height: 24px')
    })
  })

  describe('事件处理', () => {
    it('应该处理挂载生命周期', () => {
      const wrapper = mount(CachedIcon, {
        props: {
          name: 'mdi:mounted',
        },
      })

      expect(wrapper.vm).toBeTruthy()
      expect(wrapper.isVisible()).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('应该处理空的图标名称', () => {
      const wrapper = mount(CachedIcon, {
        props: {
          name: '',
        },
      })

      expect(wrapper.isVisible()).toBeTruthy()
      // 应该显示默认图标
      expect(wrapper.findComponent(DefaultIcon).exists()).toBeTruthy()
    })

    it('应该处理网络错误', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockRejectedValue(new Error('Network error'))

      const wrapper = mount(CachedIcon, {
        props: {
          name: 'mdi:network-error',
          autoDownload: false,
        },
      })

      await new Promise(resolve => setTimeout(resolve, 100))
      await wrapper.vm.$nextTick()

      // 应该处理错误而不崩溃
      expect(wrapper.isVisible()).toBeTruthy()
    })
  })
})
