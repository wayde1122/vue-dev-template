/**
 * Auth Store Unit Tests
 * 用户认证状态管理测试
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'
import type { User } from '../stores/types'

describe('Auth Store', () => {
  beforeEach(() => {
    // 每个测试前创建新的 pinia 实例
    setActivePinia(createPinia())
    // 清空 localStorage mock
    vi.clearAllMocks()
    // 重置 localStorage
    ;(globalThis.localStorage.getItem as Mock).mockReturnValue('')
  })

  describe('初始状态', () => {
    it('应该初始化为未认证状态', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
      expect(store.user).toBe(null)
      expect(store.token).toBe('')
    })

    it('应该有正确的默认 getter 值', () => {
      const store = useAuthStore()
      expect(store.userName).toBe('Guest')
      expect(store.userRole).toBe('Guest')
      expect(store.userInitials).toBe('GU')
    })
  })

  describe('setToken', () => {
    it('设置 token 时应该更新状态并保存到 localStorage', () => {
      const store = useAuthStore()
      const mockToken = 'test-token-123'

      store.setToken(mockToken)

      expect(store.token).toBe(mockToken)
      expect(globalThis.localStorage.setItem).toHaveBeenCalledWith('token', mockToken)
      expect(store.isAuthenticated).toBe(true)
    })

    it('传入空字符串应该清除 token', () => {
      const store = useAuthStore()
      store.setToken('valid-token')
      expect(store.isAuthenticated).toBe(true)

      store.setToken('')

      expect(store.token).toBe('')
      expect(globalThis.localStorage.removeItem).toHaveBeenCalledWith('token')
      expect(store.isAuthenticated).toBe(false)
    })

    it('传入 null 应该清除 token', () => {
      const store = useAuthStore()
      store.setToken('valid-token')

      store.setToken(null)

      expect(store.token).toBe('')
      expect(globalThis.localStorage.removeItem).toHaveBeenCalledWith('token')
    })
  })

  describe('setUser', () => {
    it('应该正确设置用户信息', () => {
      const store = useAuthStore()
      const mockUser: User = {
        id: '1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'Administrator'
      }

      store.setUser(mockUser)

      expect(store.user).toEqual(mockUser)
      expect(store.userName).toBe('Jane Doe')
      expect(store.userRole).toBe('Administrator')
    })

    it('应该正确计算用户首字母缩写', () => {
      const store = useAuthStore()

      store.setUser({ id: '1', name: 'John Smith', email: 'john@example.com', role: 'User' })
      expect(store.userInitials).toBe('JS')

      store.setUser({ id: '2', name: 'Alice Bob Carol', email: 'alice@example.com', role: 'User' })
      expect(store.userInitials).toBe('AB') // 只取前两个

      store.setUser({ id: '3', name: 'A', email: 'a@example.com', role: 'User' })
      expect(store.userInitials).toBe('A')
    })
  })

  describe('login', () => {
    it('登录成功应该设置用户和 token', async () => {
      const store = useAuthStore()
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      const result = await store.login(credentials)

      expect(store.user).toBeDefined()
      expect(store.user?.email).toBe(credentials.email)
      expect(store.token).toContain('mock-jwt-token')
      expect(store.isAuthenticated).toBe(true)
      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('token')
    })

    it('应该使用传入的 email 作为用户邮箱', async () => {
      const store = useAuthStore()

      await store.login({ email: 'custom@example.com', password: 'any' })

      expect(store.user?.email).toBe('custom@example.com')
    })
  })

  describe('logout', () => {
    it('登出应该清除所有状态和 localStorage', () => {
      const store = useAuthStore()

      // 先登录
      store.setToken('test-token')
      store.setUser({ id: '1', name: 'Test User', email: 'test@example.com', role: 'User' })
      expect(store.isAuthenticated).toBe(true)

      // 登出
      store.logout()

      expect(store.user).toBe(null)
      expect(store.token).toBe('')
      expect(store.isAuthenticated).toBe(false)
      expect(globalThis.localStorage.removeItem).toHaveBeenCalledWith('token')
    })
  })

  describe('fetchUser', () => {
    it('没有 token 时应该拒绝', async () => {
      const store = useAuthStore()

      await expect(store.fetchUser()).rejects.toBe('No token')
    })

    it('有 token 时应该获取用户信息', async () => {
      const store = useAuthStore()
      store.setToken('valid-token')

      const user = await store.fetchUser()

      expect(user).toBeDefined()
      expect(store.user).toBeDefined()
      expect(store.user?.name).toBe('John Doe')
    })
  })

  describe('边界情况', () => {
    it('user 为 null 时 userName 应该返回 Guest', () => {
      const store = useAuthStore()
      store.setUser(null)
      expect(store.userName).toBe('Guest')
    })

    it('user.name 为空字符串时应该返回 Guest', () => {
      const store = useAuthStore()
      store.setUser({ id: '1', name: '', email: '', role: 'Guest' })
      expect(store.userName).toBe('Guest')
    })

    it('user 为 null 时 userInitials 应该返回 GU', () => {
      const store = useAuthStore()
      store.setUser(null)
      expect(store.userInitials).toBe('GU')
    })

    it('不使用 || 默认值，且空字符串 name 时 userName 仍应回退到 Guest', () => {
      const store = useAuthStore()
      store.setUser({ id: '1', name: '', email: '', role: 'Guest' })
      expect(store.userName).toBe('Guest') // 空字符串是 falsy，但这里返回默认值
    })
  })
})
