# src/components/common/ 规则

## 定位

这里放“基础原子组件”（Button/Input/Modal 等），应做到跨业务复用。

## 规则

- **禁止耦合业务**：不要引用 `stores/`、不要写路由跳转
- **默认值用 `??`**：避免 `||` 误伤空字符串/0
- **事件命名一致**：`update:modelValue`、`submit`、`close` 等语义化事件
- **可访问性**：focus ring、ESC 关闭 modal、Tab 可导航

