// vite.config.ts 使用示例 (支持 Vite 6.x+)
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginCachedIcon } from 'cached-icon-vue'

export default defineConfig({
  plugins: [
    vue(),

    // 基础配置 - 从 Iconify 下载图标
    vitePluginCachedIcon({
      iconDir: 'public/icons', // 图标保存目录
      iconSource: 'iconify', // 使用 Iconify API
    }),

    // 高级配置 - 使用自定义图标源
    // vitePluginCachedIcon({
    //   iconDir: 'public/custom-icons',
    //   iconSource: 'custom',
    //   customUrlTemplate: 'https://your-icon-cdn.com/icons/{name}.svg'
    // }),
  ],

  // Vite 6.x 配置
  server: {
    port: 5173,
    open: true,
    host: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  // 现代化优化
  optimizeDeps: {
    include: ['vue'],
  },
})

/*
插件功能说明：

1. 开发环境下自动启用 `/api/download-icon` API 端点
2. 支持 GET 和 POST 请求下载图标
3. 自动保存图标到指定目录（iconDir）
4. 支持多种图标源：
   - iconify: 从 Iconify API 下载图标
   - custom: 从自定义URL模板下载图标

5. API 使用示例：
   GET: /api/download-icon?name=mdi:home
   POST: { "name": "mdi:home" }

6. 响应格式：
   {
     "success": true,
     "message": "Icon downloaded successfully",
     "path": "/path/to/icon.svg",
     "exists": false,
     "downloaded": true,
     "svgContent": "<svg>...</svg>"
   }

7. 支持的图标格式：
   - mdi:home (Material Design Icons)
   - ic:round-home (Iconify Collections)
   - heroicons:home-20-solid (Heroicons)
   - tabler:home (Tabler Icons)
   - 以及更多...
*/
