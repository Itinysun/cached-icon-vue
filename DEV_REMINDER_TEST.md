# 开发模式提醒功能测试指南

## 🎯 目标
验证 CachedIcon 的开发模式提醒功能是否正常工作，包括：
- Vue 插件安装时的提醒
- Vite 插件启动时的提醒
- 用户自定义环境检测的兼容性

## 🔍 测试方法

### 方法1：使用现有测试项目

1. **启动测试项目**
   ```bash
   cd /Users/liuchunwei/web/packages/cached-icon-test
   npm run dev
   ```

2. **查看终端输出**
   你应该看到 Vite 插件的开发模式提醒：
   ```
   🔧 CachedIcon Vite 插件已启用 (开发模式)
     • 图标下载 API 端点: /api/download-icon
     • 图标保存目录: public/icons
     • 图标来源: iconify
   ```

3. **查看浏览器控制台**
   - 打开浏览器访问 `http://localhost:5173`
   - 按 F12 打开开发者工具
   - 切换到 Console 标签
   - 你应该看到 Vue 插件的开发模式提醒（绿色背景）：
   ```
   🚀 CachedIcon 开发模式已启用
   • 图标自动下载功能已启用
   • 支持用户自定义环境检测
   • 使用 window.CachedIcon?.debugEnv() 查看详细环境信息
   ```

### 方法2：修改测试项目配置

修改 `/Users/liuchunwei/web/packages/cached-icon-test/src/main.ts`：

```typescript
// 原来的配置
app.use(CachedIconVue)

// 改为带自定义环境检测的配置
app.use(CachedIconVue, {
  isDevelopment: () => {
    console.log('🔍 执行自定义环境检测')
    return window.location.hostname === 'localhost'
  },
  cacheExpireTime: 30 * 60 * 1000, // 30分钟缓存
})
```

重新启动项目后，你应该看到额外的提醒信息：
```
🚀 CachedIcon 开发模式已启用
• 图标自动下载功能已启用
• 支持用户自定义环境检测
• 使用了用户自定义的环境检测函数  // 新增这行
• 使用 window.CachedIcon?.debugEnv() 查看详细环境信息
```

### 方法3：使用测试HTML文件

1. **启动一个简单的HTTP服务器**
   ```bash
   # 在 cached-icon-vue 项目根目录
   python -m http.server 8080
   # 或
   npx serve .
   ```

2. **访问测试页面**
   ```
   http://localhost:8080/test-dev-reminder.html
   ```

3. **按照页面指引测试**
   - 打开浏览器开发者工具
   - 点击不同的测试按钮
   - 观察控制台输出

## 🧪 测试用例

### 1. 默认环境检测
- **期望**：在 localhost 环境下显示开发模式提醒
- **测试**：直接使用 `app.use(CachedIconVue)` 不传参数

### 2. 自定义环境检测（强制开发模式）
- **期望**：无论在什么环境都显示开发模式提醒
- **测试**：
  ```typescript
  app.use(CachedIconVue, {
    isDevelopment: () => true
  })
  ```

### 3. 自定义环境检测（强制生产模式）
- **期望**：无论在什么环境都不显示开发模式提醒
- **测试**：
  ```typescript
  app.use(CachedIconVue, {
    isDevelopment: () => false
  })
  ```

### 4. 基于hostname的环境检测
- **期望**：只在 localhost 或包含 'dev' 的hostname下显示提醒
- **测试**：
  ```typescript
  app.use(CachedIconVue, {
    isDevelopment: () => {
      return location.hostname === 'localhost' || 
             location.hostname.includes('dev')
    }
  })
  ```

## 🔧 调试工具

### 使用全局调试函数

在浏览器控制台中输入：
```javascript
window.CachedIcon?.debugEnv()
```

你应该看到详细的环境信息：
```
🔍 CachedIcon 环境检测信息
  当前环境模式: development
  import.meta.env.DEV: true
  import.meta.env.MODE: development
  process.env.NODE_ENV: development
  最终检测结果: 开发环境
```

### 检查环境变量

在控制台中检查：
```javascript
console.log('import.meta.env.DEV:', import.meta.env.DEV)
console.log('import.meta.env.MODE:', import.meta.env.MODE)
```

## 🐛 故障排除

### 问题1：看不到任何提醒
- **原因**：环境检测认为当前是生产环境
- **解决**：使用自定义环境检测强制开发模式

### 问题2：Vite插件提醒不显示
- **原因**：Vite插件配置问题
- **解决**：确保 `vite.config.ts` 中正确配置了 `vitePluginCachedIcon()`

### 问题3：Vue插件提醒不显示
- **原因**：浏览器控制台未打开或被清空
- **解决**：打开开发者工具，刷新页面

## ✅ 预期结果

正常情况下，你应该看到：

1. **终端输出**（Vite 插件）：
   ```
   🔧 CachedIcon Vite 插件已启用 (开发模式)
     • 图标下载 API 端点: /api/download-icon
     • 图标保存目录: public/icons
     • 图标来源: iconify
   ```

2. **浏览器控制台输出**（Vue 插件）：
   ```
   🚀 CachedIcon 开发模式已启用
   • 图标自动下载功能已启用
   • 支持用户自定义环境检测
   • 使用 window.CachedIcon?.debugEnv() 查看详细环境信息
   ```

3. **自定义环境检测时的额外提醒**：
   ```
   • 使用了用户自定义的环境检测函数
   ```

这证明开发模式提醒功能完全正常工作，并且兼容用户自定义的环境检测配置。