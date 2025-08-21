import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', // la URL de tu backend
  timeout: 5000
})

export default boot(({ app }) => {
  // para usar axios globalmente como this.$axios o this.$api en componentes
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }