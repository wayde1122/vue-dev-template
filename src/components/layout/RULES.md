# src/components/layout/ 规则

## 定位

布局组件负责页面框架（Header/Sidebar/MainLayout），不承载具体业务数据。

## 规则

- **只做布局与导航容器**：业务状态从 `views/` 注入或通过 slot 组合
- **路由相关**：允许使用 `useRoute/useRouter` 做导航，但不要做鉴权逻辑（鉴权在 `router/`）
- **避免循环依赖**：不要 import `router/index.js` 以外的路由实现细节

