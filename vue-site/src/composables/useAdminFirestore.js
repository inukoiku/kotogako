import { ref } from 'vue';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * 後台管理用 Firestore CRUD composable
 */
export function useAdminFirestore() {
  const loading = ref(false);
  const error = ref(null);

  /**
   * 取得集合中所有文件（不篩選 active）
   */
  async function getAll(collectionPath, orderField = 'order') {
    loading.value = true;
    error.value = null;

    try {
      const pathParts = collectionPath.split('/');
      let collectionRef;
      
      if (pathParts.length === 1) {
        collectionRef = collection(db, pathParts[0]);
      } else if (pathParts.length === 3) {
        collectionRef = collection(db, pathParts[0], pathParts[1], pathParts[2]);
      } else {
        throw new Error('Invalid collection path');
      }

      const q = query(collectionRef, orderBy(orderField, 'asc'));
      const querySnapshot = await getDocs(q);
      const items = [];

      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return items;
    } catch (err) {
      console.error('Error fetching all items:', err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * 取得單一文件
   */
  async function getById(documentPath) {
    loading.value = true;
    error.value = null;

    try {
      const docRef = doc(db, documentPath);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (err) {
      console.error('Error fetching document:', err);
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 新增文件
   */
  async function create(collectionPath, data, customId = null) {
    loading.value = true;
    error.value = null;

    try {
      const pathParts = collectionPath.split('/');
      let docRef;

      if (customId) {
        if (pathParts.length === 1) {
          docRef = doc(db, pathParts[0], customId);
        } else if (pathParts.length === 3) {
          docRef = doc(db, pathParts[0], pathParts[1], pathParts[2], customId);
        }
      } else {
        // 自動生成 ID
        const collectionRef = pathParts.length === 1 
          ? collection(db, pathParts[0])
          : collection(db, pathParts[0], pathParts[1], pathParts[2]);
        docRef = doc(collectionRef);
      }

      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(docRef, docData);
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error creating document:', err);
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  /**
   * 更新文件
   */
  async function update(documentPath, data) {
    loading.value = true;
    error.value = null;

    try {
      const docRef = doc(db, documentPath);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      return { success: true };
    } catch (err) {
      console.error('Error updating document:', err);
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  /**
   * 更新單一欄位（用於 pages/homepage 的 homevideo 等）
   */
  async function updateField(documentPath, fieldName, value) {
    loading.value = true;
    error.value = null;

    try {
      const docRef = doc(db, documentPath);
      await updateDoc(docRef, {
        [fieldName]: value,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (err) {
      console.error('Error updating field:', err);
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  /**
   * 刪除文件
   */
  async function remove(documentPath) {
    loading.value = true;
    error.value = null;

    try {
      const docRef = doc(db, documentPath);
      await deleteDoc(docRef);
      return { success: true };
    } catch (err) {
      console.error('Error deleting document:', err);
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  /**
   * 批次更新排序
   */
  async function updateOrder(collectionPath, items) {
    loading.value = true;
    error.value = null;

    try {
      const batch = writeBatch(db);
      const pathParts = collectionPath.split('/');

      items.forEach((item, index) => {
        let docRef;
        if (pathParts.length === 1) {
          docRef = doc(db, pathParts[0], item.id);
        } else if (pathParts.length === 3) {
          docRef = doc(db, pathParts[0], pathParts[1], pathParts[2], item.id);
        }
        batch.update(docRef, { 
          order: index + 1,
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error updating order:', err);
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  /**
   * 切換 active 狀態
   */
  async function toggleActive(documentPath, currentActive) {
    return await update(documentPath, { active: !currentActive });
  }

  return {
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    updateField,
    remove,
    updateOrder,
    toggleActive
  };
}
