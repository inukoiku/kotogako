<template>
  <div class="editor-page">
    <div class="page-header-nav">
      <router-link to="/admin/magazines" class="back-link">← 返回雜誌列表</router-link>
      <h2 v-if="magazine">{{ magazine.title }}</h2>
    </div>

    <!-- 工具列 -->
    <div class="toolbar">
      <button class="btn btn-primary" @click="openCreateModal">
        ➕ 新增單頁
      </button>
      <button class="btn btn-primary" @click="openBatchModal">
        📥 批量匯入圖片網址
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
        尚無頁面，請點擊「新增單頁」或「批量匯入圖片網址」建立
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
            <div class="item-preview square">
              <img :src="element.imageUrl" :alt="element.alt" />
            </div>
            <div class="item-info">
              <p class="item-link">{{ element.imageUrl }}</p>
              <div class="item-meta">
                <span class="order-badge">頁碼: {{ element.order }}</span>
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

    <!-- 單頁編輯 Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ isEditing ? '編輯頁面' : '新增頁面' }}</h2>
            <button class="modal-close" @click="closeModal">×</button>
          </div>
          <form @submit.prevent="saveItem" class="modal-form">
            <div class="form-group">
              <label>圖片網址 *</label>
              <input v-model="formData.imageUrl" type="url" placeholder="https://..." required />
              <div v-if="formData.imageUrl" class="image-preview">
                <img :src="formData.imageUrl" alt="預覽" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>替代文字</label>
                <input v-model="formData.alt" type="text" placeholder="用於無法載入圖片時顯示" />
              </div>
              <div class="form-group">
                <label>頁碼</label>
                <input v-model.number="formData.order" type="number" min="1" />
              </div>
            </div>

            <div class="form-group checkbox">
              <label>
                <input v-model="formData.active" type="checkbox" />
                啟用此頁面
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

    <!-- 批量匯入 Modal -->
    <Teleport to="body">
      <div v-if="showBatchModal" class="modal-overlay" @click="closeBatchModal">
        <div class="modal-content modal-large" @click.stop>
          <div class="modal-header">
            <h2>批量匯入圖片網址</h2>
            <button class="modal-close" @click="closeBatchModal">×</button>
          </div>
          <div class="modal-form">
            <div class="form-group">
              <label>圖片網址列表（一行一個網址，會依序接續在目前頁面之後）</label>
              <textarea
                v-model="batchUrls"
                rows="12"
                placeholder="https://example.com/page1.webp&#10;https://example.com/page2.webp&#10;https://example.com/page3.webp"
              ></textarea>
              <p class="form-hint">
                目前已有 {{ items.length }} 頁，匯入後會從第 {{ items.length + 1 }} 頁開始依序編號。
              </p>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="closeBatchModal">取消</button>
              <button
                type="button"
                class="btn btn-primary"
                :disabled="batchImporting || !batchUrls.trim()"
                @click="importBatch"
              >
                {{ batchImporting ? '匯入中...' : '開始匯入' }}
              </button>
            </div>
          </div>
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
          <p class="delete-message">確定要刪除第 {{ currentItem?.order }} 頁嗎？此操作無法復原。</p>
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
import { useRoute } from 'vue-router';
import { useMagazinePagesEditor } from '@/admin/composables/useMagazinePagesEditor';
import '@/admin/styles/admin-common.css';
import '@/admin/styles/admin-editor.css';

const route = useRoute();

const {
  magazine,
  items,
  loading,
  showModal,
  showDeleteModal,
  showBatchModal,
  isEditing,
  saving,
  currentItem,
  formData,
  batchUrls,
  batchImporting,
  fetchData,
  openCreateModal,
  openEditModal,
  closeModal,
  saveItem,
  confirmDelete,
  deleteItem,
  toggleActive,
  handleOrderChange,
  openBatchModal,
  closeBatchModal,
  importBatch
} = useMagazinePagesEditor(route.params.magazineId);
</script>

<style scoped>
.page-header-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
}

.back-link:hover {
  text-decoration: underline;
}

.page-header-nav h2 {
  margin: 0;
  font-size: 18px;
  color: #1a1a2e;
}

.modal-form textarea {
  font-family: monospace;
}
</style>
