# src/stores/ 规则（Pinia）

## 规则

- **单一职责**：每个 store 管一个领域（auth/task/dashboard）
- **副作用可控**：localStorage/计时器/网络调用集中在 actions
- **避免隐式默认值**：用 `??` 明确默认值
- **派生状态**：使用 `computed` getters；复杂派生逻辑可抽到 `utils/`
- **可测试性**：action 尽量返回 Promise/结果，方便单测断言

## 测试建议

- 优先覆盖：鉴权（token 写入/清除）、任务增删改查、筛选与搜索
- 涉及时间：在测试中固定时间或使用 fake timers，避免偶现

