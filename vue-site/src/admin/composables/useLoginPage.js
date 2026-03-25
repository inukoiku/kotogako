import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

export function useLoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');

  async function handleLogin() {
    errorMessage.value = '';
    
    const result = await login(email.value, password.value);
    
    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      errorMessage.value = result.error;
    }
  }

  return {
    // State
    email,
    password,
    errorMessage,
    loading,
    // Methods
    handleLogin
  };
}
