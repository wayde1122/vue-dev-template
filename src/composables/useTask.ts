/**
 * useTask Composable
 * 任务相关的组合式函数
 */

import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/task'
import type { Task, TaskPriority } from '@/stores/types'

export function useTask() {
  const taskStore = useTaskStore()

  // 使用 storeToRefs 保持响应性
  const {
    tasks,
    filteredTasks,
    filter,
    searchQuery,
    loading,
    activeCount,
    completedCount,
    totalCount
  } = storeToRefs(taskStore)

  // Actions
  const {
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    clearCompleted,
    setFilter,
    setSearch
  } = taskStore

  // 按优先级获取任务
  function getTasksByPriority(priority: TaskPriority): Task[] {
    return tasks.value.filter(t => t.priority === priority)
  }

  // 搜索任务
  function searchTasks(query: string): void {
    setSearch(query)
  }

  // 获取今日任务
  function getTodayTasks(): Task[] {
    const today = new Date().toISOString().split('T')[0]
    return tasks.value.filter(t => t.dueDate === today)
  }

  // 获取逾期任务
  function getOverdueTasks(): Task[] {
    const today = new Date().toISOString().split('T')[0]
    return tasks.value.filter(t => t.dueDate < today && !t.completed)
  }

  return {
    // State
    tasks,
    filteredTasks,
    filter,
    searchQuery,
    loading,
    activeCount,
    completedCount,
    totalCount,
    // Actions
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    clearCompleted,
    setFilter,
    searchTasks,
    getTasksByPriority,
    getTodayTasks,
    getOverdueTasks
  }
}
