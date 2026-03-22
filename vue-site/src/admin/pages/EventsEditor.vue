<template>
  <div class="editor-page">
    <!-- 工具列 -->
    <div class="toolbar">
      <button class="btn btn-primary" @click="openCreateModal">
        ➕ 新增活動
      </button>
      <button class="btn btn-secondary" @click="fetchData" :disabled="loading">
        🔄 重新整理
      </button>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="loading">載入中...</div>

    <!-- 資料列表 -->
    <div v-else class="items-list">
      <div v-if="items.length === 0" class="empty-state">
        尚無活動項目，請點擊「新增活動」按鈕建立
      </div>

      <draggable 
        v-else
        v-model="items" 
        item-key="id"
        handle=".drag-handle"
        @end="handleOrderChange"
        class="draggable-list"
      >
        <template #item="{ element }">
          <div class="item-card" :class="{ inactive: !element.active }">
            <div class="drag-handle">⋮⋮</div>
            <div class="item-preview">
              <img :src="element.imageUrl" :alt="element.title" />
            </div>
            <div class="item-info">
              <h3>{{ element.title || '無標題' }}</h3>
              <p class="item-desc">{{ truncateHtml(element.htmlContent, 100) }}</p>
              <div class="item-meta">
                <span class="order-badge">排序: {{ element.order }}</span>
                <span class="status-badge" :class="element.active ? 'active' : 'inactive'">
                  {{ element.active ? '啟用' : '停用' }}
                </span>
              </div>
            </div>
            <div class="item-actions">
              <button class="btn-icon" @click="toggleActive(element)" :title="element.active ? '停用' : '啟用'">
                {{ element.active ? '🔴' : '🟢' }}
              </button>
              <button class="btn-icon" @click="openEditModal(element)" title="編輯">
                ✏️
              </button>
              <button class="btn-icon delete" @click="confirmDelete(element)" title="刪除">
                🗑️
              </button>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- 編輯 Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content modal-large" @click.stop>
          <div class="modal-header">
            <h2>{{ isEditing ? '編輯活動' : '新增活動' }}</h2>
            <button class="modal-close" @click="closeModal">×</button>
          </div>
          <form @submit.prevent="saveItem" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>活動標題 *</label>
                <input v-model="formData.title" type="text" placeholder="活動標題" required />
              </div>
              <div class="form-group">
                <label>排序</label>
                <input v-model.number="formData.order" type="number" min="1" />
              </div>
            </div>
            
            <div class="form-group">
              <label>封面圖片網址 *</label>
              <input v-model="formData.imageUrl" type="url" placeholder="https://..." required />
              <div v-if="formData.imageUrl" class="image-preview">
                <img :src="formData.imageUrl" alt="預覽" />
              </div>
            </div>

            <div class="form-group">
              <label>活動內容 (HTML)</label>
              <textarea 
                v-model="formData.htmlContent" 
                rows="10" 
                placeholder="<div class='news-content'>...</div>"
              ></textarea>
              <p class="form-hint">支援 HTML 標籤，可包含圖片、列表等</p>
            </div>

            <div class="form-group checkbox">
              <label>
                <input v-model="formData.active" type="checkbox" />
                啟用此活動
              </label>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? '儲存中...' : '儲存' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- 刪除確認 Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
        <div class="modal-content modal-small" @click.stop>
          <div class="modal-header">
            <h2>確認刪除</h2>
          </div>
          <p class="delete-message">確定要刪除「{{ currentItem?.title }}」嗎？此操作無法復原。</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="showDeleteModal = false">取消</button>
            <button class="btn btn-danger" @click="deleteItem" :disabled="saving">
              {{ saving ? '刪除中...' : '確認刪除' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import { useAdminFirestore } from '@/composables/useAdminFirestore';

const COLLECTION_PATH = 'pages/eventpage/eventItems';

const { loading, getAll, create, update, remove, updateOrder } = useAdminFirestore();

const items = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const currentItem = ref(null);

const formData = ref({
  title: '',
  imageUrl: '',
  htmlContent: '',
  order: 1,
  active: true
});

onMounted(() => {
  fetchData();
});

async function fetchData() {
  items.value = await getAll(COLLECTION_PATH);
}

function truncateHtml(html, maxLength) {
  if (!html) return '';
  // 移除 HTML 標籤後截斷
  const text = html.replace(/<[^>]*>/g, '');
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function openCreateModal() {
  isEditing.value = false;
  formData.value = {
    title: '',
    imageUrl: '',
    htmlContent: '',
    order: items.value.length + 1,
    active: true
  };
  showModal.value = true;
}

function openEditModal(item) {
  isEditing.value = true;
  currentItem.value = item;
  formData.value = { ...item };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  currentItem.value = null;
}

async function saveItem() {
  saving.value = true;
  
  try {
    if (isEditing.value) {
      await update(`${COLLECTION_PATH}/${currentItem.value.id}`, formData.value);
    } else {
      await create(COLLECTION_PATH, formData.value);
    }
    
    await fetchData();
    closeModal();
  } catch (err) {
    alert('儲存失敗: ' + err.message);
  } finally {
    saving.value = false;
  }
}

function confirmDelete(item) {
  currentItem.value = item;
  showDeleteModal.value = true;
}

async function deleteItem() {
  saving.value = true;
  
  try {
    await remove(`${COLLECTION_PATH}/${currentItem.value.id}`);
    await fetchData();
    showDeleteModal.value = false;
  } catch (err) {
    alert('刪除失敗: ' + err.message);
  } finally {
    saving.value = false;
    currentItem.value = null;
  }
}

async function toggleActive(item) {
  await update(`${COLLECTION_PATH}/${item.id}`, { active: !item.active });
  await fetchData();
}

async function handleOrderChange() {
  await updateOrder(COLLECTION_PATH, items.value);
}
</script>

<style scoped>
.editor-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toolbar {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover {
  background: #b91c1c;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  color: #666;
}

.draggable-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
}

.item-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.item-card.inactive {
  opacity: 0.6;
}

.drag-handle {
  cursor: grab;
  padding: 8px;
  color: #999;
  font-size: 18px;
}

.drag-handle:active {
  cursor: grabbing;
}

.item-preview {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info h3 {
  font-size: 16px;
  margin: 0 0 4px;
  color: #1a1a2e;
}

.item-desc {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px;
  line-height: 1.4;
}

.item-meta {
  display: flex;
  gap: 8px;
}

.order-badge,
.status-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}

.order-badge {
  background: #f0f0f0;
  color: #666;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #dc2626;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #e0e0e0;
}

.btn-icon.delete:hover {
  background: #fee2e2;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-large {
  max-width: 700px;
}

.modal-small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
}

.modal-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="url"],
.form-group input[type="number"],
.form-group textarea {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
  min-height: 200px;
  font-family: monospace;
}

.form-hint {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.form-group.checkbox {
  flex-direction: row;
  align-items: center;
}

.form-group.checkbox label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.image-preview {
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
  max-height: 150px;
}

.image-preview img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 24px 24px;
}

.delete-message {
  padding: 20px 24px;
  color: #666;
}
</style>
