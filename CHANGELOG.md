# Changelog

所有重要的变更都会记录在这个文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added

- 初始版本发布
- CachedIcon Vue 组件，支持 SVG 缓存和智能状态管理
- Vite 插件，支持开发环境下自动下载图标
- 完整的 TypeScript 类型支持
- 双层缓存机制（内存 + 本地存储）
- 支持 Iconify API 和自定义图标源
- 完善的错误处理和调试支持

### Features

- **高性能缓存**: 全局 SVG 内容缓存，避免重复请求
- **智能下载**: 开发环境自动下载缺失图标
- **状态管理**: 完善的加载、错误、成功状态管理
- **TypeScript 支持**: 完整的类型定义
- **主题继承**: 自动继承父元素的颜色样式
- **灵活配置**: 支持自定义配置和扩展
- **Vite 集成**: 集成 Vite 插件，开发环境下自动下载图标
