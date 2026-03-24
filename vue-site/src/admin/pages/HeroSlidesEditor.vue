<template>
  <div class="editor-page">
    <!-- 工具列 -->
    <div class="toolbar">
      <button class="btn btn-primary" @click="openCreateModal">
        ➕ 新增輪播
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
        尚無輪播項目，請點擊「新增輪播」按鈕建立
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
          <div class="item-card" :class="{ inactive: !element.isActive }">
            <div class="drag-handle">⋮⋮</div>
            <div class="item-preview">
              <img :src="element.imageUrl" :alt="element.title" />
            </div>
            <div class="item-info">
              <h3>{{ element.title || '無標題' }}</h3>
              <p class="item-link">{{ element.linkUrl || '無連結' }}</p>
              <div class="item-meta">
                <span class="order-badge">排序: {{ element.order }}</span>
                <span class="status-badge" :class="element.isActive ? 'active' : 'inactive'">
                  {{ element.isActive ? '啟用' : '停用' }}
                </span>
              </div>
            </div>
            <div class="item-actions">
              <button class="btn-icon" @click="toggleActive(element)" :title="element.isActive ? '停用' : '啟用'">
                {{ element.isActive ? '🟢' : '🔴' }}
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
            <h2>{{ isEditing ? '編輯輪播' : '新增輪播' }}</h2>
            <button class="modal-close" @click="closeModal">×</button>
          </div>
          <form @submit.prevent="saveItem" class="modal-form">
            <div class="form-group">
              <label>標題</label>
              <input v-model="formData.title" type="text" placeholder="輪播標題" />
            </div>
            <div class="form-group">
              <label>圖片網址 *</label>
              <input v-model="formData.imageUrl" type="url" placeholder="https://..." required />
              <div v-if="formData.imageUrl" class="image-preview">
                <img :src="formData.imageUrl" alt="預覽" />
              </div>
            </div>
            <div class="form-group">
              <label>連結網址</label>
              <input v-model="formData.linkUrl" type="url" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label>排序</label>
              <input v-model.number="formData.order" type="number" min="1" />
            </div>
            <div class="form-group checkbox">
              <label>
                <input v-model="formData.isActive" type="checkbox" />
                啟用此輪播
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
          <p class="delete-message">確定要刪除此輪播項目嗎？此操作無法復原。</p>
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

const COLLECTION_PATH = 'pages/homepage/carouselItems';

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
  linkUrl: '',
  order: 1,
  isActive: true
});

onMounted(() => {
  fetchData();
});

async function fetchData() {
  items.value = await getAll(COLLECTION_PATH);
}

function openCreateModal() {
  isEditing.value = false;
  formData.value = {
    title: '',
    imageUrl: '',
    linkUrl: '',
    order: items.value.length + 1,
    isActive: true
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
  await update(`${COLLECTION_PATH}/${item.id}`, { isActive: !item.isActive });
  await fetchData();
}

async function handleOrderChange() {
  await updateOrder(COLLECTION_PATH, items.value);
}
</script>

