<template>
  <div class="todo-container">
    <!-- Header -->
    <div class="todo-header">
      <h2 class="todo-title">Tasks</h2>
      <p class="todo-subtitle">{{ activeCount }} active task{{ activeCount !== 1 ? 's' : '' }}</p>
    </div>

    <!-- Input Section -->
    <div class="input-section">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        type="text"
        placeholder="Add a new task..."
        class="todo-input"
      />
      <button @click="addTodo" class="add-btn" :disabled="!newTodo.trim()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add</span>
      </button>
    </div>

    <!-- Task List -->
    <ul class="todo-list" v-if="todos.length > 0">
      <li
        v-for="todo in todos"
        :key="todo.id"
        :class="{ 'completed': todo.completed }"
        class="todo-item"
      >
        <label class="checkbox-wrapper">
          <input type="checkbox" v-model="todo.completed" class="checkbox" />
          <span class="checkbox-custom"></span>
        </label>
        <span class="todo-text">{{ todo.text }}</span>
        <button
          @click="removeTodo(todo.id)"
          class="delete-btn"
          :aria-label="'Delete task: ' + todo.text"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </li>
    </ul>

    <!-- Empty State -->
    <div class="empty-state" v-else>
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <p>No tasks yet. Add one to get started.</p>
    </div>

    <!-- Footer -->
    <div class="todo-footer" v-if="todos.length > 0">
      <span class="footer-count">
        <span class="count-number">{{ activeCount }}</span>
        <span class="count-text">of {{ todos.length }} remaining</span>
      </span>
      <button
        @click="clearCompleted"
        v-if="completedCount > 0"
        class="clear-btn"
      >
        Clear completed ({{ completedCount }})
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const todos = ref([])
const newTodo = ref('')

let id = 0

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: id++,
      text: newTodo.value.trim(),
      completed: false
    })
    newTodo.value = ''
  }
}

const removeTodo = (todoId) => {
  todos.value = todos.value.filter(t => t.id !== todoId)
}

const clearCompleted = () => {
  todos.value = todos.value.filter(t => !t.completed)
}

const activeCount = computed(() => {
  return todos.value.filter(t => !t.completed).length
})

const completedCount = computed(() => {
  return todos.value.filter(t => t.completed).length
})
</script>

<style scoped>
/* ===================================
   Todo List - Enterprise Minimal Style
   =================================== */

.todo-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

/* Header */
.todo-header {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.todo-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.025em;
}

.todo-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Input Section */
.input-section {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.todo-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--color-text);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.todo-input::placeholder {
  color: var(--color-text-light);
}

.todo-input:hover {
  border-color: var(--color-border-hover);
}

.todo-input:focus {
  outline: none;
  border-color: var(--color-cta);
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background: var(--color-cta);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background-color var(--transition-base), transform var(--transition-fast);
}

.add-btn:hover:not(:disabled) {
  background: var(--color-cta-hover);
}

.add-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-btn svg {
  flex-shrink: 0;
}

/* Task List */
.todo-list {
  list-style: none;
  max-height: 400px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--transition-base);
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background: var(--color-background);
}

.todo-item.completed .todo-text {
  color: var(--color-text-light);
  text-decoration: line-through;
}

/* Checkbox */
.checkbox-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox {
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

.checkbox-wrapper:hover .checkbox-custom {
  border-color: var(--color-border-hover);
}

.checkbox:checked + .checkbox-custom {
  background: var(--color-success);
  border-color: var(--color-success);
}

.checkbox:checked + .checkbox-custom::after {
  content: '';
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translateY(-1px);
}

/* Task Text */
.todo-text {
  flex: 1;
  font-size: 0.9375rem;
  color: var(--color-text);
  word-break: break-word;
}

/* Delete Button */
.delete-btn {
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

.todo-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

.delete-btn:active {
  transform: scale(0.95);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-xl);
  color: var(--color-text-light);
  text-align: center;
}

.empty-state svg {
  margin-bottom: var(--spacing-md);
  opacity: 0.4;
}

.empty-state p {
  font-size: 0.9375rem;
}

/* Footer */
.todo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
}

.footer-count {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.count-number {
  font-weight: 600;
  color: var(--color-text);
}

.count-text {
  margin-left: 0.25rem;
}

.clear-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.clear-btn:hover {
  color: var(--color-text);
  border-color: var(--color-border-hover);
  background: var(--color-surface);
}

.clear-btn:active {
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 480px) {
  .todo-header,
  .input-section,
  .todo-item,
  .todo-footer {
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }

  .delete-btn {
    opacity: 1;
  }

  .add-btn span {
    display: none;
  }

  .add-btn {
    padding: var(--spacing-sm);
  }
}
</style>
