/**
 * Dashboard Store
 * Dashboard 数据状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type {
  DashboardStats,
  DashboardChartData,
  Activity
} from './types'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const stats: Ref<DashboardStats> = ref({
    totalTasks: 2847,
    teamMembers: 156,
    hoursTracked: 1234,
    activeProjects: 42
  })

  const chartData: Ref<DashboardChartData> = ref({
    weekly: [
      { label: 'Mon', value: 65 },
      { label: 'Tue', value: 85, highlight: true },
      { label: 'Wed', value: 45 },
      { label: 'Thu', value: 70 },
      { label: 'Fri', value: 55 },
      { label: 'Sat', value: 90 },
      { label: 'Sun', value: 60 }
    ],
    productivity: [
      { label: 'Mon', value: 65 },
      { label: 'Tue', value: 85 },
      { label: 'Wed', value: 45 },
      { label: 'Thu', value: 70 },
      { label: 'Fri', value: 55 },
      { label: 'Sat', value: 90 },
      { label: 'Sun', value: 60 }
    ]
  })

  const activities: Ref<Activity[]> = ref([
    {
      id: 1,
      name: 'Sarah Chen',
      initials: 'SC',
      color: 'blue',
      action: 'completed task',
      target: 'Update landing page design',
      time: '2 minutes ago',
      status: 'done',
      statusLabel: 'Done'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      initials: 'MJ',
      color: 'green',
      action: 'created',
      target: 'New project proposal',
      time: '15 minutes ago',
      status: 'progress',
      statusLabel: 'In Progress'
    },
    {
      id: 3,
      name: 'Emily Davis',
      initials: 'ED',
      color: 'purple',
      action: 'commented on',
      target: 'API documentation',
      time: '1 hour ago',
      status: 'review',
      statusLabel: 'Review'
    },
    {
      id: 4,
      name: 'Alex Turner',
      initials: 'AT',
      color: 'orange',
      action: 'assigned',
      target: 'Bug fix #1420',
      time: '2 hours ago',
      status: 'todo',
      statusLabel: 'To Do'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      initials: 'LW',
      color: 'pink',
      action: 'archived',
      target: 'Old sprint tickets',
      time: '3 hours ago',
      status: 'done',
      statusLabel: 'Done'
    }
  ])

  const loading = ref(false)

  // Getters
  const recentActivities = computed(() => activities.value.slice(0, 5))
  const statsChange = computed(() => ({
    totalTasks: 12,
    teamMembers: 8,
    hoursTracked: -3,
    activeProjects: 18
  }))

  // Actions
  async function fetchDashboardData(): Promise<{
    stats: DashboardStats
    chartData: DashboardChartData
    activities: Activity[]
  }> {
    loading.value = true
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟 API 调用
        loading.value = false
        resolve({
          stats: stats.value,
          chartData: chartData.value,
          activities: activities.value
        })
      }, 800)
    })
  }

  function updateStat<K extends keyof DashboardStats>(
    key: K,
    value: DashboardStats[K]
  ): void {
    if (stats.value[key] !== undefined) {
      stats.value[key] = value
    }
  }

  function addActivity(activity: Omit<Activity, 'id' | 'time'>): void {
    activities.value.unshift({
      id: Date.now(),
      ...activity,
      time: 'Just now'
    })
  }

  return {
    // State
    stats,
    chartData,
    activities,
    loading,
    // Getters
    recentActivities,
    statsChange,
    // Actions
    fetchDashboardData,
    updateStat,
    addActivity
  }
})
