import { ref, onMounted } from 'vue';
import { useAdminFirestore } from '@/composables/useAdminFirestore';

const MAGAZINES_PATH = 'pages/librarypage/magazines';

export function useMagazinePagesEditor(magazineId) {
  const { loading, getById, getAll, create, update, remove, updateOrder, createBatch } = useAdminFirestore();
  const pagesPath = `${MAGAZINES_PATH}/${magazineId}/pages`;

  const magazine = ref(null);
  const items = ref([]);
  const showModal = ref(false);
  const showDeleteModal = ref(false);
  const showBatchModal = ref(false);
  const isEditing = ref(false);
  const saving = ref(false);
  const currentItem = ref(null);
  const batchUrls = ref('');
  const batchImporting = ref(false);

  const formData = ref({
    imageUrl: '',
    alt: '',
    order: 1,
    active: true
  });

  onMounted(() => {
    fetchMagazine();
    fetchData();
  });

  async function fetchMagazine() {
    magazine.value = await getById(`${MAGAZINES_PATH}/${magazineId}`);
  }

  async function fetchData() {
    items.value = await getAll(pagesPath);
  }

  function openCreateModal() {
    isEditing.value = false;
    formData.value = {
      imageUrl: '',
      alt: '',
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
        await update(`${pagesPath}/${currentItem.value.id}`, formData.value);
      } else {
        await create(pagesPath, formData.value);
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
      await remove(`${pagesPath}/${currentItem.value.id}`);
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
    await update(`${pagesPath}/${item.id}`, { active: !item.active });
    await fetchData();
  }

  async function handleOrderChange() {
    await updateOrder(pagesPath, items.value);
  }

  function openBatchModal() {
    batchUrls.value = '';
    showBatchModal.value = true;
  }

  function closeBatchModal() {
    showBatchModal.value = false;
    batchUrls.value = '';
  }

  async function importBatch() {
    const urls = batchUrls.value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (!urls.length) return;

    batchImporting.value = true;

    try {
      const startOrder = items.value.length;
      const pages = urls.map((imageUrl, index) => ({
        imageUrl,
        alt: '',
        order: startOrder + index + 1,
        active: true
      }));

      await createBatch(pagesPath, pages);
      await fetchData();
      closeBatchModal();
    } catch (err) {
      alert('批量匯入失敗: ' + err.message);
    } finally {
      batchImporting.value = false;
    }
  }

  return {
    // State
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
    // Methods
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
  };
}
