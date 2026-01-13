# 示例：测试 `src/stores/task.js`

目标：
- `fetchTasks()` 会加载 mockTasks 并关闭 loading
- `addTask()` 会新增一条任务（id、dueDate）
- `toggleTask()` 会翻转 completed
- `filteredTasks` 会按 filter/searchQuery 生效

建议文件路径：
- `src/stores/__tests__/task.test.js`

示例：

```js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from '@/stores/task'

describe('task store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fetchTasks populates tasks and toggles loading', async () => {
    const store = useTaskStore()
    expect(store.loading).toBe(false)

    const p = store.fetchTasks()
    expect(store.loading).toBe(true)

    const tasks = await p
    expect(Array.isArray(tasks)).toBe(true)
    expect(store.loading).toBe(false)
    expect(store.totalCount).toBe(store.tasks.length)
  })

  it('addTask adds item and it is visible in filteredTasks', () => {
    const store = useTaskStore()
    const t = store.addTask('hello')
    expect(t.text).toBe('hello')
    expect(store.tasks[0].id).toBe(t.id)
    expect(store.filteredTasks.some(x => x.id === t.id)).toBe(true)
  })

  it('toggleTask flips completed', () => {
    const store = useTaskStore()
    const t = store.addTask('x')
    expect(store.tasks[0].completed).toBe(false)
    store.toggleTask(t.id)
    expect(store.tasks[0].completed).toBe(true)
  })

  it('filter and searchQuery affect filteredTasks', () => {
    const store = useTaskStore()
    const a = store.addTask('Alpha')
    const b = store.addTask('Beta')
    store.toggleTask(a.id) // a completed

    store.setFilter('active')
    expect(store.filteredTasks.every(t => t.completed === false)).toBe(true)

    store.setFilter('completed')
    expect(store.filteredTasks.every(t => t.completed === true)).toBe(true)

    store.setFilter('all')
    store.setSearch('be')
    expect(store.filteredTasks.map(t => t.text.toLowerCase())).toEqual(['beta'])
  })
})
```

