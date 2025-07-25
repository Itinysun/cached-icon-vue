<template>
  <div class="examples-container">
    <h1>CachedIcon 基础用法示例</h1>

    <section class="example-section">
      <h2>基础用法</h2>
      <div class="icon-grid">
        <div class="icon-item">
          <CachedIcon name="mdi:home" />
          <span>mdi:home</span>
        </div>
        <div class="icon-item">
          <CachedIcon name="mdi:star" />
          <span>mdi:star</span>
        </div>
        <div class="icon-item">
          <CachedIcon name="mdi:heart" />
          <span>mdi:heart</span>
        </div>
        <div class="icon-item">
          <CachedIcon name="mdi:settings" />
          <span>mdi:settings</span>
        </div>
      </div>
    </section>

    <section class="example-section">
      <h2>不同尺寸</h2>
      <div class="size-demo">
        <CachedIcon name="mdi:user" size="16px" />
        <CachedIcon name="mdi:user" size="24px" />
        <CachedIcon name="mdi:user" size="32px" />
        <CachedIcon name="mdi:user" size="48px" />
        <CachedIcon name="mdi:user" :size="64" />
      </div>
    </section>

    <section class="example-section">
      <h2>颜色继承</h2>
      <div class="color-demo">
        <div style="color: red">
          <CachedIcon name="mdi:heart" size="32px" />
          红色
        </div>
        <div style="color: blue">
          <CachedIcon name="mdi:star" size="32px" />
          蓝色
        </div>
        <div style="color: green">
          <CachedIcon name="mdi:check" size="32px" />
          绿色
        </div>
      </div>
    </section>

    <section class="example-section">
      <h2>状态展示</h2>
      <div class="state-demo">
        <div class="state-item">
          <CachedIcon name="existing-icon" />
          <span>正常状态</span>
        </div>
        <div class="state-item">
          <CachedIcon name="non-existing-icon" />
          <span>错误状态</span>
        </div>
        <div class="state-item">
          <CachedIcon name="another-non-existing" :show-error-state="false" />
          <span>隐藏错误状态</span>
        </div>
      </div>
    </section>

    <section class="example-section">
      <h2>缓存信息</h2>
      <div class="cache-info">
        <button @click="showCacheStats">显示缓存统计</button>
        <button @click="clearCache">清除缓存</button>
        <pre v-if="cacheStats">{{ JSON.stringify(cacheStats, null, 2) }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CachedIcon, iconCache } from '../src'

const cacheStats = ref(null)

const showCacheStats = () => {
  cacheStats.value = iconCache.getStats()
}

const clearCache = () => {
  iconCache.clear()
  cacheStats.value = null
  alert('缓存已清除')
}
</script>

<style scoped>
.examples-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.example-section {
  margin-bottom: 40px;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 40px;
}

h2 {
  color: #34495e;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
}

.icon-item svg {
  font-size: 32px;
}

.size-demo {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.color-demo {
  display: flex;
  gap: 24px;
}

.color-demo > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.state-demo {
  display: flex;
  gap: 24px;
}

.state-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.cache-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cache-info button {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  max-width: 150px;
}

.cache-info button:hover {
  background: #2980b9;
}

.cache-info pre {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  overflow-x: auto;
  font-size: 12px;
}
</style>
