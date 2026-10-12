import { ref, onMounted } from 'vue';
import { useAdminFirestore } from '@/composables/useAdminFirestore';

const COLLECTION_PATH = 'pages/boardpage/boardItems';

function slugify(text) {
  return (text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function useBoardsEditor() {
  const { loading, getAll, create, update, remove, updateOrder } = useAdminFirestore();

  const items = ref([]);
  const showModal = ref(false);
  const showDeleteModal = ref(false);
  const isEditing = ref(false);
  const saving = ref(false);
  const currentItem = ref(null);
  const slugError = ref('');

  const formData = ref({
    title: '',
    slug: '',
    description: '',
    imageUrl: '',
    order: 1,
    active: true
  });

  onMounted(() => {
    fetchData();
  });

  async function fetchData() {
    items.value = await getAll(COLLECTION_PATH);
  }

  function openCreateModal() {
    isEditing.value = false;
    slugError.value = '';
    formData.value = {
      title: '',
      slug: '',
      description: '',
      imageUrl: '',
      order: items.value.length + 1,
      active: true
    };
    showModal.value = true;
  }

  function openEditModal(item) {
    isEditing.value = true;
    slugError.value = '';
    currentItem.value = item;
    formData.value = { ...item };
    showModal.value = true;
  }

  function closeModal() {
    showModal.value = false;
    currentItem.value = null;
    slugError.value = '';
  }

  function autoFillSlug() {
    if (!isEditing.value && !formData.value.slug) {
      formData.value.slug = slugify(formData.value.title);
    }
  }

  function isSlugTaken(slug) {
    return items.value.some(
      (item) => item.slug === slug && item.id !== currentItem.value?.id
    );
  }

  async function saveItem() {
    const slug = slugify(formData.value.slug);

    if (!slug) {
      slugError.value = '請填寫識別碼（slug）';
      return;
    }

    if (isSlugTaken(slug)) {
      slugError.value = '這個識別碼已經被其他留言板使用，請換一個';
      return;
    }

    slugError.value = '';
    formData.value.slug = slug;
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
    slugError,
    // Methods
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
  };
}
