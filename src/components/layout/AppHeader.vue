<template>
  <header class="app-header">
    <!-- Search -->
    <div class="header-search">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        placeholder="Search tasks, projects, team members..."
        class="search-input"
      />
      <kbd class="search-kbd">⌘K</kbd>
    </div>

    <!-- Actions -->
    <div class="header-actions">
      <button class="icon-btn" aria-label="Notifications">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span class="notification-badge">3</span>
      </button>

      <div class="header-divider"></div>

      <BaseButton size="sm" @click="handleNewTask">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>New Task</span>
      </BaseButton>
    </div>
  </header>
</template>

<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import { useNotification } from '@/composables/useNotification'

const { success } = useNotification()

function handleNewTask() {
  success('New task modal opened', 'Success')
  // TODO: Open task modal
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
  height: 73px;
  box-sizing: border-box;
}

.header-search {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  max-width: 480px;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.header-search:focus-within {
  border-color: var(--color-cta);
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
}

.search-icon {
  color: var(--color-text-light);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 0;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--color-text);
  background: transparent;
  border: none;
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-light);
}

.search-kbd {
  display: flex;
  align-items: center;
  padding: 0.125rem 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-light);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: inherit;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.icon-btn:hover {
  color: var(--color-text);
  background: var(--color-background);
}

.notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 0.625rem;
  font-weight: 600;
  color: white;
  background: var(--color-error);
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-surface);
}

.header-divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
  margin: 0 var(--spacing-xs);
}

/* Responsive */
@media (max-width: 768px) {
  .app-header {
    padding: var(--spacing-md);
  }

  .search-kbd {
    display: none;
  }
}
</style>
