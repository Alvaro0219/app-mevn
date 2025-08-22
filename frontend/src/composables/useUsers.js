import { ref } from 'vue';
import { api } from 'boot/axios';

export default function useUsers() {
  const users = ref([]);
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get('/users');
      users.value = res.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  // Obtener usuario por ID
  const fetchUserById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get(`/users/${id}`);
      user.value = res.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  // Crear usuario
  const createUser = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.post('/users', data);
      users.value.push(res.data); // Agregar a la lista local
      return res.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  // Actualizar usuario
  const updateUser = async (id, data) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.put(`/users/${id}`, data);
      // Actualiza localmente
      const index = users.value.findIndex(u => u._id === id);
      if (index !== -1) users.value[index] = res.data;
      return res.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  // Eliminar usuario
  const deleteUser = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/users/${id}`);
      users.value = users.value.filter(u => u._id !== id);
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    user,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser
  };
}
