# 示例文件

这个目录包含了 cached-icon-vue 组件的使用示例。

## 文件说明

- `basic-usage.vue` - 基础用法示例，展示了组件的各种功能

## 如何运行示例

1. 在包目录中安装依赖：
```bash
cd /path/to/cached-icon-vue
pnpm install
```

2. 构建包：
```bash
pnpm build
```

3. 在你的 Vue 项目中引入构建后的包进行测试，或者创建一个简单的测试项目：

```vue
<template>
  <div id="app">
    <!-- 复制 basic-usage.vue 中的内容到这里 -->
  </div>
</template>

<script>
// 引入组件
import { CachedIcon } from 'cached-icon-vue'

export default {
  components: {
    CachedIcon
  }
}
</script>
```

## 注意事项

- 确保你的项目中有对应的图标文件在 `/icons/` 目录下
- 开发环境下需要配置图标下载 API 端点（可选）
- 某些示例可能需要特定的图标文件才能正常显示