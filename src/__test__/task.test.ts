/**
 * Task Store Unit Tests
 * 任务状态管理测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from '../stores/task'
import type { Task } from '../stores/types'

describe('Task Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('初始状态', () => {
    it('应该初始化为空数组', () => {
      const store = useTaskStore()
      expect(store.tasks).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.filter).toBe('all')
      expect(store.searchQuery).toBe('')
    })

    it('计数器应该初始为 0', () => {
      const store = useTaskStore()
      expect(store.totalCount).toBe(0)
      expect(store.activeCount).toBe(0)
      expect(store.completedCount).toBe(0)
      expect(store.highPriorityCount).toBe(0)
    })
  })

  describe('fetchTasks', () => {
    it('应该加载模拟数据', async () => {
      const store = useTaskStore()

      const fetchPromise = store.fetchTasks()
      expect(store.loading).toBe(true)

      vi.advanceTimersByTime(500)
      await fetchPromise

      expect(store.loading).toBe(false)
      expect(store.tasks.length).toBe(5)
      expect(store.totalCount).toBe(5)
    })

    it('加载后应该正确计算计数', async () => {
      const store = useTaskStore()

      vi.advanceTimersByTimeAsync(500)
      await store.fetchTasks()

      // mockTasks 中有 2 个 completed, 3 个 active
      expect(store.activeCount).toBe(3)
      expect(store.completedCount).toBe(2)
    })
  })

  describe('addTask', () => {
    it('应该添加新任务到列表顶部', () => {
      const store = useTaskStore()

      store.addTask('New task')

      expect(store.tasks.length).toBe(1)
      expect(store.tasks[0].text).toBe('New task')
      expect(store.tasks[0].completed).toBe(false)
      expect(store.tasks[0].priority).toBe('medium')
    })

    it('新任务应该有唯一 ID', () => {
      const store = useTaskStore()

      const task1 = store.addTask('Task 1')
      // 推进时间以确保不同的时间戳
      vi.advanceTimersByTime(1)
      const task2 = store.addTask('Task 2')

      expect(task1.id).not.toBe(task2.id)
    })

    it('应该增加 activeCount', () => {
      const store = useTaskStore()

      store.addTask('New task')

      expect(store.activeCount).toBe(1)
      expect(store.totalCount).toBe(1)
    })
  })

  describe('toggleTask', () => {
    beforeEach(() => {
      const store = useTaskStore()
      store.tasks = [
        { id: 1, text: 'Task 1', completed: false, priority: 'medium', dueDate: '2024-01-01' },
        { id: 2, text: 'Task 2', completed: false, priority: 'medium', dueDate: '2024-01-01' }
      ] as Task[]
    })

    it('应该切换任务完成状态', () => {
      const store = useTaskStore()

      expect(store.tasks[0].completed).toBe(false)

      store.toggleTask(1)

      expect(store.tasks[0].completed).toBe(true)

      store.toggleTask(1)

      expect(store.tasks[0].completed).toBe(false)
    })

    it('不存在的任务 ID 应该不报错', () => {
      const store = useTaskStore()

      expect(() => store.toggleTask(999)).not.toThrow()
    })
  })

  describe('deleteTask', () => {
    it('应该删除指定任务', () => {
      const store = useTaskStore()
      store.tasks = [
        { id: 1, text: 'Task 1', completed: false, priority: 'medium', dueDate: '2024-01-01' },
        { id: 2, text: 'Task 2', completed: false, priority: 'medium', dueDate: '2024-01-01' },
        { id: 3, text: 'Task 3', completed: false, priority: 'medium', dueDate: '2024-01-01' }
      ] as Task[]

      store.deleteTask(2)

      expect(store.tasks.length).toBe(2)
      expect(store.tasks.find(t => t.id === 2)).toBeUndefined()
    })

    it('删除不存在的任务应该不报错', () => {
      const store = useTaskStore()
      const originalLength = store.tasks.length

      store.deleteTask(999)

      expect(store.tasks.length).toBe(originalLength)
    })
  })

  describe('updateTask', () => {
    it('应该更新任务属性', () => {
      const store = useTaskStore()
      store.tasks = [
        { id: 1, text: 'Original', completed: false, priority: 'low', dueDate: '2024-01-01' }
      ] as Task[]

      store.updateTask(1, {
        text: 'Updated',
        priority: 'high'
      })

      expect(store.tasks[0].text).toBe('Updated')
      expect(store.tasks[0].priority).toBe('high')
      expect(store.tasks[0].completed).toBe(false) // 未更新的属性保持不变
    })
  })

  describe('clearCompleted', () => {
    it('应该删除所有已完成的任务', () => {
      const store = useTaskStore()
      store.tasks = [
        { id: 1, text: 'Active 1', completed: false, priority: 'medium', dueDate: '2024-01-01' },
        { id: 2, text: 'Completed 1', completed: true, priority: 'medium', dueDate: '2024-01-01' },
        { id: 3, text: 'Active 2', completed: false, priority: 'medium', dueDate: '2024-01-01' },
        { id: 4, text: 'Completed 2', completed: true, priority: 'medium', dueDate: '2024-01-01' }
      ] as Task[]

      store.clearCompleted()

      expect(store.tasks.length).toBe(2)
      expect(store.tasks.every(t => !t.completed)).toBe(true)
    })

    it('没有已完成任务时应该不改变列表', () => {
      const store = useTaskStore()
      store.tasks = [
        { id: 1, text: 'Active 1', completed: false, priority: 'medium', dueDate: '2024-01-01' },
        { id: 2, text: 'Active 2', completed: false, priority: 'medium', dueDate: '2024-01-01' }
      ] as Task[]
      const originalLength = store.tasks.length

      store.clearCompleted()

      expect(store.tasks.length).toBe(originalLength)
    })
  })

  describe('setFilter', () => {
    beforeEach(() => {
      const store = useTaskStore()
      store.tasks = [
        { id: 1, text: 'Active task', completed: false, priority: 'medium', dueDate: '2024-01-01' },
        { id: 2, text: 'Completed task', completed: true, priority: 'medium', dueDate: '2024-01-01' }
      ] as Task[]
    })

    it('filter=active 应该只显示未完成任务', () => {
      const store = useTaskStore()

      store.setFilter('active')

      expect(store.filteredTasks.length).toBe(1)
      expect(store.filteredTasks[0].completed).toBe(false)
    })

    it('filter=completed 应该只显示已完成任务', () => {
      const store = useTaskStore()

      store.setFilter('completed')

      expect(store.filteredTasks.length).toBe(1)
      expect(store.filteredTasks[0].completed).toBe(true)
    })

    it('filter=all 应该显示所有任务', () => {
      const store = useTaskStore()

      store.setFilter('all')

      expect(store.filteredTasks.length).toBe(2)
    })
  })

  describe('setSearch', () => {
    beforeEach(() => {
      const store = useTaskStore()
      store.tasks = [
        { id: 1, text: 'Buy groceries', completed: false, priority: 'medium', dueDate: '2024-01-01' },
        { id: 2, text: 'Walk the dog', completed: false, priority: 'medium', dueDate: '2024-01-01' },
        { id: 3, text: 'Buy medicine', completed: true, priority: 'medium', dueDate: '2024-01-01' }
      ] as Task[]
    })

    it('应该根据搜索关键词过滤', () => {
      const store = useTaskStore()

      store.setSearch('buy')

      expect(store.filteredTasks.length).toBe(2)
      expect(store.filteredTasks.every(t => t.text.toLowerCase().includes('buy'))).toBe(true)
    })

    it('搜索应该不区分大小写', () => {
      const store = useTaskStore()

      store.setSearch('GROCERIES')

      expect(store.filteredTasks.length).toBe(1)
      expect(store.filteredTasks[0].text).toBe('Buy groceries')
    })

    it('空字符串应该显示所有任务', () => {
      const store = useTaskStore()

      store.setSearch('')

      expect(store.filteredTasks.length).toBe(3)
    })

    it('没有匹配结果时应该返回空数组', () => {
      const store = useTaskStore()

      store.setSearch('xyz')

      expect(store.filteredTasks.length).toBe(0)
    })
  })

  describe('组合过滤', () => {
    it('应该同时应用 filter 和 search', () => {
      const store = useTaskStore()
      store.tasks = [
        { id: 1, text: 'Active buy task', completed: false, priority: 'medium', dueDate: '2024-01-01' },
        { id: 2, text: 'Completed buy task', completed: true, priority: 'medium', dueDate: '2024-01-01' },
        { id: 3, text: 'Active sell task', completed: false, priority: 'medium', dueDate: '2024-01-01' }
      ] as Task[]

      store.setFilter('active')
      store.setSearch('buy')

      expect(store.filteredTasks.length).toBe(1)
      expect(store.filteredTasks[0].id).toBe(1)
    })
  })

  describe('highPriorityCount', () => {
    it('应该只计算未完成的高优先级任务', () => {
      const store = useTaskStore()
      store.tasks = [
        { id: 1, text: 'High priority active', completed: false, priority: 'high', dueDate: '2024-01-01' },
        { id: 2, text: 'High priority completed', completed: true, priority: 'high', dueDate: '2024-01-01' },
        { id: 3, text: 'Low priority active', completed: false, priority: 'low', dueDate: '2024-01-01' },
        { id: 4, text: 'High priority active 2', completed: false, priority: 'high', dueDate: '2024-01-01' }
      ] as Task[]

      expect(store.highPriorityCount).toBe(2)
    })
  })

  describe('边界情况', () => {
    it('空列表时操作应该不报错', () => {
      const store = useTaskStore()

      expect(() => store.toggleTask(1)).not.toThrow()
      expect(() => store.deleteTask(1)).not.toThrow()
      expect(() => store.updateTask(1, {})).not.toThrow()
      expect(() => store.clearCompleted()).not.toThrow()
    })

    it('搜索空字符串应该返回所有任务', () => {
      const store = useTaskStore()
      store.tasks = [
        { id: 1, text: 'Task 1', completed: false, priority: 'medium', dueDate: '2024-01-01' }
      ] as Task[]

      store.setSearch('')

      expect(store.filteredTasks.length).toBe(1)
    })
  })
})
