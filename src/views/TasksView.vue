<template>
  <div class="tasks-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Tasks</h1>
        <p class="page-subtitle">Manage and track your tasks</p>
      </div>
      <BaseButton @click="openCreateModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Task
      </BaseButton>
    </div>

    <!-- Filters -->
    <div class="task-filters">
      <div class="filter-tabs">
        <button
          v-for="tab in filters"
          :key="tab.value"
          class="filter-tab"
          :class="{ active: filter === tab.value }"
          @click="setFilter(tab.value)"
        >
          {{ tab.label }}
          <span class="filter-count">{{ tab.count }}</span>
        </button>
      </div>
      <BaseInput
        v-model="searchQuery"
        placeholder="Search tasks..."
        clearable
        style="width: 280px;"
      >
        <template #prefix>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </template>
      </BaseInput>
    </div>

    <!-- Task List -->
    <div v-if="!loading" class="task-list">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-item"
        :class="{ completed: task.completed }"
      >
        <label class="task-checkbox">
          <input type="checkbox" :checked="task.completed" @change="toggleTask(task.id)" />
          <span class="checkbox-custom"></span>
        </label>
        <div class="task-content">
          <span class="task-text">{{ task.text }}</span>
          <span class="task-meta">
            <span class="task-priority" :class="`priority-${task.priority}`">{{ task.priority }}</span>
            <span class="task-due">{{ task.dueDate }}</span>
          </span>
        </div>
        <button class="task-delete" @click="deleteTask(task.id)" aria-label="Delete task">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <div v-if="filteredTasks.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <p>No tasks found</p>
      </div>
    </div>

    <div v-else class="loading-state">
      <div class="spinner"></div>
      <p>Loading tasks...</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { useTask } from '@/composables/useTask'
import { useNotification } from '@/composables/useNotification'

const {
  filteredTasks,
  filter,
  searchQuery,
  loading,
  activeCount,
  completedCount,
  totalCount,
  fetchTasks,
  toggleTask,
  deleteTask,
  setFilter
} = useTask()

const { success } = useNotification()

const filters = computed(() => [
  { label: 'All', value: 'all', count: totalCount.value },
  { label: 'Active', value: 'active', count: activeCount.value },
  { label: 'Completed', value: 'completed', count: completedCount.value }
])

onMounted(() => {
  fetchTasks()
})

function openCreateModal() {
  success('Create task modal opened')
}
</script>

<style scoped>
.tasks-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

.task-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-xs);
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.filter-tab:hover {
  color: var(--color-text);
  background: var(--color-background);
}

.filter-tab.active {
  color: var(--color-cta);
  background: rgba(3, 105, 161, 0.1);
}

.filter-count {
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  background: var(--color-background);
  border-radius: var(--radius-sm);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.task-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.task-item:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.task-item.completed .task-text {
  color: var(--color-text-light);
  text-decoration: line-through;
}

.task-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.task-checkbox input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  transition: all var(--transition-base);
}

.task-checkbox input:checked + .checkbox-custom {
  background: var(--color-success);
  border-color: var(--color-success);
}

.task-checkbox input:checked + .checkbox-custom::after {
  content: '';
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translateY(-1px);
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.task-text {
  font-size: 0.9375rem;
  color: var(--color-text);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.task-priority {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: capitalize;
}

.priority-high { color: #DC2626; background: rgba(220, 38, 38, 0.1); }
.priority-medium { color: #F59E0B; background: rgba(245, 158, 11, 0.1); }
.priority-low { color: var(--color-success); background: rgba(34, 197, 94, 0.1); }

.task-due {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.task-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--color-text-light);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition-base);
}

.task-item:hover .task-delete {
  opacity: 1;
}

.task-delete:hover {
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

.empty-state,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-muted);
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-cta);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .task-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-tabs {
    justify-content: center;
  }
}
</style>
