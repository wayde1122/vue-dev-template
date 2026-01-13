# Vue 3 AI 开发模板

基于 Vue 3 + TypeScript + Vite 的企业级前端开发模板，配置了完整的代码规范和 AI 辅助开发能力。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 语言 | TypeScript 5 |
| 构建 | Vite 5 |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| 测试 | Vitest + @testing-library/vue |
| 代码规范 | ESLint + @typescript-eslint |
| Git Hooks | Husky + lint-staged |
| Commit 规范 | Commitlint (Conventional Commits) |

## 目录结构

```
.
├── .claude/                    # Claude Code AI 配置
│   ├── skills/                 # AI 技能包
│   │   ├── skill-rules.json    # 通用技能规则
│   │   ├── vue3-vite-guidelines/  # Vue 3 + Vite 开发指南
│   │   └── vue3-vite-testing/     # 测试技能包
│   ├── hooks/                  # AI 钩子
│   └── settings.local.json     # 本地权限配置
│
├── .husky/                     # Git Hooks
│   ├── pre-commit              # 提交前检查 (lint + test)
│   └── commit-msg              # Commit 消息规范检查
│
├── src/
│   ├── components/             # 组件
│   │   ├── common/             # 通用组件
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   └── BaseModal.vue
│   │   └── layout/             # 布局组件
│   │       ├── MainLayout.vue
│   │       ├── AppHeader.vue
│   │       └── AppSidebar.vue
│   │
│   ├── views/                  # 页面视图
│   │   ├── LoginView.vue
│   │   ├── DashboardView.vue
│   │   └── ...
│   │
│   ├── stores/                 # Pinia 状态管理
│   │   ├── types.ts            # 共享类型定义
│   │   ├── auth.ts             # 认证状态
│   │   ├── task.ts             # 任务状态
│   │   └── dashboard.ts        # 仪表板状态
│   │
│   ├── composables/            # 组合式函数
│   │   ├── useAuth.ts
│   │   ├── useTask.ts
│   │   └── useNotification.ts
│   │
│   ├── router/                 # 路由配置
│   │   └── index.ts
│   │
│   ├── __test__/               # 测试文件
│   │   ├── auth.test.ts
│   │   └── task.test.ts
│   │
│   ├── env.d.ts                # 环境类型声明
│   ├── main.ts                 # 应用入口
│   └── App.vue                 # 根组件
│
├── coverage/                   # 测试覆盖率报告
├── commitlint.config.js        # Commit 规范配置
├── eslint.config.js            # ESLint 配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
├── vitest.setup.ts             # Vitest 测试设置
└── package.json                # 项目配置
```

## 开发规范

### 命令

```bash
npm run dev              # 开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览构建结果

npm run lint             # ESLint 检查
npm run lint:fix         # ESLint 自动修复
npm run type-check       # TypeScript 类型检查

npm run test             # 运行测试 (watch 模式)
npm run test:run         # 运行测试一次
npm run test:coverage    # 测试覆盖率报告
```

### Git 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat:     新功能
fix:      修复问题
docs:     文档更新
style:    代码格式调整
refactor: 重构
perf:     性能优化
test:     测试相关
chore:    构建/工具
types:    类型修改
revert:   回滚
```

示例：
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve navigation redirect issue"
```

### 提交前检查

每次提交自动执行：
1. **lint-staged**: 对暂存文件运行 `eslint --fix`
2. **类型检查**: 对暂存文件运行 `vue-tsc --noEmit`
3. **测试**: 运行 `npm run test:run`

只有所有检查通过才允许提交。

## AI Skills 配置

本项目配置了 Claude Code AI 辅助开发能力，通过 `.claude/` 目录下的技能包实现：

### vue3-vite-guidelines

Vue 3 + Vite 开发指南技能，提供：
- 项目结构最佳实践
- Composition API 使用规范
- 组件开发模式
- 性能优化建议

**触发方式**：在对话中描述 Vue 3 相关需求时自动激活

### vue3-vite-testing

测试技能包，提供：
- 单元测试策略（Store、Composable、组件）
- E2E 测试模板
- 测试覆盖率配置
- Pinia Store 测试示例
- 路由守卫测试方法

**触发方式**：涉及测试相关问题时自动激活

### 权限配置

`.claude/settings.local.json` 定义了 AI 的操作权限：
- 允许运行 npm 命令
- 允许运行 Git 操作
- 允许运行测试命令
- 允许调用技能包

### 钩子机制

- **UserPromptSubmit**: 每次用户输入前执行，用于技能推荐
- **PostToolUse**: 代码修改后执行，用于变更追踪

## 扩展 Skills

在 `.claude/skills/` 目录下添加自定义技能包：

1. 创建技能目录 `your-skill/`
2. 添加 `manifest.json` 配置文件
3. 在 `settings.local.json` 中添加权限：
   ```json
   "permissions": {
     "allow": ["Skill(your-skill)"]
   }
   ```

## License

MIT
