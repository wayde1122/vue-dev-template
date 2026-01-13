<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-title-group">
        <h3 class="chart-title">{{ title }}</h3>
        <p class="chart-subtitle">{{ subtitle }}</p>
      </div>
      <div class="chart-actions">
        <button
          v-for="period in periods"
          :key="period.value"
          @click="selectedPeriod = period.value"
          class="period-btn"
          :class="{ active: selectedPeriod === period.value }"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <div class="chart-content">
      <!-- Bar Chart -->
      <div v-if="type === 'bar'" class="bar-chart">
        <div class="chart-y-axis">
          <span class="y-label">100</span>
          <span class="y-label">75</span>
          <span class="y-label">50</span>
          <span class="y-label">25</span>
          <span class="y-label">0</span>
        </div>
        <div class="chart-bars">
          <div
            v-for="(item, index) in chartData"
            :key="index"
            class="bar-wrapper"
          >
            <div
              class="bar"
              :style="{ height: item.value + '%' }"
              :class="{ 'bar-highlight': item.highlight }"
            ></div>
            <span class="bar-label">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- Line Chart -->
      <div v-else class="line-chart">
        <svg class="line-chart-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:var(--color-cta);stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:var(--color-cta);stop-opacity:0" />
            </linearGradient>
          </defs>
          <!-- Grid Lines -->
          <line v-for="i in 5" :key="'grid-' + i"
            :x1="0"
            :y1="(i - 1) * 50"
            :x2="400"
            :y2="(i - 1) * 50"
            class="grid-line"
          />
          <!-- Area Fill -->
          <path
            :d="areaPath"
            class="area-fill"
          />
          <!-- Line -->
          <path
            :d="linePath"
            class="chart-line"
          />
          <!-- Points -->
          <circle
            v-for="(point, index) in points"
            :key="'point-' + index"
            :cx="point.x"
            :cy="point.y"
            r="5"
            class="chart-point"
          />
        </svg>
        <div class="x-axis">
          <span
            v-for="(label, index) in chartData.map(d => d.label)"
            :key="index"
            class="x-label"
          >{{ label }}</span>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="chart-legend">
      <div class="legend-item">
        <span class="legend-dot legend-dot-primary"></span>
        <span class="legend-text">This Period</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot legend-dot-secondary"></span>
        <span class="legend-text">Previous Period</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Overview'
  },
  subtitle: {
    type: String,
    default: 'Monthly performance'
  },
  type: {
    type: String,
    default: 'bar',
    validator: (value) => ['bar', 'line'].includes(value)
  }
})

const selectedPeriod = ref('week')

const periods = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' }
]

const chartData = ref([
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 85, highlight: true },
  { label: 'Wed', value: 45 },
  { label: 'Thu', value: 70 },
  { label: 'Fri', value: 55 },
  { label: 'Sat', value: 90 },
  { label: 'Sun', value: 60 }
])

// Generate SVG path for line chart
const points = computed(() => {
  const width = 400
  const height = 200
  const padding = 10
  const data = chartData.value
  const stepX = (width - padding * 2) / (data.length - 1)

  return data.map((item, index) => ({
    x: padding + index * stepX,
    y: height - (item.value / 100) * (height - padding * 2) - padding
  }))
})

const linePath = computed(() => {
  if (points.value.length === 0) return ''
  let path = `M ${points.value[0].x} ${points.value[0].y}`
  for (let i = 1; i < points.value.length; i++) {
    path += ` L ${points.value[i].x} ${points.value[i].y}`
  }
  return path
})

const areaPath = computed(() => {
  if (points.value.length === 0) return ''
  const height = 200
  let path = linePath.value
  path += ` L ${points.value[points.value.length - 1].x} ${height}`
  path += ` L ${points.value[0].x} ${height} Z`
  return path
})
</script>

<style scoped>
/* ===================================
   Dashboard Chart - Enterprise Style
   =================================== */

.chart-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.chart-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.chart-subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.chart-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.period-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.period-btn:hover {
  color: var(--color-text);
  border-color: var(--color-border-hover);
}

.period-btn.active {
  color: var(--color-cta);
  border-color: var(--color-cta);
  background: rgba(3, 105, 161, 0.1);
}

.chart-content {
  padding: var(--spacing-xl);
}

/* Bar Chart */
.bar-chart {
  display: flex;
  gap: var(--spacing-lg);
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: var(--spacing-md);
}

.y-label {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-sm);
  height: 200px;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.bar {
  width: 100%;
  max-width: 40px;
  height: 0;
  min-height: 4px;
  background: var(--color-cta);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  transition: height 0.5s ease-out, background var(--transition-base);
}

.bar:hover {
  background: var(--color-cta-hover);
}

.bar-highlight {
  background: #8B5CF6;
}

.bar-highlight:hover {
  background: #7C3AED;
}

.bar-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Line Chart */
.line-chart {
  display: flex;
  flex-direction: column;
}

.line-chart-svg {
  width: 100%;
  height: 200px;
  overflow: visible;
}

.grid-line {
  stroke: var(--color-border);
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

.area-fill {
  fill: url(#gradient);
  opacity: 0.2;
}

.chart-line {
  fill: none;
  stroke: var(--color-cta);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-point {
  fill: var(--color-surface);
  stroke: var(--color-cta);
  stroke-width: 2.5;
  cursor: pointer;
  transition: all var(--transition-base);
}

.chart-point:hover {
  r: 7;
  fill: var(--color-cta);
}

.x-axis {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-sm);
}

.x-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Legend */
.chart-legend {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-xl);
  border-top: 1px solid var(--color-border);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot-primary {
  background: var(--color-cta);
}

.legend-dot-secondary {
  background: var(--color-border);
}

.legend-text {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

/* Responsive */
@media (max-width: 640px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .chart-actions {
    width: 100%;
  }

  .period-btn {
    flex: 1;
  }

  .chart-y-axis {
    display: none;
  }

  .bar-label {
    font-size: 0.625rem;
  }

  .x-label {
    font-size: 0.625rem;
  }
}
</style>
