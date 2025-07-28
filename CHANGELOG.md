# Changelog

所有重要的变更都会记录在这个文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。


# [1.5.0](https://github.com/Itinysun/cached-icon-vue/compare/v1.4.0...v1.5.0) (2025-07-28)


### Bug Fixes

* clean up code formatting and improve readability in env.ts and vite-plugin/index.ts ([56eb28a](https://github.com/Itinysun/cached-icon-vue/commit/56eb28a723f28416071473d44e379d73c2d58b3c))


### Features

* Add comprehensive FAQ and troubleshooting documentation for CachedIcon usage ([0306179](https://github.com/Itinysun/cached-icon-vue/commit/0306179009697ba0e4104d52ddb08c6f86ed7476))

# [1.4.0](https://github.com/Itinysun/cached-icon-vue/compare/v1.3.0...v1.4.0) (2025-07-26)

### Features

- 添加智能重试机制，优化图标下载失败处理 ([fc3a000](https://github.com/Itinysun/cached-icon-vue/commit/fc3a000bea1c415aeef009d8962dbe51ebf8de9d))

# [1.3.0](https://github.com/Itinysun/cached-icon-vue/compare/v1.2.0...v1.3.0) (2025-07-26)

### Bug Fixes

- 更新类型定义，确保从 Vite 插件注入的配置获取时的类型安全 ([8b56f1b](https://github.com/Itinysun/cached-icon-vue/commit/8b56f1b4f7eae411af3e9e6d85fb352bf1381acb))
- 修复类型定义，确保从全局配置和 Vite 插件获取设置时的类型安全 ([f6738d5](https://github.com/Itinysun/cached-icon-vue/commit/f6738d5193f945ff59a997c93dfd2003a924084f))

### Features

- 更新文档和代码，添加 Vite 插件配置示例，改进图标下载工具的环境检测 ([6967ab5](https://github.com/Itinysun/cached-icon-vue/commit/6967ab5054498a2183783277b414912461e1877d))
- 更新文档和代码，支持从全局配置和 Vite 插件获取设置，增强图标下载功能 ([c67ad9b](https://github.com/Itinysun/cached-icon-vue/commit/c67ad9bcc264d4262e6993b0062ae5ac4ef909db))

# [1.2.0](https://github.com/Itinysun/cached-icon-vue/compare/v1.1.1...v1.2.0) (2025-07-26)

### Features

- 导出 Vite 插件以便于使用 ([bab4294](https://github.com/Itinysun/cached-icon-vue/commit/bab429487f791179f436a99d086c1ad0ecb0baf8))

## [1.1.1](https://github.com/Itinysun/cached-icon-vue/compare/v1.1.0...v1.1.1) (2025-07-26)

### Bug Fixes

- 更新 peerDependencies 中的 vite 版本范围，优化发布前检查脚本的格式化步骤 ([02c5b75](https://github.com/Itinysun/cached-icon-vue/commit/02c5b75c53626f9411e158d143884a0841e80eb2))

# 1.1.0 (2025-07-26)

### Features

- 更新 CI 和发布工作流，调整 Node.js 版本要求，添加发布验证脚本 ([6b99800](https://github.com/Itinysun/cached-icon-vue/commit/6b998008418c23cc35c129c4648bfd06754c51dd))
- 更新 package.json 和 index.ts，优化样式导出和插件导入 ([5378b0b](https://github.com/Itinysun/cached-icon-vue/commit/5378b0b68802c11afb12cf4f1ded302b900ca25f))
- enhance pre-release checks and improve plugin exports ([236eccc](https://github.com/Itinysun/cached-icon-vue/commit/236eccc9b130fd9a6b8fb19c6a3730c856c7547f))
- Refactor tsconfig.json and vite.config.ts for improved configuration ([196ba6c](https://github.com/Itinysun/cached-icon-vue/commit/196ba6cdae0ac0305402c17ccaca39d35dd201a8))

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
