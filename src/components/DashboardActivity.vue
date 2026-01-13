<template>
  <div class="activity-card">
    <div class="activity-header">
      <h3 class="activity-title">Recent Activity</h3>
      <a href="#" class="view-all">View All</a>
    </div>

    <div class="activity-list">
      <div
        v-for="item in activities"
        :key="item.id"
        class="activity-item"
      >
        <div class="activity-avatar" :class="`avatar-${item.color}`">
          {{ item.initials }}
        </div>
        <div class="activity-content">
          <p class="activity-text">
            <span class="activity-name">{{ item.name }}</span>
            {{ item.action }}
            <a href="#" class="activity-link">{{ item.target }}</a>
          </p>
          <span class="activity-time">{{ item.time }}</span>
        </div>
        <div class="activity-status" :class="`status-${item.status}`">
          {{ item.statusLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const activities = [
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
]
</script>

<style scoped>
/* ===================================
   Dashboard Activity - Enterprise Style
   =================================== */

.activity-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.activity-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.view-all {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-cta);
  text-decoration: none;
  transition: color var(--transition-base);
}

.view-all:hover {
  color: var(--color-cta-hover);
}

.activity-list {
  padding: var(--spacing-md);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  transition: background var(--transition-base);
}

.activity-item:hover {
  background: var(--color-background);
}

/* Avatar */
.activity-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.avatar-blue { background: #3B82F6; }
.avatar-green { background: #22C55E; }
.avatar-purple { background: #8B5CF6; }
.avatar-orange { background: #F59E0B; }
.avatar-pink { background: #EC4899; }

/* Content */
.activity-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.activity-text {
  font-size: 0.875rem;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-name {
  font-weight: 500;
}

.activity-link {
  color: var(--color-cta);
  text-decoration: none;
  font-weight: 500;
}

.activity-link:hover {
  text-decoration: underline;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

/* Status */
.activity-status {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.status-done {
  color: var(--color-success);
  background: rgba(34, 197, 94, 0.1);
}

.status-progress {
  color: var(--color-cta);
  background: rgba(3, 105, 161, 0.1);
}

.status-review {
  color: #8B5CF6;
  background: rgba(139, 92, 246, 0.1);
}

.status-todo {
  color: var(--color-text-muted);
  background: rgba(148, 163, 184, 0.1);
}

/* Responsive */
@media (max-width: 640px) {
  .activity-item {
    flex-wrap: wrap;
  }

  .activity-status {
    order: -1;
    margin-left: auto;
  }
}
</style>
