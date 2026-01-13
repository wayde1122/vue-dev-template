# 本项目 Claude 协作规则（Vue 3 + Vite）

本文件用于约束/指导 Claude 在本仓库中编写与修改代码时的行为，保证一致性、可维护性与可测试性。

## 技术栈与约定

- **框架**：Vue 3（SFC）、Vite、Pinia、Vue Router
- **模块体系**：ESM（浏览器端没有 `require`）
- **测试**：Vitest + JSDOM + Vue Test Utils + Testing Library
- **覆盖率**：V8 provider，HTML 报告在 `coverage/`

## 代码风格（必须遵守）

- **默认值**：禁止用 `||` 做默认值，必须用 `??` 或 `??=`
- **去重与查找**：使用 `Set` / `Map`
- **对象迭代**：优先 `Object.entries()` / `Object.fromEntries()`
- **循环**：需要 `break/continue` 时用 `for...of`，不要用 `forEach`
- **日期/数字/货币**：使用 `Intl` API
- **可见性/懒加载**：使用 `IntersectionObserver`，不要用滚动监听
- **并发请求**：允许部分失败时使用 `Promise.allSettled()`

## 目录职责（高层）

- `src/components/`：UI 组件（尽量保持无业务、可复用）
- `src/views/`：页面级组件（组合布局、调用 store/composables）
- `src/stores/`：Pinia 状态（业务状态 + actions + getters）
- `src/composables/`：可复用逻辑（可与 store 组合，但避免循环依赖）
- `src/router/`：路由配置与守卫（只做导航/鉴权/标题等导航层关注点）
- `src/utils/`：纯工具（无 Vue 依赖）
- `src/lib/`：第三方封装/适配层（必要时才引入）
- `src/__test__/`：单测（store/guard 等优先）

## 修改代码时的原则

- **最小改动**：尽量局部修改，避免无关重构。
- **先保证可运行**：修复 ESM/CJS 混用问题（浏览器端不允许 `require`）。
- **可测试性优先**：复杂逻辑优先抽到 `utils/` 或 composables，使其可单测。
- **一致的错误处理**：明确边界输入与失败分支，不要吞异常。

## 测试约定（推荐）

- 单测命令：
  - `npm run test`
  - `npm run test:run`
  - `npm run test:coverage`
- 测试文件建议：
  - `src/**/__test__/*.test.js` 或 `src/__test__/*.test.js`（保持一致即可）
- 涉及时间：
  - 使用 `vi.useFakeTimers()` 或固定 `Date`，避免在 CI 上偶现

# 本项目 Claude 协作规则（Vue 3 + Vite）

本文件用于约束/指导 Claude 在本仓库中编写与修改代码时的行为，保证一致性、可维护性与可测试性。

## 技术栈与约定

- **框架**：Vue 3（SFC）、Vite、Pinia、Vue Router
- **模块体系**：ESM（浏览器端没有 `require`）
- **测试**：Vitest + JSDOM + Vue Test Utils + Testing Library
- **覆盖率**：V8 provider，HTML 报告在 `coverage/`

## 代码风格（必须遵守）

- **默认值**：禁止用 `||` 做默认值，必须用 `??` 或 `??=`
- **去重与查找**：使用 `Set` / `Map`
- **对象迭代**：优先 `Object.entries()` / `Object.fromEntries()`
- **循环**：需要 `break/continue` 时用 `for...of`，不要用 `forEach`
- **日期/数字/货币**：使用 `Intl` API
- **可见性/懒加载**：使用 `IntersectionObserver`，不要用滚动监听
- **并发请求**：允许部分失败时使用 `Promise.allSettled()`

## 目录职责（高层）

- `src/components/`：UI 组件（尽量保持无业务、可复用）
- `src/views/`：页面级组件（组合布局、调用 store/composables）
- `src/stores/`：Pinia 状态（业务状态 + actions + getters）
- `src/composables/`：可复用逻辑（可与 store 组合，但避免循环依赖）
- `src/router/`：路由配置与守卫（只做导航/鉴权/标题等导航层关注点）
- `src/utils/`：纯工具（无 Vue 依赖）
- `src/lib/`：第三方封装/适配层（必要时才引入）
- `src/__test__/`：单测（store/guard 等优先）

## 修改代码时的原则

- **最小改动**：尽量局部修改，避免无关重构。
- **先保证可运行**：修复 ESM/CJS 混用问题（浏览器端不允许 `require`）。
- **可测试性优先**：复杂逻辑优先抽到 `utils/` 或 composables，使其可单测。
- **一致的错误处理**：明确边界输入与失败分支，不要吞异常。

## 测试约定（推荐）

- 单测命令：
  - `npm run test`
  - `npm run test:run`
  - `npm run test:coverage`
- 测试文件建议：
  - `src/**/__test__/*.test.js` 或 `src/__test__/*.test.js`（保持一致即可）
- 涉及时间：
  - 使用 `vi.useFakeTimers()` 或固定 `Date`，避免在 CI 上偶现
