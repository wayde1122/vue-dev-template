# src/ 规则

## 总则

- **ESM Only**：浏览器端代码禁止使用 `require`、`module.exports`。
- **默认值**：禁止 `||`，使用 `??` / `??=`
- **数据结构**：去重/索引用 `Set`/`Map`
- **对象转换**：使用 `Object.entries()` / `Object.fromEntries()`
- **可见性**：使用 `IntersectionObserver`，不要写 scroll listener
- **格式化**：日期/数字/货币用 `Intl`

## 文件组织

- 纯逻辑优先抽到 `utils/` 或 `composables/`，提升可复用与可测试性
- 页面只做组合与编排：`views/` 负责组合组件与 store/composables

