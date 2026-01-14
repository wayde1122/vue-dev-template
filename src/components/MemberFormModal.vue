<template>
  <BaseModal v-model="isOpen" :title="isEdit ? '编辑人员' : '新增人员'" size="md">
    <form @submit.prevent="handleSubmit" class="member-form">
      <!-- 姓名 -->
      <div class="form-group">
        <label for="name" class="form-label">
          姓名 <span class="required">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="form-input"
          :class="{ 'input-error': fieldErrors.name }"
          placeholder="请输入姓名"
        />
        <span v-if="fieldErrors.name" class="error-text">{{ fieldErrors.name }}</span>
      </div>

      <!-- 性别 -->
      <div class="form-group">
        <label class="form-label">
          性别 <span class="required">*</span>
        </label>
        <BaseSelect
          v-model="form.gender"
          :options="genderOptions"
          placeholder="请选择性别"
          :error="!!fieldErrors.gender"
        />
        <span v-if="fieldErrors.gender" class="error-text">{{ fieldErrors.gender }}</span>
      </div>

      <!-- 身份证号 -->
      <div class="form-group">
        <label for="idCardNumber" class="form-label">
          身份证号 <span class="required">*</span>
        </label>
        <input
          id="idCardNumber"
          v-model="form.idCardNumber"
          type="text"
          class="form-input"
          :class="{ 'input-error': fieldErrors.idCardNumber }"
          placeholder="请输入18位身份证号"
          maxlength="18"
        />
        <span v-if="fieldErrors.idCardNumber" class="error-text">{{ fieldErrors.idCardNumber }}</span>
      </div>

      <!-- 职位 -->
      <div class="form-group">
        <label for="jobTitle" class="form-label">
          职位 <span class="required">*</span>
        </label>
        <input
          id="jobTitle"
          v-model="form.jobTitle"
          type="text"
          class="form-input"
          :class="{ 'input-error': fieldErrors.jobTitle }"
          placeholder="请输入职位"
        />
        <span v-if="fieldErrors.jobTitle" class="error-text">{{ fieldErrors.jobTitle }}</span>
      </div>

      <!-- 所属部门 -->
      <div class="form-group">
        <label class="form-label">
          所属部门 <span class="required">*</span>
        </label>
        <BaseSelect
          v-model="form.department"
          :options="departmentOptions"
          placeholder="请选择部门"
          :error="!!fieldErrors.department"
        />
        <span v-if="fieldErrors.department" class="error-text">{{ fieldErrors.department }}</span>
      </div>

      <!-- 职级 -->
      <div class="form-group">
        <label class="form-label">
          职级 <span class="required">*</span>
        </label>
        <BaseSelect
          v-model="form.level"
          :options="levelOptions"
          placeholder="请选择职级"
          :error="!!fieldErrors.level"
        />
        <span v-if="fieldErrors.level" class="error-text">{{ fieldErrors.level }}</span>
      </div>
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="handleCancel">取消</BaseButton>
      <BaseButton variant="primary" @click="handleSubmit">{{ isEdit ? '保存' : '新增' }}</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { GENDERS, DEPARTMENTS, LEVELS } from '@/stores/types'
import type { Member, MemberFormData, Gender, Department, Level } from '@/stores/types'
import { useTeamStore } from '@/stores/team'

const props = defineProps<{
  modelValue: boolean
  member?: Member | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'saved': [member: Member]
}>()

const teamStore = useTeamStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.member)

// 选项数据
const genderOptions = GENDERS.map((g) => ({ value: g, label: g }))
const departmentOptions = DEPARTMENTS.map((d) => ({ value: d, label: d }))
const levelOptions = LEVELS.map((l) => ({ value: l, label: l }))

// 表单数据
const form = reactive<{
  name: string
  gender: Gender | ''
  idCardNumber: string
  jobTitle: string
  department: Department | ''
  level: Level | ''
}>({
  name: '',
  gender: '',
  idCardNumber: '',
  jobTitle: '',
  department: '',
  level: ''
})

// 字段错误信息
const fieldErrors = ref<Record<string, string>>({})

// 监听 member 变化，填充表单
watch(
  () => props.member,
  (member) => {
    if (member) {
      form.name = member.name
      form.gender = member.gender
      form.idCardNumber = member.idCardNumber
      form.jobTitle = member.jobTitle
      form.department = member.department
      form.level = member.level
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// 监听弹窗打开，重置错误
watch(isOpen, (open) => {
  if (open) {
    fieldErrors.value = {}
  }
})

function resetForm() {
  form.name = ''
  form.gender = ''
  form.idCardNumber = ''
  form.jobTitle = ''
  form.department = ''
  form.level = ''
  fieldErrors.value = {}
}

function handleCancel() {
  isOpen.value = false
}

function handleSubmit() {
  fieldErrors.value = {}

  // 构造表单数据（类型断言）
  const formData: MemberFormData = {
    name: form.name,
    gender: form.gender as Gender,
    idCardNumber: form.idCardNumber,
    jobTitle: form.jobTitle,
    department: form.department as Department,
    level: form.level as Level
  }

  let result: { member: Member | null; errors: { field: string; message: string }[] }

  if (isEdit.value && props.member) {
    result = teamStore.updateMember(props.member.id, formData)
  } else {
    result = teamStore.addMember(formData)
  }

  if (result.errors.length > 0) {
    // 映射错误到字段
    for (const err of result.errors) {
      fieldErrors.value[err.field] = err.message
    }
    return
  }

  if (result.member) {
    emit('saved', result.member)
    isOpen.value = false
    resetForm()
  }
}
</script>

<style scoped>
.member-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.required {
  color: var(--color-error);
}

/* 输入框样式 */
.form-input {
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--color-text);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  outline: none;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.form-input::placeholder {
  color: var(--color-text-light);
}

.form-input:hover {
  border-color: var(--color-border-hover);
}

.form-input:focus {
  border-color: var(--color-cta);
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
}

.form-input.input-error {
  border-color: var(--color-error);
}

.form-input.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* 错误提示 */
.error-text {
  font-size: 0.75rem;
  color: var(--color-error);
}
</style>
