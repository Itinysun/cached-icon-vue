import type { Plugin } from 'vite'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import type { IconDownloaderOptions } from '../types'

const defaultOptions: Required<IconDownloaderOptions> = {
  iconDir: 'public/icons',
  iconSource: 'iconify',
  customUrlTemplate: '',
}

/**
 * Vite插件：开发模式下提供图标下载API
 */
export function vitePluginCachedIcon(options: IconDownloaderOptions = {}): Plugin {
  const opts = { ...defaultOptions, ...options }

  return {
    name: 'vite-plugin-cached-icon',
    configureServer(server) {
      // 只在开发模式下启用
      if (server.config.command !== 'serve') return

      server.middlewares.use('/api/download-icon', async (req, res) => {
        try {
          // 设置CORS头
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

          if (req.method === 'OPTIONS') {
            res.statusCode = 200
            res.end()
            return
          }

          if (req.method !== 'GET' && req.method !== 'POST') {
            res.statusCode = 405
            res.end('Method Not Allowed')
            return
          }

          // 获取图标名称参数
          let iconName = ''
          if (req.method === 'GET') {
            const url = new URL(req.url!, `http://${req.headers.host}`)
            iconName = url.searchParams.get('name') || ''
          } else if (req.method === 'POST') {
            // 处理POST请求体
            let body = ''
            req.on('data', chunk => {
              body += chunk.toString()
            })
            req.on('end', async () => {
              try {
                const data = JSON.parse(body)
                iconName = data.name || ''
                await processIconRequest(iconName, opts, res, server.config.root)
              } catch {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Invalid JSON' }))
              }
            })
            return
          }

          await processIconRequest(iconName, opts, res, server.config.root)
        } catch (error) {
          console.error('Icon downloader error:', error)
          res.statusCode = 500
          res.end(JSON.stringify({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
          }))
        }
      })
    },
  }
}

async function processIconRequest(
  iconName: string,
  opts: Required<IconDownloaderOptions>,
  res: { statusCode: number; end: (data: string) => void },
  root: string
) {
  if (!iconName) {
    res.statusCode = 400
    res.end(JSON.stringify({ error: 'Icon name is required' }))
    return
  }

  const iconDir = resolve(root, opts.iconDir)
  // 将冒号替换为短横线，确保文件名有效
  const fileName = iconName.replace(/:/g, '-')
  const iconPath = join(iconDir, `${fileName}.svg`)

  // 检查本地是否已存在
  if (existsSync(iconPath)) {
    // 读取现有的SVG内容
    const existingSvgContent = readFileSync(iconPath, 'utf8')

    res.statusCode = 200
    res.end(
      JSON.stringify({
        success: true,
        message: 'Icon already exists locally',
        path: iconPath,
        exists: true,
        svgContent: existingSvgContent, // 返回现有的SVG内容
      })
    )
    return
  }

  // 确保目录存在
  if (!existsSync(iconDir)) {
    mkdirSync(iconDir, { recursive: true })
  }

  try {
    // 下载图标
    const svgContent = await downloadIcon(iconName, opts)

    if (!svgContent) {
      res.statusCode = 404
      res.end(
        JSON.stringify({
          success: false,
          error: 'Icon not found',
          exists: false,
        })
      )
      return
    }

    // 保存到本地
    writeFileSync(iconPath, svgContent)

    res.statusCode = 200
    res.end(
      JSON.stringify({
        success: true,
        message: 'Icon downloaded successfully',
        path: iconPath,
        exists: false,
        downloaded: true,
        svgContent: svgContent, // 返回SVG内容
      })
    )
  } catch (error) {
    res.statusCode = 500
    res.end(
      JSON.stringify({
        success: false,
        error: 'Failed to download icon',
        details: error instanceof Error ? error.message : 'Unknown error',
        exists: false,
      })
    )
  }
}

async function downloadIcon(
  iconName: string,
  opts: Required<IconDownloaderOptions>
): Promise<string | null> {
  if (opts.iconSource === 'iconify') {
    return await downloadFromIconify(iconName)
  } else if (opts.customUrlTemplate) {
    return await downloadFromCustomUrl(iconName, opts.customUrlTemplate)
  }

  throw new Error('No valid icon source configured')
}

async function downloadFromIconify(iconName: string): Promise<string | null> {
  try {
    // 支持多种iconify格式: mdi:home, mdi-home, ic:round-home等
    let collection = ''
    let name = ''

    if (iconName.includes(':')) {
      const parts = iconName.split(':')
      collection = parts[0] || 'mdi'
      name = parts[1] || iconName
    } else if (iconName.includes('-')) {
      // 尝试从常见的集合中猜测
      const commonCollections = [
        'mdi',
        'ic',
        'heroicons',
        'tabler',
        'carbon',
        'fa',
        'material-symbols',
      ]

      for (const col of commonCollections) {
        if (iconName.startsWith(col + '-')) {
          collection = col
          name = iconName.substring(col.length + 1)
          break
        }
      }

      if (!collection) {
        // 默认使用mdi
        collection = 'mdi'
        name = iconName
      }
    } else {
      collection = 'mdi'
      name = iconName
    }

    const url = `https://api.iconify.design/${collection}/${name}.svg`

    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const svgContent = await response.text()

    // 验证是否为有效的SVG
    if (!svgContent.includes('<svg')) {
      throw new Error('Invalid SVG content')
    }

    return svgContent
  } catch (error) {
    console.error(`Failed to download from iconify:`, error)
    throw error
  }
}

async function downloadFromCustomUrl(
  iconName: string,
  urlTemplate: string
): Promise<string | null> {
  try {
    const url = urlTemplate.replace('{name}', iconName)
    console.log(`📥 Downloading from custom URL: ${url}`)

    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const svgContent = await response.text()

    if (!svgContent.includes('<svg')) {
      throw new Error('Invalid SVG content')
    }

    return svgContent
  } catch (error) {
    console.error(`Failed to download from custom URL:`, error)
    throw error
  }
}

// 导出插件 - vitePluginCachedIcon 已在上面export function中导出
export const VitePluginCachedIcon = vitePluginCachedIcon
export default vitePluginCachedIcon
