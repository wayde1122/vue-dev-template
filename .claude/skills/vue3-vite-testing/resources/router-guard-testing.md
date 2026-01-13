# 路由鉴权守卫的可测性建议（针对 `src/router/index.js`）

## 现状问题

当前 `src/router/index.js` 的守卫逻辑直接依赖：
- `useAuthStore().isAuthenticated`
- `document.title`
- 并使用延迟 `require()` 获取 store

这会导致单测里很难“纯函数化”地验证分支行为（未登录重定向 / 已登录访问 login 重定向 / 正常放行）。

## 推荐做法：把守卫逻辑抽成可注入函数

目标：让守卫测试只关心输入与输出，不需要真实 router/真实 pinia。

### 建议新增一个纯函数（例：`src/router/guards/authGuard.js`）

```js
export function createAuthGuard({ getIsAuthenticated, setTitle }) {
  return function authGuard(to, from, next) {
    const isAuthenticated = getIsAuthenticated()

    // title
    setTitle?.(to)

    if (to.meta?.requiresAuth !== false && !isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    if (to.name === 'Login' && isAuthenticated) {
      next({ name: 'Dashboard' })
      return
    }

    next()
  }
}
```

### 在 `src/router/index.js` 中注册守卫时注入依赖

```js
import { createAuthGuard } from './guards/authGuard'
import { useAuthStore } from '@/stores/auth'

router.beforeEach(
  createAuthGuard({
    getIsAuthenticated: () => useAuthStore().isAuthenticated,
    setTitle: (to) => {
      document.title = to.meta.title ? `${to.meta.title} - TaskFlow` : 'TaskFlow'
    }
  })
)
```

## 守卫单测示例（Vitest）

建议文件：
- `src/router/__tests__/authGuard.test.js`

```js
import { describe, it, expect, vi } from 'vitest'
import { createAuthGuard } from '@/router/guards/authGuard'

function mkNext() {
  return vi.fn()
}

describe('authGuard', () => {
  it('redirects to Login when requiresAuth and not authenticated', () => {
    const next = mkNext()
    const guard = createAuthGuard({
      getIsAuthenticated: () => false,
      setTitle: () => {}
    })

    guard(
      { name: 'Dashboard', fullPath: '/dashboard', meta: { requiresAuth: true, title: 'Dashboard' } },
      {},
      next
    )

    expect(next).toHaveBeenCalledWith({ name: 'Login', query: { redirect: '/dashboard' } })
  })

  it('redirects to Dashboard when authenticated user visits Login', () => {
    const next = mkNext()
    const guard = createAuthGuard({
      getIsAuthenticated: () => true,
      setTitle: () => {}
    })

    guard({ name: 'Login', fullPath: '/login', meta: { requiresAuth: false, title: 'Login' } }, {}, next)
    expect(next).toHaveBeenCalledWith({ name: 'Dashboard' })
  })

  it('calls next() when allowed', () => {
    const next = mkNext()
    const guard = createAuthGuard({
      getIsAuthenticated: () => true,
      setTitle: () => {}
    })

    guard({ name: 'Dashboard', fullPath: '/dashboard', meta: { requiresAuth: true, title: 'Dashboard' } }, {}, next)
    expect(next).toHaveBeenCalledWith()
  })
})
```

