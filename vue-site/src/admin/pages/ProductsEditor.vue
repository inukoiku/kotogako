<template>
  <div class="editor-page">
    <!-- 工具列 -->
    <div class="toolbar">
      <button class="btn btn-primary" @click="openCreateModal">
        ➕ 新增產品
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
        尚無產品項目，請點擊「新增產品」按鈕建立
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
              <img :src="element.imageUrl" :alt="element.title" />
            </div>
            <div class="item-info">
              <h3>{{ element.title || '無標題' }}</h3>
              <p class="item-desc">{{ truncateText(element.description, 80) }}</p>
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
            <h2>{{ isEditing ? '編輯產品' : '新增產品' }}</h2>
            <button class="modal-close" @click="closeModal">×</button>
          </div>
          <form @submit.prevent="saveItem" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>產品名稱 *</label>
                <input v-model="formData.title" type="text" placeholder="產品名稱" required />
              </div>
              <div class="form-group">
                <label>排序</label>
                <input v-model.number="formData.order" type="number" min="1" />
              </div>
            </div>
            
            <div class="form-group">
              <label>產品圖片網址 *</label>
              <input v-model="formData.imageUrl" type="url" placeholder="https://..." required />
              <div v-if="formData.imageUrl" class="image-preview">
                <img :src="formData.imageUrl" alt="預覽" />
              </div>
            </div>

            <div class="form-group">
              <label>產品描述</label>
              <textarea v-model="formData.description" rows="3" placeholder="產品描述..."></textarea>
            </div>

            <div class="form-group">
              <label>購買連結</label>
              <input v-model="formData.buyUrl" type="url" placeholder="https://..." />
            </div>

            <div class="form-group checkbox">
              <label>
                <input v-model="formData.active" type="checkbox" />
                啟用此產品
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
import '@/admin/styles/admin-common.css';
import '@/admin/styles/admin-editor.css';

const COLLECTION_PATH = 'pages/productpage/productItems';

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
  description: '',
  buyUrl: '',
  order: 1,
  active: true
});

onMounted(() => {
  fetchData();
});

async function fetchData() {
  items.value = await getAll(COLLECTION_PATH);
}

function truncateText(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function openCreateModal() {
  isEditing.value = false;
  formData.value = {
    title: '',
    imageUrl: '',
    description: '',
    buyUrl: '',
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

