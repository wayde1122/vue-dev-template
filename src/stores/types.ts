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
