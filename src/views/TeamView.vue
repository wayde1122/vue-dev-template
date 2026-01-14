<template>
  <div class="team-view">
    <!-- 页面标题与操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">人员管理</h1>
        <span class="member-count">共 {{ teamStore.totalCount }} 人</span>
      </div>
      <BaseButton variant="primary" @click="openAddModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        新增人员
      </BaseButton>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <!-- 加载状态 -->
      <div v-if="teamStore.loading" class="loading-state">
        <div class="spinner"></div>
        <span>加载中...</span>
      </div>

      <!-- 空状态 -->
      <div v-else-if="teamStore.members.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <p class="empty-text">暂无人员数据</p>
        <BaseButton variant="primary" @click="openAddModal">新增人员</BaseButton>
      </div>

      <!-- 人员表格 -->
      <table v-else class="member-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>性别</th>
            <th>身份证号</th>
            <th>职位</th>
            <th>所属部门</th>
            <th>职级</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in teamStore.members" :key="member.id">
            <td class="td-name">{{ member.name }}</td>
            <td>{{ member.gender }}</td>
            <td class="td-id-card">{{ member.idCardNumber }}</td>
            <td>{{ member.jobTitle }}</td>
            <td>
              <span class="badge badge-department">{{ member.department }}</span>
            </td>
            <td>
              <span :class="['badge', `badge-level-${getLevelClass(member.level)}`]">
                {{ member.level }}
              </span>
            </td>
            <td class="td-actions">
              <button class="action-btn action-edit" @click="openEditModal(member)" aria-label="编辑">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="action-btn action-delete" @click="confirmDelete(member)" aria-label="删除">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <MemberFormModal
      v-model="showFormModal"
      :member="editingMember"
      @saved="handleSaved"
    />

    <!-- 删除确认弹窗 -->
    <BaseModal v-model="showDeleteModal" title="确认删除" size="sm">
      <p class="delete-confirm-text">
        确定要删除 <strong>{{ deletingMember?.name }}</strong> 吗？此操作无法撤销。
      </p>
      <template #footer>
        <BaseButton variant="secondary" @click="showDeleteModal = false">取消</BaseButton>
        <BaseButton variant="danger" @click="handleDelete">删除</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import MemberFormModal from '@/components/MemberFormModal.vue'
import { useTeamStore } from '@/stores/team'
import type { Member, Level } from '@/stores/types'

const teamStore = useTeamStore()

// 弹窗状态
const showFormModal = ref(false)
const editingMember = ref<Member | null>(null)

const showDeleteModal = ref(false)
const deletingMember = ref<Member | null>(null)

// 初始化加载数据
onMounted(() => {
  teamStore.fetchMembers()
})

// 新增
function openAddModal() {
  editingMember.value = null
  showFormModal.value = true
}

// 编辑
function openEditModal(member: Member) {
  editingMember.value = member
  showFormModal.value = true
}

// 保存成功（预留给通知提示等扩展）
function handleSaved() {
  // 可以在此处添加成功提示
}

// 删除确认
function confirmDelete(member: Member) {
  deletingMember.value = member
  showDeleteModal.value = true
}

// 执行删除
function handleDelete() {
  if (deletingMember.value) {
    teamStore.deleteMember(deletingMember.value.id)
    showDeleteModal.value = false
    deletingMember.value = null
  }
}

// 职级样式映射
function getLevelClass(level: Level): string {
  const map: Record<Level, string> = {
    '初级': 'junior',
    '中级': 'mid',
    '高级': 'senior',
    '专家': 'expert',
    '资深专家': 'principal'
  }
  return map[level] ?? 'default'
}
</script>

<style scoped>
.team-view {
  padding: var(--spacing-xl);
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-md);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.member-count {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* 表格容器 */
.table-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4xl);
  gap: var(--spacing-md);
  color: var(--color-text-muted);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-cta);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4xl);
  gap: var(--spacing-md);
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  color: var(--color-text-light);
  background: var(--color-background);
  border-radius: var(--radius-xl);
}

.empty-text {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

/* 表格 */
.member-table {
  width: 100%;
  border-collapse: collapse;
}

.member-table th,
.member-table td {
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
}

.member-table thead {
  background: var(--color-background);
}

.member-table th {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-border);
}

.member-table tbody tr {
  border-bottom: 1px solid var(--color-border);
  transition: background var(--transition-base);
}

.member-table tbody tr:last-child {
  border-bottom: none;
}

.member-table tbody tr:hover {
  background: var(--color-background);
}

.member-table td {
  font-size: 0.9375rem;
  color: var(--color-text);
}

.td-name {
  font-weight: 500;
}

.td-id-card {
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* 徽章 */
.badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
}

.badge-department {
  color: var(--color-cta);
  background: rgba(3, 105, 161, 0.1);
}

.badge-level-junior {
  color: #6B7280;
  background: rgba(107, 114, 128, 0.1);
}

.badge-level-mid {
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
}

.badge-level-senior {
  color: #D97706;
  background: rgba(217, 119, 6, 0.1);
}

.badge-level-expert {
  color: #7C3AED;
  background: rgba(124, 58, 237, 0.1);
}

.badge-level-principal {
  color: #DC2626;
  background: rgba(220, 38, 38, 0.1);
}

/* 操作按钮 */
.td-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.action-edit {
  color: var(--color-text-muted);
}

.action-edit:hover {
  color: var(--color-cta);
  background: rgba(3, 105, 161, 0.1);
}

.action-delete {
  color: var(--color-text-muted);
}

.action-delete:hover {
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

/* 删除确认文本 */
.delete-confirm-text {
  font-size: 0.9375rem;
  color: var(--color-text);
  line-height: 1.6;
}

.delete-confirm-text strong {
  color: var(--color-text);
}

/* 响应式 */
@media (max-width: 1024px) {
  .member-table {
    display: block;
    overflow-x: auto;
  }
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .header-left {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
}
</style>
