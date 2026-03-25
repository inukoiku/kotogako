import { ref, onMounted } from 'vue';
import { useAdminFirestore } from '@/composables/useAdminFirestore';

const COLLECTION_PATH = 'pages/eventpage/eventItems';

export function useEventsEditor() {
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

  return {
    // State
    items,
    loading,
    showModal,
    showDeleteModal,
    isEditing,
    saving,
    currentItem,
    formData,
    // Methods
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
  };
}
