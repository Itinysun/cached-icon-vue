import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
/// <reference types="vitest" />

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
      tsconfigPath: './tsconfig.json',
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(import.meta.dirname, 'src'),
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        'vite-plugin/index': resolve(import.meta.dirname, 'src/vite-plugin/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: id => {
        // Vue 组件相关的外部依赖
        if (id === 'vue') return true

        // Vite 插件相关的外部依赖
        if (id === 'vite') return true
        if (id.startsWith('node:')) return true
        if (id === 'fs' || id === 'path') return true

        return false
      },
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          chunkFileNames: '[name].cjs',
          exports: 'named',
        },
      ],
    },
    sourcemap: true,
    minify: false,
    target: 'esnext',
  },
  // @ts-expect-error - test configuration for vitest
  test: {
    environment: 'jsdom',
    globals: true,
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'lib/',
        'dist/',
        'tests/',
        'examples/',
        'scripts/',
        'docs/',
        'vite.config.ts',
        'eslint.config.js',
        '*.d.ts',
      ],
    },
  },
})
