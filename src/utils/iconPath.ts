/**
 * 图标路径转换工具
 * 统一处理图标名称到文件路径的转换规则
 */

export interface IconPathConfig {
  /** 图标文件路径前缀 */
  iconPathPrefix?: string
  /** 是否按图标库分文件夹保存（默认：false） */
  organizeByLibrary?: boolean
}

export interface IconPathInfo {
  /** 图标库名称（如：mdi, heroicons） */
  library: string
  /** 图标名称（如：home, heart-20-solid） */
  name: string
  /** 文件名（如：home.svg, heart-20-solid.svg） */
  fileName: string
  /** 完整路径（如：/icons/mdi/home.svg 或 /icons/mdi-home.svg） */
  fullPath: string
}

/**
 * 解析图标名称，提取图标库和图标名称
 * @param iconName 图标名称（如：mdi:home, heroicons:heart-20-solid）
 * @returns 解析后的信息
 */
export function parseIconName(iconName: string): { library: string; name: string } {
  if (!iconName) {
    return { library: 'unknown', name: 'unknown' }
  }

  // 支持 : 分隔符（推荐格式）
  if (iconName.includes(':')) {
    const colonIndex = iconName.indexOf(':')
    const library = iconName.substring(0, colonIndex) || 'unknown'
    const name = iconName.substring(colonIndex + 1) || iconName
    return {
      library,
      name,
    }
  }

  // 支持 - 分隔符的传统格式（向后兼容）
  // 查找常见图标库前缀
  const commonLibraries = [
    'mdi', 'fa', 'fas', 'far', 'fab', 'heroicons', 'lucide', 
    'tabler', 'feather', 'bootstrap', 'material', 'ant-design',
    'carbon', 'fluent', 'iconify', 'simple-icons', 'devicons'
  ]

  for (const lib of commonLibraries) {
    if (iconName.startsWith(lib + '-')) {
      return {
        library: lib,
        name: iconName.substring(lib.length + 1),
      }
    }
  }

  // 如果没有识别出图标库，将整个名称作为图标名称
  return {
    library: 'custom',
    name: iconName,
  }
}

/**
 * 生成安全的文件名
 * 将不安全的字符替换为安全字符
 */
function sanitizeFileName(name: string): string {
  return name
    .replace(/[:/\\<>"|?*]/g, '-') // 替换文件系统不安全字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .replace(/^-|-$/g, '') // 去除首尾连字符
}

/**
 * 生成图标路径信息
 * @param iconName 图标名称
 * @param config 配置选项
 * @returns 图标路径信息
 */
export function generateIconPath(iconName: string, config: IconPathConfig = {}): IconPathInfo {
  const { iconPathPrefix = '/icons', organizeByLibrary = false } = config
  
  const { library, name } = parseIconName(iconName)
  const fileName = `${sanitizeFileName(name)}.svg`
  
  let fullPath: string
  
  if (organizeByLibrary) {
    // 按图标库分文件夹：/icons/mdi/home.svg
    const libraryFolder = sanitizeFileName(library)
    fullPath = `${iconPathPrefix}/${libraryFolder}/${fileName}`
  } else {
    // 扁平结构：/icons/mdi-home.svg
    const flatFileName = `${sanitizeFileName(library)}-${sanitizeFileName(name)}.svg`
    fullPath = `${iconPathPrefix}/${flatFileName}`
  }
  
  return {
    library,
    name,
    fileName,
    fullPath,
  }
}

/**
 * 向后兼容的文件名转换函数
 * 使用传统的 : 替换为 - 的方式
 * @deprecated 请使用 generateIconPath 函数
 */
export function legacyIconNameToFileName(iconName: string): string {
  return iconName.replace(/:/g, '-')
}