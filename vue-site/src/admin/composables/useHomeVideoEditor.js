import { ref, computed, onMounted } from 'vue';
import { useAdminFirestore } from '@/composables/useAdminFirestore';

export function useHomeVideoEditor() {
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

  return {
    // State
    loading,
    videoId,
    saving,
    saveSuccess,
    hasChanges,
    // Methods
    fetchData,
    saveVideo,
    resetChanges
  };
}
