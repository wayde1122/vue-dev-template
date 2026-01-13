/**
 * Task Store
 * 任务状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Task, TaskFilter } from './types'

export const useTaskStore = defineStore('task', () => {
  // State
  const tasks: Ref<Task[]> = ref([])
  const filter: Ref<TaskFilter> = ref('all')
  const searchQuery = ref('')
  const loading = ref(false)

  // Mock Data
  const mockTasks: Task[] = [
    { id: 1, text: 'Review project proposal', completed: false, priority: 'high', dueDate: '2024-01-15' },
    { id: 2, text: 'Update landing page design', completed: true, priority: 'medium', dueDate: '2024-01-14' },
    { id: 3, text: 'Schedule team meeting', completed: false, priority: 'low', dueDate: '2024-01-16' },
    { id: 4, text: 'Prepare quarterly report', completed: false, priority: 'high', dueDate: '2024-01-20' },
    { id: 5, text: 'Code review for PR #234', completed: true, priority: 'medium', dueDate: '2024-01-13' }
  ]

  // Getters
  const filteredTasks = computed(() => {
    let result = [...tasks.value]

    // Filter by status
    if (filter.value === 'active') {
      result = result.filter(t => !t.completed)
    } else if (filter.value === 'completed') {
      result = result.filter(t => t.completed)
    }

    // Filter by search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(t => t.text.toLowerCase().includes(query))
    }

    return result
  })

  const activeCount = computed(() => tasks.value.filter(t => !t.completed).length)
  const completedCount = computed(() => tasks.value.filter(t => t.completed).length)
  const totalCount = computed(() => tasks.value.length)

  // Stats by priority
  const highPriorityCount = computed(() =>
    tasks.value.filter(t => t.priority === 'high' && !t.completed).length
  )

  // Actions
  function fetchTasks(): Promise<Task[]> {
    loading.value = true
    return new Promise((resolve) => {
      setTimeout(() => {
        tasks.value = [...mockTasks]
        loading.value = false
        resolve(tasks.value)
      }, 500)
    })
  }

  function addTask(text: string): Task {
    const newTask: Task = {
      id: Date.now(),
      text,
      completed: false,
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0]
    }
    tasks.value.unshift(newTask)
    return newTask
  }

  function toggleTask(id: number): void {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
    }
  }

  function deleteTask(id: number): void {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index > -1) {
      tasks.value.splice(index, 1)
    }
  }

  function updateTask(id: number, updates: Partial<Task>): void {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      Object.assign(task, updates)
    }
  }

  function clearCompleted(): void {
    tasks.value = tasks.value.filter(t => !t.completed)
  }

  function setFilter(newFilter: TaskFilter): void {
    filter.value = newFilter
  }

  function setSearch(query: string): void {
    searchQuery.value = query
  }

  return {
    // State
    tasks,
    filter,
    searchQuery,
    loading,
    // Getters
    filteredTasks,
    activeCount,
    completedCount,
    totalCount,
    highPriorityCount,
    // Actions
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    clearCompleted,
    setFilter,
    setSearch
  }
})
