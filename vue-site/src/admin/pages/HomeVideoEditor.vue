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
import { ref, computed, onMounted } from 'vue';
import { useAdminFirestore } from '@/composables/useAdminFirestore';

const { loading, getById, updateField } = useAdminFirestore();

const videoId = ref('');
const originalVideoId = ref('');
const saving = ref(false);
const saveSuccess = ref(false);

const hasChanges = computed(() => videoId.value !== originalVideoId.value);

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  const data = await getById('pages/homepage');
  if (data) {
    videoId.value = data.homevideo || '';
    originalVideoId.value = data.homevideo || '';
  }
}

async function saveVideo() {
  saving.value = true;
  saveSuccess.value = false;

  try {
    await updateField('pages/homepage', 'homevideo', videoId.value);
    originalVideoId.value = videoId.value;
    saveSuccess.value = true;
    
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } catch (err) {
    alert('儲存失敗: ' + err.message);
  } finally {
    saving.value = false;
  }
}

function resetChanges() {
  videoId.value = originalVideoId.value;
}
</script>

<style scoped>
.editor-page {
  max-width: 800px;
}

.video-editor-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #1a1a2e;
}

.card-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.card-body {
  padding: 24px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  font-family: monospace;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-hint {
  font-size: 13px;
  color: #888;
  margin: 0;
}

.form-hint strong {
  color: #667eea;
}

.video-preview {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.video-preview h3 {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px;
}

.preview-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 8px;
}

.preview-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #d0d0d0;
}

.success-message {
  padding: 12px 16px;
  background: #dcfce7;
  color: #166534;
  border-radius: 8px;
  font-weight: 500;
}
</style>
