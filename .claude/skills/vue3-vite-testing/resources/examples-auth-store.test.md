# 示例：测试 `src/stores/auth.js`

目标：
- `login()` 会写入 token，并让 `isAuthenticated` 为 true
- `logout()` 会清空 token，并让 `isAuthenticated` 为 false
- localStorage 的读写可预测

建议文件路径：
- `src/stores/__tests__/auth.test.js`

示例（Vitest + Pinia）：

```js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('login sets token and user', async () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)

    const res = await store.login({ email: 'a@b.com', password: 'x' })
    expect(res.token).toBeTruthy()
    expect(store.isAuthenticated).toBe(true)
    expect(localStorage.getItem('token')).toBe(res.token)
  })

  it('logout clears token and user', async () => {
    const store = useAuthStore()
    await store.login({ email: 'a@b.com', password: 'x' })
    expect(store.isAuthenticated).toBe(true)

    store.logout()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBe(null)
  })

  it('fetchUser rejects without token', async () => {
    const store = useAuthStore()
    await expect(store.fetchUser()).rejects.toBeTruthy()
  })
})
```

提示：
- `login()` 内部用了 `setTimeout`，但它返回 Promise，所以直接 `await` 即可，不一定需要 fake timers。
- 如果你要强制让测试更快，可用 `vi.useFakeTimers()` + `vi.advanceTimersByTime()`。

