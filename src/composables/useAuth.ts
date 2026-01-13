/**
 * useAuth Composable
 * 认证相关的组合式函数 - 封装常用认证逻辑
 */

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials, LoginResponse, UserRole } from '@/stores/types'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  // 计算属性
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const userName = computed(() => authStore.userName)
  const userRole = computed(() => authStore.userRole)
  const userInitials = computed(() => authStore.userInitials)

  // 登录
  async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    const result = await authStore.login(credentials)
    // 登录成功后跳转
    const queryRedirect = router.currentRoute.value.query.redirect
    const redirect =
      typeof queryRedirect === 'string' && queryRedirect.length > 0 ? queryRedirect : '/dashboard'
    await router.push(redirect)
    return result
  }

  // 登出
  function logout(): void {
    authStore.logout()
    router.push('/login')
  }

  // 检查权限
  function hasRole(role: UserRole): boolean {
    return authStore.userRole === role
  }

  function hasPermission(_permission: string): boolean {
    // 简单的权限检查逻辑
    if (authStore.userRole === 'Administrator') return true
    return false
  }

  return {
    // State
    isAuthenticated,
    user,
    userName,
    userRole,
    userInitials,
    // Actions
    login,
    logout,
    hasRole,
    hasPermission
  }
}
