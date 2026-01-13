---
name: vue3-vite-testing
description: Vue 3 + Vite + Pinia + Vue Router 项目的测试 Skill（单测/组件测试/E2E 计划与落地模板）
---

## 目标

为当前项目（Vue 3 + Vite，含 Pinia store 与 Vue Router 守卫）提供一套“可落地”的测试策略与模板，优先覆盖：

- **业务状态**：`src/stores/*`（auth/task/dashboard）
- **路由鉴权**：`src/router/index.js` 的导航守卫逻辑
- **关键页面/组件**：登录、任务列表、dashboard 等核心交互

## 总体原则（与本项目偏好保持一致）

- **尽量少依赖**：测试框架选择 Vitest（Vite 原生生态），避免引入大而全的工具链。
- **能单测就单测**：store/纯函数优先单测，组件用“少量高价值”用例。
- **不要用 scroll 监听**：如果要测可见性/懒加载，使用 `IntersectionObserver` 并在测试里 mock。
- **不要用 `||` 兜底**：测试/代码里默认值用 `??`（避免把空字符串/0 误判）。
- **日期/数字格式**：使用 `Intl`，测试里固定 locale/timezone 或 mock。

## 推荐分层与覆盖范围

### 1) 单元测试（Unit）

适用对象：

- Pinia store（auth/task/dashboard）
- 工具函数（如后续抽到 `src/utils/*`）

重点断言：

- 状态初始化与派生 getter
- action 的副作用（localStorage、计时器、Promise）
- 边界输入（空字符串、null、重复提交）

### 2) 组件测试（Component / Integration）

适用对象：

- 登录表单：输入校验、点击触发、loading 状态
- 任务列表：新增/勾选/删除/筛选/搜索

重点断言：

- DOM 可见状态 + 可交互性（键盘 Enter、按钮 click）
- 组件与 store 的联动（mock store 或用真实 pinia）

### 3) E2E（可选）

只保留 2-5 条“主干路径”：

- 未登录访问受保护页面 -> 跳转登录 -> 登录成功 -> 回到目标页
- 任务列表：新增一条 -> 勾选完成 -> 清除已完成

资源见：`resources/e2e-playwright.md`

## 落地步骤（建议顺序）

### Step A：装依赖（最小集合）

在项目根目录执行：

```bash
npm i -D vitest jsdom @vue/test-utils @testing-library/vue @testing-library/jest-dom
```

（如果你不想用 Testing Library，也可以只装 `@vue/test-utils`，但建议保留 Testing Library 以提升测试可读性。）

### Step B：Vitest 配置

把以下配置落到项目（细节与示例见 `resources/vitest-setup.md`）：

- `vite.config.js` 增加 `test` 配置（jsdom、setupFiles、alias）
- 新增 `vitest.setup.js` 引入 `@testing-library/jest-dom`

### Step C：先从 Pinia store 开始（最快见效）

优先为以下文件补测试：

- `src/stores/auth.js`（localStorage + login/logout）
- `src/stores/task.js`（fetch/add/toggle/delete/filter/search）

示例见：

- `resources/examples-auth-store.test.md`
- `resources/examples-task-store.test.md`

### Step D：路由守卫测试（建议做一个小重构以便测试）

当前 `src/router/index.js` 在守卫里通过延迟 `require()` 获取 `useAuthStore`。
为了更容易测试（也更符合 ESM/构建），建议把“守卫逻辑”抽成可注入函数：

- `createAuthGuard({ getIsAuthenticated, setTitle })`
- 在 router 里调用并注册
- 单测只测 guard 逻辑，不必真的跑全路由

示例见：`resources/router-guard-testing.md`

## 交付前检查清单

- [ ] `npm run test` 通过（如果你新增了 test script）
- [ ] store 测试覆盖关键 action 分支
- [ ] 至少 1 条路由鉴权测试（未登录重定向到 Login）
- [ ] 至少 1 条核心组件交互测试（任务新增/完成）
- [ ] 涉及时间的用例固定时区/时间（避免 CI 偶现）
