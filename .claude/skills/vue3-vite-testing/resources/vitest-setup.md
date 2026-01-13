# Vitest 在本项目的推荐配置（Vue 3 + Vite）

## 1) vite.config.js 增加 test 配置

说明：
- 使用 `jsdom` 跑组件测试
- 复用现有 alias：`@ -> ./src`
- 单测文件建议放 `src/**/__tests__/*.test.js` 或 `tests/**/*.test.js`

示例（按你现有 `vite.config.js` 结构添加即可）：

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true,
    clearMocks: true
  }
})
```

## 2) 新增 vitest.setup.js

```js
import '@testing-library/jest-dom'
```

## 3) package.json 增加脚本（可选但推荐）

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

