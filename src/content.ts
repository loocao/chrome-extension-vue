// Content Script
console.log('Content script loaded on:', window.location.href)

interface Message {
  type: string
  data?: string
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  console.log('Content script received message:', message)

  if (message.type === 'GREETING') {
    // 在页面上显示通知
    showNotification(message.data ?? '')
    sendResponse({ received: true })
  }
})

// 显示通知函数
function showNotification(text: string): void {
  // 移除已存在的通知
  const existing = document.getElementById('vue-extension-notification')
  if (existing) {
    existing.remove()
  }

  // 创建通知元素
  const notification = document.createElement('div')
  notification.id = 'vue-extension-notification'
  notification.textContent = text
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `

  // 添加动画样式
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `
  document.head.appendChild(style)
  document.body.appendChild(notification)

  // 3秒后自动消失
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}
