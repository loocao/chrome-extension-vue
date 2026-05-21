<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref<string>('')
const tabCount = ref<number>(0)
let timer: ReturnType<typeof setInterval> | null = null

const updateTime = (): void => {
  currentTime.value = new Date().toLocaleTimeString('zh-CN')
}

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)

  try {
    const tabs = await chrome.tabs.query({})
    tabCount.value = tabs.length
  } catch (e) {
    console.log('无法获取标签页数量')
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
    <h1 class="text-2xl font-bold text-indigo-800 mb-6 text-center">
      侧边栏演示
    </h1>

    <div class="bg-white rounded-xl shadow-lg p-6 mb-4">
      <p class="text-gray-600 text-sm mb-2 text-center">当前时间</p>
      <p class="text-4xl font-mono font-bold text-indigo-600 text-center">
        {{ currentTime }}
      </p>
    </div>

    <div class="bg-white rounded-xl shadow-lg p-6 mb-4">
      <p class="text-gray-600 text-sm mb-2 text-center">打开的标签页</p>
      <p class="text-4xl font-bold text-purple-600 text-center">
        {{ tabCount }}
      </p>
    </div>

    <p class="text-xs text-gray-500 text-center mt-4">
      Side Panel - Vue 3 + TailwindCSS
    </p>
  </div>
</template>
