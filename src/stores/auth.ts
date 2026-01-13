/**
 * Auth Store
 * 用户认证状态管理 - 使用 Pinia + Composition API 风格
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { User, LoginCredentials, LoginResponse } from './types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user: Ref<User | null> = ref(null)
  const token = ref(localStorage.getItem('token') ?? '')

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || 'Guest')
  const userRole = computed(() => user.value?.role ?? 'user')
  const userInitials = computed(() => {
    if (!user.value?.name) return 'GU'
    return user.value.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  // Actions
  function setUser(userData: User | null): void {
    user.value = userData
  }

  function setToken(newToken: string | null): void {
    token.value = newToken ?? ''
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  function login(credentials: LoginCredentials): Promise<LoginResponse> {
    // 模拟 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: credentials.email,
          role: 'Administrator',
          avatar: null
        }
        const mockToken = 'mock-jwt-token-' + Date.now()

        setUser(mockUser)
        setToken(mockToken)
        resolve({ user: mockUser, token: mockToken })
      }, 500)
    })
  }

  function logout(): void {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  function fetchUser(): Promise<User> {
    // 模拟获取用户信息
    if (!token.value) return Promise.reject('No token')

    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Administrator'
        }
        setUser(mockUser)
        resolve(mockUser)
      }, 300)
    })
  }

  return {
    // State
    user,
    token,
    // Getters
    isAuthenticated,
    userName,
    userRole,
    userInitials,
    // Actions
    setUser,
    setToken,
    login,
    logout,
    fetchUser
  }
})
