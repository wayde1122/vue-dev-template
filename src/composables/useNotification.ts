/**
 * useNotification Composable
 * 通知/消息提示的组合式函数
 */

import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  duration: number
}

const notifications = ref<Notification[]>([])

export function useNotification() {
  // 显示通知
  function show(options: {
    type?: NotificationType
    title?: string
    message: string
    duration?: number
  }): number {
    const id = Date.now()
    const notification: Notification = {
      id,
      type: options.type || 'info',
      title: options.title || '',
      message: options.message,
      duration: options.duration || 3000
    }

    notifications.value.push(notification)

    // 自动移除
    if (notification.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, notification.duration)
    }

    return id
  }

  // 快捷方法
  function success(message: string, title = 'Success'): number {
    return show({ type: 'success', title, message })
  }

  function error(message: string, title = 'Error'): number {
    return show({ type: 'error', title, message, duration: 5000 })
  }

  function warning(message: string, title = 'Warning'): number {
    return show({ type: 'warning', title, message })
  }

  function info(message: string, title = 'Info'): number {
    return show({ type: 'info', title, message })
  }

  // 移除通知
  function remove(id: number): void {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // 清空所有
  function clear(): void {
    notifications.value = []
  }

  return {
    notifications,
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear
  }
}
