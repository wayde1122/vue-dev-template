<template>
  <div class="login-view">
    <div class="login-container">
      <!-- Logo -->
      <div class="login-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <h1>TaskFlow</h1>
      </div>

      <!-- Form -->
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-header">
          <h2>Sign in to your account</h2>
          <p>Enter your credentials to access your workspace</p>
        </div>

        <BaseInput
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="name@company.com"
          required
          :error="!!error"
          :error-text="error"
        >
          <template #prefix>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </template>
        </BaseInput>

        <BaseInput
          v-model="form.password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
        >
          <template #prefix>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </template>
        </BaseInput>

        <div class="form-actions">
          <label class="remember-me">
            <input type="checkbox" v-model="form.remember" />
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-link">Forgot password?</a>
        </div>

        <BaseButton type="submit" :loading="loading" block size="lg">
          Sign in
        </BaseButton>
      </form>

      <!-- Footer -->
      <p class="login-footer">
        Don't have an account? <a href="#">Create an account</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const { login } = useAuth()
const { error: showError } = useNotification()

const form = ref({
  email: 'john@example.com',
  password: 'password',
  remember: false
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await login({
      email: form.value.email,
      password: form.value.password
    })
    router.push('/dashboard')
  } catch {
    error.value = 'Invalid credentials'
    showError('Invalid email or password')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background: var(--color-background);
}

.login-container {
  width: 100%;
  max-width: 420px;
  padding: var(--spacing-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.login-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.login-logo svg {
  color: var(--color-cta);
}

.login-logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-header {
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.form-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
}

.form-header p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  cursor: pointer;
}

.forgot-link {
  font-size: 0.875rem;
  color: var(--color-cta);
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-footer {
  margin-top: var(--spacing-lg);
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.login-footer a {
  color: var(--color-cta);
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>
