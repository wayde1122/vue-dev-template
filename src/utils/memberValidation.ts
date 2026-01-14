/**
 * 人员校验工具函数
 */

import type { Member, MemberFormData } from '@/stores/types'
import { GENDERS, DEPARTMENTS, LEVELS } from '@/stores/types'

export interface ValidationError {
  field: string
  message: string
}

/**
 * 校验身份证号格式（最小可行校验：18 位，仅数字或末位 X）
 */
export function isValidIdCardFormat(idCardNumber: string): boolean {
  // 18 位身份证号：前 17 位数字 + 最后一位数字或 X
  const pattern = /^\d{17}[\dXx]$/
  return pattern.test(idCardNumber)
}

/**
 * 校验身份证号是否唯一（排除当前编辑的成员）
 */
export function isIdCardUnique(
  idCardNumber: string,
  members: Member[],
  excludeId?: string
): boolean {
  return !members.some(
    (m) => m.idCardNumber === idCardNumber && m.id !== excludeId
  )
}

/**
 * 校验枚举字段值是否合法
 */
export function isValidGender(value: string): boolean {
  return GENDERS.includes(value as typeof GENDERS[number])
}

export function isValidDepartment(value: string): boolean {
  return DEPARTMENTS.includes(value as typeof DEPARTMENTS[number])
}

export function isValidLevel(value: string): boolean {
  return LEVELS.includes(value as typeof LEVELS[number])
}

/**
 * 校验成员表单数据
 * @returns 错误列表；为空表示校验通过
 */
export function validateMemberForm(
  formData: MemberFormData,
  members: Member[],
  excludeId?: string
): ValidationError[] {
  const errors: ValidationError[] = []

  // 姓名必填
  if (!formData.name.trim()) {
    errors.push({ field: 'name', message: '姓名不能为空' })
  }

  // 性别必须是枚举值
  if (!isValidGender(formData.gender)) {
    errors.push({ field: 'gender', message: '请选择有效的性别' })
  }

  // 身份证号格式
  if (!formData.idCardNumber.trim()) {
    errors.push({ field: 'idCardNumber', message: '身份证号不能为空' })
  } else if (!isValidIdCardFormat(formData.idCardNumber)) {
    errors.push({ field: 'idCardNumber', message: '身份证号格式不正确' })
  } else if (!isIdCardUnique(formData.idCardNumber, members, excludeId)) {
    errors.push({ field: 'idCardNumber', message: '身份证号已存在' })
  }

  // 职位必填
  if (!formData.jobTitle.trim()) {
    errors.push({ field: 'jobTitle', message: '职位不能为空' })
  }

  // 所属部门必须是枚举值
  if (!isValidDepartment(formData.department)) {
    errors.push({ field: 'department', message: '请选择有效的部门' })
  }

  // 职级必须是枚举值
  if (!isValidLevel(formData.level)) {
    errors.push({ field: 'level', message: '请选择有效的职级' })
  }

  return errors
}
