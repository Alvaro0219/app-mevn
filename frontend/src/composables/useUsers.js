import { ref } from 'vue';
import axios from 'axios';

export default function useUsers() {
  const users = ref([]);
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const API_URL = 'http://localhost:5000/users';

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get(API_URL);
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
      const res = await axios.get(`${API_URL}/${id}`);
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
      const res = await axios.post(API_URL, data);
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
      const res = await axios.put(`${API_URL}/${id}`, data);
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
      await axios.delete(`${API_URL}/${id}`);
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
