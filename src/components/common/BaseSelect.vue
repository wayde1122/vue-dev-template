<template>
  <div
    ref="selectRef"
    class="base-select"
    :class="{ 'is-open': isOpen, 'is-error': error, 'is-disabled': disabled }"
  >
    <!-- 触发器 -->
    <button
      ref="triggerRef"
      type="button"
      class="select-trigger"
      :disabled="disabled"
      @click="toggleOpen"
      @keydown.down.prevent="openAndFocusFirst"
      @keydown.up.prevent="openAndFocusLast"
      @keydown.enter.prevent="toggleOpen"
      @keydown.space.prevent="toggleOpen"
      @keydown.escape="close"
    >
      <span class="select-value" :class="{ 'is-placeholder': !modelValue }">
        {{ displayValue }}
      </span>
      <svg
        class="select-arrow"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <!-- 下拉选项列表 - Teleport 到 body 避免被 Modal 遮挡 -->
    <Teleport to="body">
      <Transition name="dropdown">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="select-dropdown"
          :style="dropdownStyle"
        >
          <div class="select-options">
            <button
              v-for="(option, index) in options"
              :key="option.value"
              type="button"
              class="select-option"
              :class="{ 'is-selected': option.value === modelValue, 'is-focused': focusedIndex === index }"
              @click="selectOption(option.value)"
              @mouseenter="focusedIndex = index"
              @keydown.down.prevent="focusNext"
              @keydown.up.prevent="focusPrev"
              @keydown.enter.prevent="selectOption(option.value)"
              @keydown.escape="close"
            >
              <span class="option-label">{{ option.label }}</span>
              <svg
                v-if="option.value === modelValue"
                class="option-check"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'

export interface SelectOption {
  value: string
  label: string
}

const props = defineProps<{
  modelValue: string
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectRef = ref<HTMLDivElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)
const isOpen = ref(false)
const focusedIndex = ref(-1)

// 下拉面板位置
const dropdownStyle = ref<Record<string, string>>({})

const displayValue = computed(() => {
  if (!props.modelValue) {
    return props.placeholder ?? '请选择'
  }
  const option = props.options.find((o) => o.value === props.modelValue)
  return option?.label ?? props.modelValue
})

// 计算下拉面板位置
function updateDropdownPosition() {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  dropdownStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: '99999'
  }
}

function toggleOpen() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // 聚焦到当前选中项
    const selectedIndex = props.options.findIndex((o) => o.value === props.modelValue)
    focusedIndex.value = selectedIndex >= 0 ? selectedIndex : 0
    // 计算位置
    nextTick(() => {
      updateDropdownPosition()
    })
  }
}

function open() {
  if (props.disabled) return
  isOpen.value = true
  nextTick(() => {
    updateDropdownPosition()
  })
}

function close() {
  isOpen.value = false
  focusedIndex.value = -1
}

function openAndFocusFirst() {
  open()
  focusedIndex.value = 0
}

function openAndFocusLast() {
  open()
  focusedIndex.value = props.options.length - 1
}

function focusNext() {
  if (focusedIndex.value < props.options.length - 1) {
    focusedIndex.value++
  }
}

function focusPrev() {
  if (focusedIndex.value > 0) {
    focusedIndex.value--
  }
}

function selectOption(value: string) {
  emit('update:modelValue', value)
  close()
}

// 点击外部关闭
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node
  const isClickOnTrigger = selectRef.value?.contains(target)
  const isClickOnDropdown = dropdownRef.value?.contains(target)

  if (!isClickOnTrigger && !isClickOnDropdown) {
    close()
  }
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('click', handleClickOutside, true)
  } else {
    document.removeEventListener('click', handleClickOutside, true)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<style scoped>
.base-select {
  position: relative;
  width: 100%;
}

/* 触发器按钮 */
.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--color-text);
  text-align: left;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.select-trigger:hover:not(:disabled) {
  border-color: var(--color-border-hover);
}

.select-trigger:focus {
  outline: none;
  border-color: var(--color-cta);
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
}

.select-trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-select.is-open .select-trigger {
  border-color: var(--color-cta);
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
}

.base-select.is-error .select-trigger {
  border-color: var(--color-error);
}

.base-select.is-error .select-trigger:focus,
.base-select.is-error.is-open .select-trigger {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* 显示值 */
.select-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-value.is-placeholder {
  color: var(--color-text-light);
}

/* 下拉箭头 */
.select-arrow {
  flex-shrink: 0;
  margin-left: var(--spacing-sm);
  color: var(--color-text-muted);
  transition: color var(--transition-base), transform var(--transition-base);
}

.select-trigger:hover .select-arrow {
  color: var(--color-text);
}

.base-select.is-open .select-arrow {
  color: var(--color-cta);
  transform: rotate(180deg);
}
</style>

<style>
/* 下拉面板 - 全局样式（因为 Teleport 到 body） */
.select-dropdown {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.select-options {
  max-height: 240px;
  overflow-y: auto;
  padding: var(--spacing-xs);
}

/* 选项按钮 */
.select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--color-text);
  text-align: left;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}

.select-option:hover,
.select-option.is-focused {
  background: var(--color-background);
}

.select-option.is-selected {
  color: var(--color-cta);
  font-weight: 500;
}

.select-option.is-selected:hover,
.select-option.is-selected.is-focused {
  background: rgba(3, 105, 161, 0.08);
}

.option-label {
  flex: 1;
}

.option-check {
  flex-shrink: 0;
  margin-left: var(--spacing-sm);
  color: var(--color-cta);
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 滚动条 */
.select-options::-webkit-scrollbar {
  width: 6px;
}

.select-options::-webkit-scrollbar-track {
  background: transparent;
}

.select-options::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-lg);
}

.select-options::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-hover);
}
</style>
