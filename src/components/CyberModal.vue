<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click.self="closeOnOverlay && $emit('update:modelValue', false)">
      <div class="modal-container" :class="sizeClass">
        <!-- Header -->
        <div class="modal-header" v-if="$slots.header || title">
          <slot name="header">
            <h3 class="modal-title">{{ title }}</h3>
          </slot>
          <button
            v-if="showClose"
            @click="$emit('update:modelValue', false)"
            class="close-btn"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body" :class="{ 'no-header': !$slots.header && !title }">
          <slot></slot>
        </div>

        <!-- Footer -->
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

defineEmits(['update:modelValue'])

const sizeClass = computed(() => `modal-${props.size}`)
</script>

<style scoped>
/* ===================================
   Modal - Enterprise Minimal Style
   =================================== */

/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

/* Container */
.modal-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  max-width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-small {
  width: 100%;
  max-width: 380px;
}

.modal-medium {
  width: 100%;
  max-width: 520px;
}

.modal-large {
  width: 100%;
  max-width: 720px;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.025em;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.close-btn:hover {
  color: var(--color-text);
  background: var(--color-background);
}

.close-btn:active {
  transform: scale(0.95);
}

/* Body */
.modal-body {
  padding: var(--spacing-xl);
  color: var(--color-text);
  font-size: 0.9375rem;
  line-height: 1.6;
  overflow-y: auto;
  flex: 1;
}

.modal-body.no-header {
  padding-top: var(--spacing-xl);
}

/* Scrollbar */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-lg);
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-hover);
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
}

/* Transitions */
.modal-enter-active {
  transition: all var(--transition-slow) ease-out;
}

.modal-leave-active {
  transition: all var(--transition-base) ease-in;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

.modal-enter-from .modal-overlay,
.modal-leave-to .modal-overlay {
  opacity: 0;
}

/* Form element deep styles for modal content */
.modal-body :deep(input),
.modal-body :deep(select),
.modal-body :deep(textarea) {
  font-family: inherit;
  font-size: 0.9375rem;
}

.modal-body :deep(select) option {
  background: var(--color-surface);
  color: var(--color-text);
}

/* Responsive */
@media (max-width: 480px) {
  .modal-container {
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer :deep(button) {
    width: 100%;
  }
}
</style>
