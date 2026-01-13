# src/router/ 规则

## 目标

路由层只做“导航层关注点”：页面映射、鉴权跳转、标题设置、滚动行为等。

## 规则

- **ESM Only**：禁止 `require`（Vite/浏览器端无 `require`）
- **守卫逻辑可测**：复杂守卫建议抽成可注入函数（便于单测）
- **鉴权来源**：从 `stores/auth` 读取 `isAuthenticated`；不要在组件里重复写鉴权跳转逻辑
- **标题**：统一在路由层设置 `document.title`

