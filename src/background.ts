// Background Service Worker
console.log('Background script loaded')

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})

// 点击扩展图标时打开侧边栏
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  chrome.sidePanel.open({ tabId: tab.id! })
})

// 监听来自 sidepanel 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_HTML') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0]
      if (!tab?.id) {
        sendResponse({ error: '没有找到活动标签页' })
        return
      }
      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => document.documentElement.outerHTML
        })
        sendResponse({ html: results[0]?.result ?? '' })
      } catch (e: any) {
        sendResponse({ error: e.message })
      }
    })
    return true // 保持消息通道开放以支持异步 sendResponse
  }
})
