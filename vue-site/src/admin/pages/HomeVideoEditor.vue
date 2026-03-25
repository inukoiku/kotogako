<template>
  <div class="editor-page">
    <div class="video-editor-card">
      <div class="card-header">
        <h2>🎬 首頁 YouTube 影片設定</h2>
        <p>設定首頁顯示的 YouTube 影片 ID</p>
      </div>

      <div class="card-body">
        <div v-if="loading" class="loading">載入中...</div>

        <div v-else class="form-content">
          <div class="form-group">
            <label>YouTube 影片 ID</label>
            <input 
              v-model="videoId" 
              type="text" 
              placeholder="例如: dQw4w9WgXcQ"
            />
            <p class="form-hint">
              從 YouTube 網址 https://www.youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong> 取得 ID
            </p>
          </div>

          <div v-if="videoId" class="video-preview">
            <h3>預覽</h3>
            <div class="preview-container">
              <iframe
                :src="`https://www.youtube.com/embed/${videoId}`"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <div class="form-actions">
            <button 
              class="btn btn-primary" 
              @click="saveVideo" 
              :disabled="saving || !hasChanges"
            >
              {{ saving ? '儲存中...' : '儲存變更' }}
            </button>
            <button 
              class="btn btn-secondary" 
              @click="resetChanges"
              :disabled="!hasChanges"
            >
              取消變更
            </button>
          </div>

          <div v-if="saveSuccess" class="success-message">
            ✅ 儲存成功！
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHomeVideoEditor } from '@/admin/composables/useHomeVideoEditor';
import '@/admin/styles/admin-common.css';
import '@/admin/styles/homeVideoEditor.css';

const {
  loading,
  videoId,
  saving,
  saveSuccess,
  hasChanges,
  saveVideo,
  resetChanges
} = useHomeVideoEditor();
</script>

