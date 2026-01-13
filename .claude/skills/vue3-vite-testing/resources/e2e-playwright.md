# E2E（可选）：Playwright 最小落地建议

如果你确实需要端到端测试（验证路由跳转 + 真实渲染 + 用户交互），建议用 Playwright，且只保留少量“主干路径”。

## 安装

```bash
npm i -D @playwright/test
npx playwright install
```

## 推荐用例（2-5 条）

- 未登录访问 `/dashboard` -> 自动跳转到 `/login`
- 登录后跳回 redirect 目标（如果你做了 redirect）
- 任务：新增 -> 勾选完成 -> 清除已完成

## 结构建议

- `e2e/`：放 Playwright 测试
- `playwright.config.js`：baseURL 指向 `vite preview` 或 `vite dev`

提示：E2E 尽量不要测细节样式，更多验证主流程是否可用。
