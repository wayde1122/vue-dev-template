# src/components/ 规则

## 目标

组件应尽量“可复用、可测试、低耦合”，避免把业务规则写死在通用组件中。

## 规则

- **无副作用优先**：不要在组件顶层做 I/O（localStorage、network）
- **Props/Events 清晰**：对外暴露最小 API；避免透传过多不必要 props
- **可访问性**：表单元素提供 label / aria-*；按钮可通过键盘触发
- **样式约束**：局部样式优先 `scoped`；避免全局选择器污染
- **长列表/懒加载**：需要可见性时用 `IntersectionObserver`（不要滚动监听）

## 测试建议

- 可交互组件建议用 Testing Library 写 1-3 条高价值用例（点击/键盘/状态变化）

