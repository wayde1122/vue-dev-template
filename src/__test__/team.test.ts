/**
 * Team Store Unit Tests
 * 团队成员状态管理测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTeamStore } from '../stores/team'
import type { MemberFormData } from '../stores/types'

describe('Team Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('初始状态', () => {
    it('应该初始化为空数组', () => {
      const store = useTeamStore()
      expect(store.members).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.totalCount).toBe(0)
    })
  })

  describe('fetchMembers', () => {
    it('应该加载模拟数据', async () => {
      const store = useTeamStore()
      vi.useFakeTimers()

      const fetchPromise = store.fetchMembers()
      expect(store.loading).toBe(true)

      vi.advanceTimersByTime(300)
      await fetchPromise

      expect(store.loading).toBe(false)
      expect(store.members.length).toBe(5)
      expect(store.totalCount).toBe(5)

      vi.useRealTimers()
    })
  })

  describe('addMember', () => {
    it('应该成功添加新成员', () => {
      const store = useTeamStore()
      const formData: MemberFormData = {
        name: '测试用户',
        gender: '男',
        idCardNumber: '110101199901011234',
        jobTitle: '测试工程师',
        department: '技术部',
        level: '中级'
      }

      const result = store.addMember(formData)

      expect(result.errors).toEqual([])
      expect(result.member).not.toBeNull()
      expect(result.member?.name).toBe('测试用户')
      expect(store.members.length).toBe(1)
      expect(store.totalCount).toBe(1)
    })

    it('应该拒绝空姓名', () => {
      const store = useTeamStore()
      const formData: MemberFormData = {
        name: '',
        gender: '男',
        idCardNumber: '110101199901011234',
        jobTitle: '测试工程师',
        department: '技术部',
        level: '中级'
      }

      const result = store.addMember(formData)

      expect(result.member).toBeNull()
      expect(result.errors.some((e) => e.field === 'name')).toBe(true)
    })

    it('应该拒绝无效的身份证号格式', () => {
      const store = useTeamStore()
      const formData: MemberFormData = {
        name: '测试用户',
        gender: '男',
        idCardNumber: '12345', // 格式错误
        jobTitle: '测试工程师',
        department: '技术部',
        level: '中级'
      }

      const result = store.addMember(formData)

      expect(result.member).toBeNull()
      expect(result.errors.some((e) => e.field === 'idCardNumber')).toBe(true)
    })

    it('应该拒绝重复的身份证号', () => {
      const store = useTeamStore()
      const formData1: MemberFormData = {
        name: '用户一',
        gender: '男',
        idCardNumber: '110101199901011234',
        jobTitle: '工程师',
        department: '技术部',
        level: '中级'
      }
      const formData2: MemberFormData = {
        name: '用户二',
        gender: '女',
        idCardNumber: '110101199901011234', // 重复
        jobTitle: '设计师',
        department: '设计部',
        level: '高级'
      }

      store.addMember(formData1)
      const result = store.addMember(formData2)

      expect(result.member).toBeNull()
      expect(result.errors.some((e) => e.field === 'idCardNumber' && e.message.includes('已存在'))).toBe(true)
    })
  })

  describe('updateMember', () => {
    beforeEach(async () => {
      const store = useTeamStore()
      vi.useFakeTimers()
      const fetchPromise = store.fetchMembers()
      vi.advanceTimersByTime(300)
      await fetchPromise
      vi.useRealTimers()
    })

    it('应该成功更新成员信息', () => {
      const store = useTeamStore()
      const member = store.members[0]
      const formData: MemberFormData = {
        name: '更新后的名字',
        gender: member.gender,
        idCardNumber: member.idCardNumber,
        jobTitle: '新职位',
        department: member.department,
        level: member.level
      }

      const result = store.updateMember(member.id, formData)

      expect(result.errors).toEqual([])
      expect(result.member?.name).toBe('更新后的名字')
      expect(result.member?.jobTitle).toBe('新职位')
    })

    it('编辑时身份证号与其他成员冲突应该报错', () => {
      const store = useTeamStore()
      const member1 = store.members[0]
      const member2 = store.members[1]
      const formData: MemberFormData = {
        name: member1.name,
        gender: member1.gender,
        idCardNumber: member2.idCardNumber, // 使用另一个成员的身份证号
        jobTitle: member1.jobTitle,
        department: member1.department,
        level: member1.level
      }

      const result = store.updateMember(member1.id, formData)

      expect(result.member).toBeNull()
      expect(result.errors.some((e) => e.field === 'idCardNumber')).toBe(true)
    })

    it('编辑时保持自己的身份证号应该允许', () => {
      const store = useTeamStore()
      const member = store.members[0]
      const formData: MemberFormData = {
        name: '新名字',
        gender: member.gender,
        idCardNumber: member.idCardNumber, // 保持不变
        jobTitle: member.jobTitle,
        department: member.department,
        level: member.level
      }

      const result = store.updateMember(member.id, formData)

      expect(result.errors).toEqual([])
      expect(result.member?.name).toBe('新名字')
    })

    it('更新不存在的成员应该返回错误', () => {
      const store = useTeamStore()
      const formData: MemberFormData = {
        name: '测试',
        gender: '男',
        idCardNumber: '110101199901011234',
        jobTitle: '工程师',
        department: '技术部',
        level: '中级'
      }

      const result = store.updateMember('non-existent-id', formData)

      expect(result.member).toBeNull()
      expect(result.errors.some((e) => e.field === 'id')).toBe(true)
    })
  })

  describe('deleteMember', () => {
    beforeEach(async () => {
      const store = useTeamStore()
      vi.useFakeTimers()
      const fetchPromise = store.fetchMembers()
      vi.advanceTimersByTime(300)
      await fetchPromise
      vi.useRealTimers()
    })

    it('应该成功删除成员', () => {
      const store = useTeamStore()
      const initialCount = store.totalCount
      const memberId = store.members[0].id

      const result = store.deleteMember(memberId)

      expect(result).toBe(true)
      expect(store.totalCount).toBe(initialCount - 1)
      expect(store.members.find((m) => m.id === memberId)).toBeUndefined()
    })

    it('删除不存在的成员应该返回 false', () => {
      const store = useTeamStore()
      const initialCount = store.totalCount

      const result = store.deleteMember('non-existent-id')

      expect(result).toBe(false)
      expect(store.totalCount).toBe(initialCount)
    })
  })

  describe('getMemberById', () => {
    beforeEach(async () => {
      const store = useTeamStore()
      vi.useFakeTimers()
      const fetchPromise = store.fetchMembers()
      vi.advanceTimersByTime(300)
      await fetchPromise
      vi.useRealTimers()
    })

    it('应该返回指定 ID 的成员', () => {
      const store = useTeamStore()
      const expectedMember = store.members[0]

      const result = store.getMemberById(expectedMember.id)

      expect(result).toEqual(expectedMember)
    })

    it('ID 不存在时应该返回 undefined', () => {
      const store = useTeamStore()

      const result = store.getMemberById('non-existent-id')

      expect(result).toBeUndefined()
    })
  })
})
