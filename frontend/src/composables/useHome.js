import { ref } from 'vue'
import { api } from 'boot/axios'

export function useHome() {
  const message = ref('')
  const loading = ref(false)
  const error = ref(null)

  // Métricas dashboard
  const dashboardMetrics = ref({})

  const fetchHomeData = async () => {
    try {
      loading.value = true
      error.value = null
      const { data } = await api.get('/')
      message.value = data.message
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar los datos del inicio'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const fetchDashboardData = async () => {
    try {
      loading.value = true
      error.value = null
      const { data } = await api.get('/api/dashboard')
      dashboardMetrics.value = data
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar métricas del dashboard'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    message,
    loading,
    error,
    fetchHomeData,
    dashboardMetrics,
    fetchDashboardData
  }
}
