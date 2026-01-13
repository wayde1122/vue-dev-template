/**
 * Vitest Setup File
 * 测试环境全局配置
 */

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/vue'
import { afterEach, vi } from 'vitest'

// 每个测试后清理 DOM
afterEach(() => {
  cleanup()
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  get length() {
    return 0
  },
  key: vi.fn()
}

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock
})

// Mock document.title
Object.defineProperty(document, 'title', {
  writable: true,
  value: ''
})
