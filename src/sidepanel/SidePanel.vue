<script setup lang="ts">
// ref, onMounted, onUnmounted 现在自动导入，无需手动 import

const currentTime = ref<string>('')
const tabCount = ref<number>(0)
const htmlContent = ref<string>('')
const loading = ref<boolean>(false)
let timer: ReturnType<typeof setInterval> | null = null

const updateTime = (): void => {
  currentTime.value = new Date().toLocaleTimeString('zh-CN')
}

const loadHtml = (): void => {
  loading.value = true
  htmlContent.value = ''
  chrome.runtime.sendMessage({ type: 'GET_HTML' }, (response) => {
    loading.value = false
    if (response?.error) {
      htmlContent.value = `错误: ${response.error}`
    } else {
      htmlContent.value = response?.html ?? ''
    }
  })
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

    <div class="bg-white rounded-xl shadow-lg p-6 mb-4">
      <button
        class="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        :disabled="loading"
        @click="loadHtml"
      >
        {{ loading ? '加载中...' : '加载 HTML' }}
      </button>

      <div v-if="htmlContent" class="mt-4">
        <p class="text-gray-600 text-sm mb-2">页面 HTML 内容:</p>
        <pre class="bg-gray-100 rounded-lg p-3 text-xs overflow-auto max-h-96 whitespace-pre-wrap break-all">{{ htmlContent }}</pre>
      </div>
    </div>

    <!-- 测试自动导入组件 -->
    <div class="text-center">
      <HelloButton />
    </div>

    <p class="text-xs text-gray-500 text-center mt-4">
      Side Panel - Vue 3 + TailwindCSS + 自动导入
    </p>
  </div>
</template>
