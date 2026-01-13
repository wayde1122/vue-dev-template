<template>
  <div :class="wrapperClass">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>
    <div class="input-wrapper" :class="{ 'input-focused': isFocused, 'input-error': hasError }">
      <span v-if="$slots.prefix" class="input-prefix">
        <slot name="prefix" />
      </span>
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        v-bind="$attrs"
      />
      <span v-if="$slots.suffix || clearable" class="input-suffix">
        <button
          v-if="clearable && modelValue"
          type="button"
          class="input-clear"
          @click="onClear"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <slot name="suffix" />
      </span>
    </div>
    <span v-if="helperText || hasError" class="input-helper">
      {{ hasError ? errorText : helperText }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: String,
  placeholder: String,
  helperText: String,
  errorText: String,
  disabled: Boolean,
  readonly: Boolean,
  required: Boolean,
  clearable: Boolean,
  maxlength: [String, Number],
  error: Boolean
})

const emit = defineEmits(['update:modelValue', 'clear', 'focus', 'blur'])

const isFocused = ref(false)
const inputId = `input-${Math.random().toString(36).slice(2, 9)}`

const hasError = computed(() => props.error || !!props.errorText)

function onInput(event) {
  emit('update:modelValue', event.target.value)
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
.wrapper-class {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.input-required {
  color: var(--color-error);
  margin-left: 2px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.input-wrapper:hover {
  border-color: var(--color-border-hover);
}

.input-wrapper.input-focused {
  border-color: var(--color-cta);
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
}

.input-wrapper.input-error {
  border-color: var(--color-error);
}

.input-wrapper.input-error.input-focused {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-wrapper input {
  flex: 1;
  padding: 0;
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--color-text);
  background: transparent;
  border: none;
  outline: none;
}

.input-wrapper input::placeholder {
  color: var(--color-text-light);
}

.input-wrapper input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  color: var(--color-text-muted);
}

.input-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  color: var(--color-text-light);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: color var(--transition-base);
}

.input-clear:hover {
  color: var(--color-text-muted);
}

.input-helper {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.input-wrapper.input-error + .input-helper {
  color: var(--color-error);
}
</style>
