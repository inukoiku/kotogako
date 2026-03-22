import { ref, computed } from 'vue';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// 全局狀態（單例模式）
const user = ref(null);
const adminData = ref(null);
const loading = ref(true);
const error = ref(null);
let authInitialized = false;

/**
 * 認證相關 composable
 */
export function useAuth() {
  // 初始化認證狀態監聽（只執行一次）
  if (!authInitialized) {
    authInitialized = true;
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser;
        // 檢查是否為管理員
        await fetchAdminData(firebaseUser.uid);
      } else {
        user.value = null;
        adminData.value = null;
      }
      loading.value = false;
    });
  }

  /**
   * 取得管理員資料
   */
  async function fetchAdminData(uid) {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      if (adminDoc.exists() && adminDoc.data().isActive) {
        adminData.value = {
          id: adminDoc.id,
          ...adminDoc.data()
        };
      } else {
        adminData.value = null;
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      adminData.value = null;
    }
  }

  /**
   * 登入
   */
  async function login(email, password) {
    loading.value = true;
    error.value = null;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      
      // 檢查是否為管理員
      await fetchAdminData(userCredential.user.uid);
      
      if (!adminData.value) {
        // 不是管理員，登出
        await signOut(auth);
        user.value = null;
        throw new Error('您沒有管理員權限');
      }
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      error.value = getErrorMessage(err.code || err.message);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  /**
   * 登出
   */
  async function logout() {
    try {
      await signOut(auth);
      user.value = null;
      adminData.value = null;
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      error.value = err.message;
      return { success: false, error: err.message };
    }
  }

  /**
   * 轉換錯誤訊息為中文
   */
  function getErrorMessage(code) {
    const messages = {
      'auth/invalid-email': '電子郵件格式不正確',
      'auth/user-disabled': '此帳號已被停用',
      'auth/user-not-found': '找不到此帳號',
      'auth/wrong-password': '密碼錯誤',
      'auth/invalid-credential': '帳號或密碼錯誤',
      'auth/too-many-requests': '登入嘗試次數過多，請稍後再試',
      '您沒有管理員權限': '您沒有管理員權限'
    };
    return messages[code] || '登入失敗，請稍後再試';
  }

  // Computed
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => !!adminData.value);
  const isSuperAdmin = computed(() => adminData.value?.role === 'super_admin');
  const currentUser = computed(() => user.value);
  const permissions = computed(() => adminData.value?.permissions || []);

  return {
    user,
    adminData,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    currentUser,
    permissions,
    login,
    logout,
    fetchAdminData
  };
}
