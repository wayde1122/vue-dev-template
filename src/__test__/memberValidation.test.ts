/**
 * Member Validation Unit Tests
 * 人员校验工具函数测试
 */

import { describe, it, expect } from 'vitest'
import {
  isValidIdCardFormat,
  isIdCardUnique,
  isValidGender,
  isValidDepartment,
  isValidLevel,
  validateMemberForm
} from '../utils/memberValidation'
import type { Member, MemberFormData } from '../stores/types'

describe('Member Validation', () => {
  describe('isValidIdCardFormat', () => {
    it('应该接受合法的 18 位身份证号', () => {
      expect(isValidIdCardFormat('110101199001011234')).toBe(true)
      expect(isValidIdCardFormat('310101199203152345')).toBe(true)
    })

    it('应该接受末位为 X 的身份证号', () => {
      expect(isValidIdCardFormat('11010119900101123X')).toBe(true)
      expect(isValidIdCardFormat('11010119900101123x')).toBe(true)
    })

    it('应该拒绝非 18 位的号码', () => {
      expect(isValidIdCardFormat('11010119900101123')).toBe(false)  // 17 位
      expect(isValidIdCardFormat('1101011990010112345')).toBe(false)  // 19 位
      expect(isValidIdCardFormat('123456')).toBe(false)
    })

    it('应该拒绝含有非法字符的号码', () => {
      expect(isValidIdCardFormat('11010119900101123A')).toBe(false)
      expect(isValidIdCardFormat('110101199001011-34')).toBe(false)
      expect(isValidIdCardFormat('abcdefghijklmnopqr')).toBe(false)
    })

    it('应该拒绝空字符串', () => {
      expect(isValidIdCardFormat('')).toBe(false)
    })
  })

  describe('isIdCardUnique', () => {
    const mockMembers: Member[] = [
      {
        id: '1',
        name: '张三',
        gender: '男',
        idCardNumber: '110101199001011234',
        jobTitle: '工程师',
        department: '技术部',
        level: '中级',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: '李四',
        gender: '女',
        idCardNumber: '310101199203152345',
        jobTitle: '设计师',
        department: '设计部',
        level: '高级',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      }
    ]

    it('应该返回 true 当身份证号不存在时', () => {
      expect(isIdCardUnique('440101198805203456', mockMembers)).toBe(true)
    })

    it('应该返回 false 当身份证号已存在时', () => {
      expect(isIdCardUnique('110101199001011234', mockMembers)).toBe(false)
    })

    it('编辑时应该排除当前成员', () => {
      // 成员 1 保持自己的身份证号
      expect(isIdCardUnique('110101199001011234', mockMembers, '1')).toBe(true)
      // 成员 1 使用成员 2 的身份证号
      expect(isIdCardUnique('310101199203152345', mockMembers, '1')).toBe(false)
    })

    it('空列表时应该返回 true', () => {
      expect(isIdCardUnique('110101199001011234', [])).toBe(true)
    })
  })

  describe('isValidGender', () => {
    it('应该接受有效的性别值', () => {
      expect(isValidGender('男')).toBe(true)
      expect(isValidGender('女')).toBe(true)
    })

    it('应该拒绝无效的性别值', () => {
      expect(isValidGender('其他')).toBe(false)
      expect(isValidGender('')).toBe(false)
      expect(isValidGender('male')).toBe(false)
    })
  })

  describe('isValidDepartment', () => {
    it('应该接受有效的部门值', () => {
      expect(isValidDepartment('技术部')).toBe(true)
      expect(isValidDepartment('产品部')).toBe(true)
      expect(isValidDepartment('设计部')).toBe(true)
      expect(isValidDepartment('市场部')).toBe(true)
      expect(isValidDepartment('人事部')).toBe(true)
      expect(isValidDepartment('财务部')).toBe(true)
      expect(isValidDepartment('运营部')).toBe(true)
    })

    it('应该拒绝无效的部门值', () => {
      expect(isValidDepartment('研发部')).toBe(false)
      expect(isValidDepartment('')).toBe(false)
      expect(isValidDepartment('Engineering')).toBe(false)
    })
  })

  describe('isValidLevel', () => {
    it('应该接受有效的职级值', () => {
      expect(isValidLevel('初级')).toBe(true)
      expect(isValidLevel('中级')).toBe(true)
      expect(isValidLevel('高级')).toBe(true)
      expect(isValidLevel('专家')).toBe(true)
      expect(isValidLevel('资深专家')).toBe(true)
    })

    it('应该拒绝无效的职级值', () => {
      expect(isValidLevel('实习')).toBe(false)
      expect(isValidLevel('')).toBe(false)
      expect(isValidLevel('Senior')).toBe(false)
    })
  })

  describe('validateMemberForm', () => {
    const mockMembers: Member[] = [
      {
        id: '1',
        name: '张三',
        gender: '男',
        idCardNumber: '110101199001011234',
        jobTitle: '工程师',
        department: '技术部',
        level: '中级',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]

    it('应该通过合法的表单数据', () => {
      const formData: MemberFormData = {
        name: '新用户',
        gender: '女',
        idCardNumber: '310101199203152345',
        jobTitle: '产品经理',
        department: '产品部',
        level: '高级'
      }

      const errors = validateMemberForm(formData, mockMembers)

      expect(errors).toEqual([])
    })

    it('应该检测所有空字段', () => {
      const formData: MemberFormData = {
        name: '',
        gender: '' as '男',
        idCardNumber: '',
        jobTitle: '',
        department: '' as '技术部',
        level: '' as '中级'
      }

      const errors = validateMemberForm(formData, [])

      expect(errors.length).toBeGreaterThan(0)
      expect(errors.some((e) => e.field === 'name')).toBe(true)
      expect(errors.some((e) => e.field === 'gender')).toBe(true)
      expect(errors.some((e) => e.field === 'idCardNumber')).toBe(true)
      expect(errors.some((e) => e.field === 'jobTitle')).toBe(true)
      expect(errors.some((e) => e.field === 'department')).toBe(true)
      expect(errors.some((e) => e.field === 'level')).toBe(true)
    })

    it('应该检测身份证号重复', () => {
      const formData: MemberFormData = {
        name: '新用户',
        gender: '女',
        idCardNumber: '110101199001011234', // 与 mockMembers[0] 相同
        jobTitle: '设计师',
        department: '设计部',
        level: '高级'
      }

      const errors = validateMemberForm(formData, mockMembers)

      expect(errors.some((e) => e.field === 'idCardNumber' && e.message.includes('已存在'))).toBe(true)
    })

    it('编辑时应该允许保持自己的身份证号', () => {
      const formData: MemberFormData = {
        name: '张三（修改后）',
        gender: '男',
        idCardNumber: '110101199001011234',
        jobTitle: '高级工程师',
        department: '技术部',
        level: '高级'
      }

      const errors = validateMemberForm(formData, mockMembers, '1')

      expect(errors).toEqual([])
    })

    it('应该检测无效的身份证号格式', () => {
      const formData: MemberFormData = {
        name: '新用户',
        gender: '女',
        idCardNumber: '12345',
        jobTitle: '设计师',
        department: '设计部',
        level: '高级'
      }

      const errors = validateMemberForm(formData, [])

      expect(errors.some((e) => e.field === 'idCardNumber' && e.message.includes('格式'))).toBe(true)
    })
  })
})
