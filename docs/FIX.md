## 故障排除

### 开发环境调试

1. **检查环境变量**：

   ```javascript
   console.log('DEV:', import.meta.env.DEV)
   console.log('MODE:', import.meta.env.MODE)
   console.log('NODE_ENV:', process.env.NODE_ENV)
   ```

2. **查看缓存状态**：

   ```javascript
   import { iconCache } from 'cached-icon-vue'
   console.log('缓存统计:', iconCache.getStats())
   ```

3. **网络请求检查**：
   - 打开浏览器开发者工具
   - 查看 Network 标签
   - 寻找 `/api/download-icon` 请求

### 生产环境部署

1. **静态资源配置**：

   ```bash
   # 确保图标目录被正确部署
   public/
   ├── icons/
   │   ├── mdi-home.svg
   │   ├── mdi-star.svg
   │   └── ...
   ```

2. **服务器配置**：
   ```nginx
   # Nginx 配置示例
   location /icons/ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

## 性能优化建议

1. **预加载常用图标**：

   ```typescript
   // 在应用启动时预加载
   import { iconDownloader } from 'cached-icon-vue'

   const commonIcons = ['mdi:home', 'mdi:user', 'mdi:settings']
   iconDownloader.downloadIcons(commonIcons)
   ```

2. **按需加载组件**：

   ```typescript
   // 使用动态导入
   const CachedIcon = defineAsyncComponent(() => import('cached-icon-vue').then(m => m.CachedIcon))
   ```

3. **缓存配置优化**：

   ```typescript
   import { IconCacheManager } from 'cached-icon-vue'

   const cache = new IconCacheManager({
     cacheExpireTime: 7 * 24 * 60 * 60 * 1000, // 7天
     storageKey: 'my-app-icons-v1',
   })
   ```
