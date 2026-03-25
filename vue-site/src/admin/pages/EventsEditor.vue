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
                {{ element.active ? '🟢' : '🔴' }}
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
import draggable from 'vuedraggable';
import { useEventsEditor } from '@/admin/composables/useEventsEditor';
import '@/admin/styles/admin-common.css';
import '@/admin/styles/admin-editor.css';

const {
  items,
  loading,
  showModal,
  showDeleteModal,
  isEditing,
  saving,
  currentItem,
  formData,
  fetchData,
  truncateHtml,
  openCreateModal,
  openEditModal,
  closeModal,
  saveItem,
  confirmDelete,
  deleteItem,
  toggleActive,
  handleOrderChange
} = useEventsEditor();
</script>

<style scoped>
/* Page-specific overrides */
.form-group textarea {
  min-height: 200px;
  font-family: monospace;
}
</style>
