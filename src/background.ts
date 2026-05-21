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
