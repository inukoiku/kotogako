<template>
  <div class="admin-login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>後台管理系統</h1>
          <p>請登入您的管理員帳號</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">電子郵件</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="請輸入電子郵件"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="password">密碼</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="請輸入密碼"
              required
              :disabled="loading"
            />
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="loading">登入中...</span>
            <span v-else>登入</span>
          </button>
        </form>

        <div class="login-footer">
          <router-link to="/">← 返回網站首頁</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLoginPage } from '@/admin/composables/useLoginPage';
import '@/admin/styles/admin-common.css';
import '@/admin/styles/login.css';

const {
  email,
  password,
  errorMessage,
  loading,
  handleLogin
} = useLoginPage();
</script>

