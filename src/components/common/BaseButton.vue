<template>
  <button
    :class="buttonClass"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost', 'link'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: Boolean,
  loading: Boolean,
  block: Boolean,
  icon: Boolean
})

const buttonClass = computed(() => [
  'btn',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  {
    'btn-block': props.block,
    'btn-icon': props.icon,
    'btn-loading': props.loading
  }
])
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  font-family: inherit;
  font-weight: 500;
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.btn-sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.8125rem;
}

.btn-md {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.875rem;
}

.btn-lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 0.9375rem;
}

/* Icon only */
.btn-icon {
  padding: var(--spacing-sm);
}

/* Block */
.btn-block {
  width: 100%;
}

/* Variants */
.btn-primary {
  color: white;
  background: var(--color-cta);
  border-color: var(--color-cta);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-cta-hover);
  border-color: var(--color-cta-hover);
}

.btn-secondary {
  color: var(--color-text);
  background: var(--color-surface);
  border-color: var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--color-border-hover);
  background: var(--color-background);
}

.btn-danger {
  color: white;
  background: var(--color-error);
  border-color: var(--color-error);
}

.btn-danger:hover:not(:disabled) {
  background: #DC2626;
  border-color: #DC2626;
}

.btn-ghost {
  color: var(--color-text);
  background: transparent;
  border-color: transparent;
}

.btn-ghost:hover:not(:disabled) {
  background: var(--color-background);
}

.btn-link {
  color: var(--color-cta);
  background: transparent;
  border-color: transparent;
  padding: 0;
}

.btn-link:hover:not(:disabled) {
  text-decoration: underline;
}

/* Active state */
.btn:active:not(:disabled) {
  transform: scale(0.98);
}

/* Loading */
.btn-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.btn-secondary .btn-spinner,
.btn-ghost .btn-spinner {
  border-color: rgba(0, 0, 0, 0.1);
  border-top-color: var(--color-text-muted);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
