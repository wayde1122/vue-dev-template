# src/views/ 规则

## 定位

页面级组件负责：
- 组合布局组件与业务组件
- 调用 store/composables 获取数据与触发 actions
- 管理页面级交互（如过滤条件、查询条件）

## 规则

- **不要写通用组件逻辑**：可复用逻辑请下沉到 `components/` 或 `composables/`
- **避免直接操作 DOM**：能用声明式渲染就不用手动 DOM；确需可见性用 `IntersectionObserver`
- **数据格式化**：展示层统一用 `Intl`（日期/数字/货币）

