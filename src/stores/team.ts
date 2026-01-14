/**
 * Team Store
 * 团队成员状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Member, MemberFormData } from './types'
import { validateMemberForm, type ValidationError } from '@/utils/memberValidation'

export const useTeamStore = defineStore('team', () => {
  // State
  const members: Ref<Member[]> = ref([])
  const loading = ref(false)

  // Mock 数据
  const mockMembers: Member[] = [
    {
      id: '1',
      name: '张三',
      gender: '男',
      idCardNumber: '110101199001011234',
      jobTitle: '前端工程师',
      department: '技术部',
      level: '高级',
      createdAt: '2024-01-01T08:00:00Z',
      updatedAt: '2024-01-01T08:00:00Z'
    },
    {
      id: '2',
      name: '李四',
      gender: '女',
      idCardNumber: '310101199203152345',
      jobTitle: '产品经理',
      department: '产品部',
      level: '中级',
      createdAt: '2024-01-02T09:00:00Z',
      updatedAt: '2024-01-02T09:00:00Z'
    },
    {
      id: '3',
      name: '王五',
      gender: '男',
      idCardNumber: '440101198805203456',
      jobTitle: 'UI 设计师',
      department: '设计部',
      level: '高级',
      createdAt: '2024-01-03T10:00:00Z',
      updatedAt: '2024-01-03T10:00:00Z'
    },
    {
      id: '4',
      name: '赵六',
      gender: '女',
      idCardNumber: '510101199506284567',
      jobTitle: '市场专员',
      department: '市场部',
      level: '初级',
      createdAt: '2024-01-04T11:00:00Z',
      updatedAt: '2024-01-04T11:00:00Z'
    },
    {
      id: '5',
      name: '孙七',
      gender: '男',
      idCardNumber: '330101199107125678',
      jobTitle: '后端工程师',
      department: '技术部',
      level: '专家',
      createdAt: '2024-01-05T12:00:00Z',
      updatedAt: '2024-01-05T12:00:00Z'
    }
  ]

  // Getters
  const totalCount = computed(() => members.value.length)

  const getMemberById = computed(() => {
    return (id: string): Member | undefined => {
      return members.value.find((m) => m.id === id)
    }
  })

  // Actions

  /**
   * 获取成员列表（模拟异步加载）
   */
  function fetchMembers(): Promise<Member[]> {
    loading.value = true
    return new Promise((resolve) => {
      setTimeout(() => {
        members.value = [...mockMembers]
        loading.value = false
        resolve(members.value)
      }, 300)
    })
  }

  /**
   * 校验表单数据
   */
  function validate(formData: MemberFormData, excludeId?: string): ValidationError[] {
    return validateMemberForm(formData, members.value, excludeId)
  }

  /**
   * 新增成员
   * @returns 新成员对象，或 null（如果校验失败）
   */
  function addMember(formData: MemberFormData): { member: Member | null; errors: ValidationError[] } {
    const errors = validate(formData)
    if (errors.length > 0) {
      return { member: null, errors }
    }

    const now = new Date().toISOString()
    const newMember: Member = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: now,
      updatedAt: now
    }
    members.value.unshift(newMember)
    return { member: newMember, errors: [] }
  }

  /**
   * 更新成员
   * @returns 更新后的成员对象，或 null（如果校验失败或未找到）
   */
  function updateMember(
    id: string,
    formData: MemberFormData
  ): { member: Member | null; errors: ValidationError[] } {
    const errors = validate(formData, id)
    if (errors.length > 0) {
      return { member: null, errors }
    }

    const index = members.value.findIndex((m) => m.id === id)
    if (index === -1) {
      return { member: null, errors: [{ field: 'id', message: '成员不存在' }] }
    }

    const updated: Member = {
      ...members.value[index],
      ...formData,
      updatedAt: new Date().toISOString()
    }
    members.value[index] = updated
    return { member: updated, errors: [] }
  }

  /**
   * 删除成员
   * @returns 是否删除成功
   */
  function deleteMember(id: string): boolean {
    const index = members.value.findIndex((m) => m.id === id)
    if (index === -1) {
      return false
    }
    members.value.splice(index, 1)
    return true
  }

  return {
    // State
    members,
    loading,
    // Getters
    totalCount,
    getMemberById,
    // Actions
    fetchMembers,
    validate,
    addMember,
    updateMember,
    deleteMember
  }
})
