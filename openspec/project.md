# 项目 上下文

## 目的
本项目是一个基于 **Vue 3 + TypeScript + Vite** 的前端应用模板/示例项目（`package.json` 名称：`simple-todolist`），用于演示与承载常见的企业后台交互形态（如仪表盘、任务列表、通知、登录鉴权等），并内置完整的工程化与 AI 协作规范，便于快速迭代与持续维护。

## 技术栈
- **运行时/模块**：ESM（`package.json`：`"type": "module"`）
- **框架**：Vue 3（Composition API，SFC）
- **语言**：TypeScript（`strict: true`）
- **构建/开发**：Vite 5
- **路由**：Vue Router 4
- **状态管理**：Pinia
- **测试**：Vitest + JSDOM + `@testing-library/vue` + `@testing-library/jest-dom`
- **覆盖率**：V8 provider（输出 `text/json/html`，HTML 报告在 `coverage/`）
- **代码规范**：ESLint 9（flat config）+ `eslint-plugin-vue` + `@typescript-eslint/*`
- **Git Hooks**：Husky + lint-staged
- **提交规范**：Commitlint（Conventional Commits）

### 常用命令（scripts）
- **开发**：`npm run dev`
- **构建**：`npm run build`（`vue-tsc && vite build`）
- **预览**：`npm run preview`
- **类型检查**：`npm run type-check`
- **Lint**：`npm run lint` / `npm run lint:fix`
- **测试**：`npm run test` / `npm run test:run` / `npm run test:coverage`

## 项目约定

### 代码风格
以下约定是本仓库的“必须遵守”规则（来源：`CLAUDE.md` 与 `src/**/RULES.md`）：

- **ESM Only**：浏览器端代码禁止使用 `require` / `module.exports`
- **默认值**：禁止使用 `||` 做默认值，必须使用 `??` / `??=`
- **数据结构**：去重与快速查找优先 `Set` / `Map`
- **对象转换**：优先 `Object.entries()` / `Object.fromEntries()`
- **循环选择**：需要 `break/continue` 时使用 `for...of`，不要用 `forEach`
- **日期/数字/货币格式化**：展示层统一使用 `Intl` API
- **可见性/懒加载**：使用 `IntersectionObserver`，不要写滚动监听（scroll listener）
- **并发请求**：允许部分失败时使用 `Promise.allSettled()`

命名与组织：
- **composables 命名**：统一 `useXxx`（例如 `useAuth`、`useTask`）
- **可复用逻辑下沉**：优先把纯逻辑抽到 `src/utils/` 或 `src/composables/`，提升复用与可测试性
- **页面职责**：`src/views/` 只做组合与编排（组合组件、调用 store/composables、管理页面级交互）
- **组件职责**：`src/components/` 尽量通用、低耦合、可测试；避免在组件顶层做 I/O（localStorage/network）

### 架构模式
目录职责（高层约定，来源：`CLAUDE.md`）：
- `src/components/`：UI/布局组件（可复用、低耦合）
- `src/views/`：页面级组件（组合布局与业务组件，编排交互）
- `src/stores/`：Pinia 状态（按领域拆分：如 `auth/task/dashboard`；副作用集中在 actions）
- `src/composables/`：可复用“有状态或带副作用”的逻辑（订阅/监听需可清理）
- `src/router/`：路由映射与导航层关注点（鉴权跳转、标题设置等）
- `src/utils/`：纯工具函数（无 Vue 依赖）
- `src/lib/`：第三方封装/适配层（必要时才引入）

TypeScript/构建约定：
- **路径别名**：`@/*` 指向 `src/*`（见 `tsconfig.json` 与 `vite.config.ts`）
- **严格模式**：`tsconfig.json` 启用 `strict`、`noUnusedLocals`、`noUnusedParameters` 等约束

### 测试策略
测试框架与环境：
- 使用 **Vitest**，运行环境为 **JSDOM**（见 `vite.config.ts` 的 `test` 配置）
- 全局测试初始化在 `vitest.setup.ts`（引入 `@testing-library/jest-dom/vitest`，并在 `afterEach` 执行 `cleanup()`）

测试建议（优先级）：
- **stores/composables/router guard** 等纯逻辑优先写单测（示例：`src/__test__/auth.test.ts`、`src/__test__/task.test.ts`）
- 涉及时间的逻辑在测试中使用 `vi.useFakeTimers()` 或固定时间，避免 CI 偶现

### Git工作流
提交约定：
- 遵循 **Conventional Commits**
- `commitlint.config.js` 允许的 type：`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`chore`、`revert`、`types`

Git Hooks（Husky）：
- **pre-commit**：运行 `npx lint-staged` 与 `npm run test:run`（见 `.husky/pre-commit`）
- **commit-msg**：运行 `commitlint --edit` 校验提交信息（见 `.husky/commit-msg`）

lint-staged：
- 仅对 `src/**/*.{js,ts,vue}` 执行 `eslint --fix`（见 `package.json` 的 `lint-staged` 配置）

## 领域上下文
本项目的主要领域概念（以现有代码/目录为准）：
- **鉴权**：`auth` 领域的状态与行为集中在 `src/stores/auth.ts` 与 `src/composables/useAuth.ts`（测试覆盖见 `src/__test__/auth.test.ts`）
- **任务**：任务的增删改查、过滤、搜索等逻辑集中在 `src/stores/task.ts` 与 `src/composables/useTask.ts`（测试覆盖见 `src/__test__/task.test.ts`）
- **页面/仪表盘**：页面组件位于 `src/views/`，用于组合布局组件与业务组件完成页面编排

## 重要约束
- **优先使用原生 Web API**：如需实现格式化、可见性检测、并发处理等，应优先使用 `Intl` / `IntersectionObserver` / `Promise.allSettled()` 等原生能力（与本仓库规则保持一致）
- **浏览器端 ESM 限制**：禁止引入/编写 CommonJS 代码（`require` 等）
- **质量门禁**：提交前会自动执行暂存文件 lint 修复与单测（Husky hooks），因此任何改动必须保持测试可通过

## 外部依赖
当前仓库未配置必须依赖的外部后端服务；核心依赖为本地 Node.js 工具链与 NPM 包（Vue/Pinia/Router 等）。如未来引入外部 API/服务，请在此处补充：
- 服务名称与用途
- 认证方式（如有）
- 环境变量与配置入口（如有）
