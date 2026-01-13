<template>
  <div class="dashboard-view">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <div>
        <h1 class="welcome-title">Welcome back, {{ userName }}!</h1>
        <p class="welcome-subtitle">Here's what's happening with your projects today.</p>
      </div>
      <span class="date-display">{{ currentDate }}</span>
    </div>

    <!-- Stats Grid -->
    <DashboardStats />

    <!-- Charts Row -->
    <div class="charts-row">
      <DashboardChart
        title="Task Completion"
        subtitle="Weekly performance overview"
        type="bar"
      />
      <DashboardChart
        title="Team Productivity"
        subtitle="Tasks completed over time"
        type="line"
      />
    </div>

    <!-- Bottom Row -->
    <div class="bottom-row">
      <DashboardActivity />
      <QuickActions />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import DashboardStats from '@/components/DashboardStats.vue'
import DashboardChart from '@/components/DashboardChart.vue'
import DashboardActivity from '@/components/DashboardActivity.vue'
import QuickActions from '@/components/QuickActions.vue'

const { userName } = useAuth()
const currentDate = ref('')

onMounted(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  currentDate.value = new Date().toLocaleDateString('en-US', options)
})
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.03em;
}

.welcome-subtitle {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

.date-display {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.bottom-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-md);
}

@media (max-width: 1200px) {
  .charts-row,
  .bottom-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}
</style>
