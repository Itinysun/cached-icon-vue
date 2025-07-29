# 图标路径转换详细说明

## 概述

cached-icon-vue 提供了统一的图标路径转换系统，支持智能解析图标名称并生成相应的文件路径。该系统支持两种文件组织方式：扁平结构和按图标库分文件夹。

## 核心功能

### 1. 图标名称解析

组件能够智能解析多种图标名称格式：

#### 支持的格式

**冒号分隔符（推荐）：**
- `mdi:home` → 库: `mdi`, 名称: `home`
- `heroicons:heart-20-solid` → 库: `heroicons`, 名称: `heart-20-solid`
- `fa:solid:user` → 库: `fa`, 名称: `solid:user`

**连字符分隔符（向后兼容）：**
- `mdi-home` → 库: `mdi`, 名称: `home`
- `fa-user` → 库: `fa`, 名称: `user`
- `heroicons-heart-20-solid` → 库: `heroicons`, 名称: `heart-20-solid`

**自定义图标：**
- `my-custom-icon` → 库: `custom`, 名称: `my-custom-icon`

### 2. 文件路径生成

根据配置生成相应的文件路径：

#### 扁平结构（默认）

```typescript
organizeByLibrary: false
```

| 图标名称 | 生成路径 |
|---------|---------|
| `mdi:home` | `/icons/mdi-home.svg` |
| `heroicons:heart-20-solid` | `/icons/heroicons-heart-20-solid.svg` |
| `fa:user` | `/icons/fa-user.svg` |

#### 按库分文件夹

```typescript
organizeByLibrary: true
```

| 图标名称 | 生成路径 |
|---------|---------|
| `mdi:home` | `/icons/mdi/home.svg` |
| `heroicons:heart-20-solid` | `/icons/heroicons/heart-20-solid.svg` |
| `fa:user` | `/icons/fa/user.svg` |

### 3. 安全文件名处理

自动处理文件名中的不安全字符：

| 原字符 | 替换为 |
|-------|-------|
| `:` | `-` |
| `/` | `-` |
| `\\` | `-` |
| `<` | `-` |
| `>` | `-` |
| `"` | `-` |
| `|` | `-` |
| `?` | `-` |
| `*` | `-` |
| 空格 | `-` |

**示例：**
- `test:icon/with<unsafe>chars` → `test-icon-with-unsafe-chars.svg`

## API 参考

### generateIconPath()

生成图标路径信息的核心函数。

```typescript
function generateIconPath(
  iconName: string,
  config?: IconPathConfig
): IconPathInfo
```

**参数：**
- `iconName`: 图标名称
- `config`: 可选配置对象

**返回值：**
```typescript
interface IconPathInfo {
  library: string        // 图标库名称
  name: string          // 图标名称
  fileName: string      // 文件名
  fullPath: string      // 完整路径
}
```

**示例：**
```typescript
import { generateIconPath } from 'cached-icon-vue'

// 扁平结构
const result1 = generateIconPath('mdi:home')
// {
//   library: 'mdi',
//   name: 'home',
//   fileName: 'home.svg',
//   fullPath: '/icons/mdi-home.svg'
// }

// 按库分文件夹
const result2 = generateIconPath('mdi:home', {
  organizeByLibrary: true
})
// {
//   library: 'mdi',
//   name: 'home',
//   fileName: 'home.svg',
//   fullPath: '/icons/mdi/home.svg'
// }
```

### parseIconName()

解析图标名称，提取图标库和图标名称。

```typescript
function parseIconName(iconName: string): {
  library: string
  name: string
}
```

**示例：**
```typescript
import { parseIconName } from 'cached-icon-vue'

parseIconName('mdi:home')
// { library: 'mdi', name: 'home' }

parseIconName('heroicons:heart-20-solid')
// { library: 'heroicons', name: 'heart-20-solid' }

parseIconName('mdi-home')
// { library: 'mdi', name: 'home' }
```

### legacyIconNameToFileName()

向后兼容的文件名转换函数。

```typescript
function legacyIconNameToFileName(iconName: string): string
```

**示例：**
```typescript
import { legacyIconNameToFileName } from 'cached-icon-vue'

legacyIconNameToFileName('mdi:home')
// 'mdi-home'
```

## 配置选项

### IconPathConfig

```typescript
interface IconPathConfig {
  /** 图标文件路径前缀 */
  iconPathPrefix?: string
  /** 是否按图标库分文件夹保存（默认：false） */
  organizeByLibrary?: boolean
}
```

### 组件配置

```typescript
// 在 Vue 应用中配置
app.use(CachedIconVue, {
  organizeByLibrary: true,
  iconPathPrefix: '/assets/icons'
})
```

### Vite 插件配置

```typescript
// vite.config.ts
import { vitePluginCachedIcon } from 'cached-icon-vue/vite-plugin'

export default defineConfig({
  plugins: [
    vitePluginCachedIcon({
      organizeByLibrary: true,
      iconDir: 'public/icons'
    })
  ]
})
```

## 支持的图标库

系统内置了常见图标库的识别规则：

- `mdi` - Material Design Icons
- `fa`, `fas`, `far`, `fab` - Font Awesome
- `heroicons` - Heroicons
- `lucide` - Lucide Icons
- `tabler` - Tabler Icons
- `feather` - Feather Icons
- `bootstrap` - Bootstrap Icons
- `material` - Material Icons
- `ant-design` - Ant Design Icons
- `carbon` - Carbon Icons
- `fluent` - Fluent Icons
- `iconify` - Iconify Icons
- `simple-icons` - Simple Icons
- `devicons` - Devicons

## 最佳实践

### 1. 选择合适的组织方式

**扁平结构适合：**
- 小型项目
- 图标数量较少
- 简单的文件管理需求

**按库分文件夹适合：**
- 大型项目
- 使用多个图标库
- 需要更好的文件组织

### 2. 统一命名规范

推荐使用冒号分隔符：
```typescript
// 推荐
<CachedIcon name="mdi:home" />
<CachedIcon name="heroicons:heart-20-solid" />

// 向后兼容
<CachedIcon name="mdi-home" />
```

### 3. 配置同步

确保组件配置和 Vite 插件配置保持同步：

```typescript
// vite.config.ts
vitePluginCachedIcon({
  organizeByLibrary: true,
  iconDir: 'public/icons'
})

// main.ts
app.use(CachedIconVue, {
  organizeByLibrary: true,
  iconPathPrefix: '/icons'
})
```

## 迁移指南

### 从扁平结构迁移到分文件夹

1. 更新配置：
```typescript
// 旧配置
organizeByLibrary: false

// 新配置
organizeByLibrary: true
```

2. 重新组织文件：
```bash
# 扁平结构
public/icons/
├── mdi-home.svg
├── mdi-star.svg
└── fa-user.svg

# 迁移后
public/icons/
├── mdi/
│   ├── home.svg
│   └── star.svg
└── fa/
    └── user.svg
```

3. 清理旧文件：
删除扁平结构中的旧文件，让系统重新下载到新位置。

### 自定义路径转换

如果有特殊需求，可以扩展 `generateIconPath` 函数：

```typescript
import { generateIconPath, parseIconName } from 'cached-icon-vue'

function customGenerateIconPath(iconName: string) {
  const { library, name } = parseIconName(iconName)
  
  // 自定义逻辑
  const customPath = `/custom-icons/${library}/${name}.svg`
  
  return {
    library,
    name,
    fileName: `${name}.svg`,
    fullPath: customPath
  }
}
```

## 故障排除

### 常见问题

1. **图标不显示**
   - 检查路径配置是否正确
   - 确认文件是否存在于正确位置
   - 验证图标名称格式

2. **文件路径不正确**
   - 检查 `organizeByLibrary` 配置
   - 确认 `iconPathPrefix` 设置

3. **图标库识别错误**
   - 使用冒号分隔符明确指定图标库
   - 检查图标名称是否符合规范

### 调试工具

使用浏览器控制台查看路径生成：

```typescript
import { generateIconPath } from 'cached-icon-vue'

console.log(generateIconPath('mdi:home', {
  organizeByLibrary: true
}))
```