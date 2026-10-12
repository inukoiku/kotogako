<template>
  <div class="editor-page">
    <!-- 工具列 -->
    <div class="toolbar">
      <button class="btn btn-primary" @click="openCreateModal">
        ➕ 新增留言板
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
        尚無留言板，請點擊「新增留言板」按鈕建立
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
            <div v-if="element.imageUrl" class="item-preview">
              <img :src="element.imageUrl" :alt="element.title" />
            </div>
            <div class="item-info">
              <h3>{{ element.title || '無標題' }}</h3>
              <p class="item-desc">{{ element.description || '（無說明）' }}</p>
              <div class="item-meta">
                <span class="order-badge">網址: /board/{{ element.slug }}</span>
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
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ isEditing ? '編輯留言板' : '新增留言板' }}</h2>
            <button class="modal-close" @click="closeModal">×</button>
          </div>
          <form @submit.prevent="saveItem" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>留言板標題 *</label>
                <input
                  v-model="formData.title"
                  type="text"
                  placeholder="例如：活動留言板"
                  required
                  @blur="autoFillSlug"
                />
              </div>
              <div class="form-group">
                <label>排序</label>
                <input v-model.number="formData.order" type="number" min="1" />
              </div>
            </div>

            <div class="form-group">
              <label>識別碼（slug） *</label>
              <input
                v-model="formData.slug"
                type="text"
                placeholder="例如：event-board"
                required
              />
              <p class="form-hint">
                只能用英文、數字、中文與 - 組成，決定網址 /board/{{ formData.slug || 'slug' }}，建立後盡量不要更改（否則舊留言串會找不到）
              </p>
              <p v-if="slugError" class="form-error">{{ slugError }}</p>
            </div>

            <div class="form-group">
              <label>封面圖片網址（選填）</label>
              <input v-model="formData.imageUrl" type="url" placeholder="https://..." />
              <div v-if="formData.imageUrl" class="image-preview">
                <img :src="formData.imageUrl" alt="預覽" />
              </div>
            </div>

            <div class="form-group">
              <label>說明（選填）</label>
              <textarea
                v-model="formData.description"
                rows="3"
                placeholder="這個留言板是給大家討論什麼的"
              ></textarea>
            </div>

            <div class="form-group checkbox">
              <label>
                <input v-model="formData.active" type="checkbox" />
                啟用此留言板（顯示在 /board 列表中）
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
          <p class="delete-message">
            確定要刪除「{{ currentItem?.title }}」嗎？此操作無法復原。
          </p>
          <p class="delete-message">
            ⚠️ 這只會移除留言板的入口，Disqus 上的留言串本身不會被刪除。若要完全刪除留言內容，需另外到 Disqus 後台的討論串管理刪除。
          </p>
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
import { useBoardsEditor } from '@/admin/composables/useBoardsEditor';
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
  slugError,
  fetchData,
  autoFillSlug,
  openCreateModal,
  openEditModal,
  closeModal,
  saveItem,
  confirmDelete,
  deleteItem,
  toggleActive,
  handleOrderChange
} = useBoardsEditor();
</script>

<style scoped>
.form-error {
  color: #d33;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
</style>
