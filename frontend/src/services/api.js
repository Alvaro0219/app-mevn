import { api } from 'boot/axios'

// Función para testear la conexión al backend
export const testConnection = () => api.get('/')
