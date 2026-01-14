/**
 * Shared Type Definitions
 */

// User types
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string | null
}

export type UserRole = 'Administrator' | 'User' | 'Guest'

// Task types
export interface Task {
  id: number
  text: string
  completed: boolean
  priority: TaskPriority
  dueDate: string
}

export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskFilter = 'all' | 'active' | 'completed'

// Login credentials
export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

// Dashboard types
export interface DashboardStats {
  totalTasks: number
  teamMembers: number
  hoursTracked: number
  activeProjects: number
}

export interface ChartDataPoint {
  label: string
  value: number
  highlight?: boolean
}

export interface Activity {
  id: number
  name: string
  initials: string
  color: string
  action: string
  target: string
  time: string
  status: string
  statusLabel: string
}

export interface DashboardChartData {
  weekly: ChartDataPoint[]
  productivity: ChartDataPoint[]
}

// ======== Team Member Types ========

/**
 * 性别枚举
 */
export type Gender = '男' | '女'

export const GENDERS: Gender[] = ['男', '女']

/**
 * 所属部门枚举
 */
export type Department = '技术部' | '产品部' | '设计部' | '市场部' | '人事部' | '财务部' | '运营部'

export const DEPARTMENTS: Department[] = ['技术部', '产品部', '设计部', '市场部', '人事部', '财务部', '运营部']

/**
 * 职级枚举
 */
export type Level = '初级' | '中级' | '高级' | '专家' | '资深专家'

export const LEVELS: Level[] = ['初级', '中级', '高级', '专家', '资深专家']

/**
 * 团队成员
 */
export interface Member {
  id: string
  name: string
  gender: Gender
  idCardNumber: string
  jobTitle: string
  department: Department
  level: Level
  createdAt: string
  updatedAt: string
}

/**
 * 创建/编辑成员时的表单数据（不含 id、createdAt、updatedAt）
 */
export type MemberFormData = Omit<Member, 'id' | 'createdAt' | 'updatedAt'>
