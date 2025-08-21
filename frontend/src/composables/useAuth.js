import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:5000/auth'
const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const token = ref(localStorage.getItem('token') || null)

// Configure axios to include token in requests
if (token.value) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
}

export function useAuth() {

  const login = async (credentials) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, credentials)
      user.value = data.user
      token.value = data.token
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      return data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error de autenticación')
    }
  }

  const logout = async () => {
    try {
      // Solo intenta hacer logout si hay un token
      if (token.value) {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        });
      }
    } catch (error) {
      // Si el error es 404, significa que el endpoint no existe
      // pero igualmente procedemos a limpiar el estado local
      if (error.response?.status !== 404) {
        console.error('Error en logout:', error);
        throw error;
      }
    } finally {
      // Limpiar el estado local en cualquier caso
      user.value = null;
      token.value = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const isAuthenticated = () => {
    return !!token.value
  }

  const getCurrentUser = () => {
    return user.value
  }

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    getCurrentUser
  }
}