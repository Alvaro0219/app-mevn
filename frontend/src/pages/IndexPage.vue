<template>
  <q-page padding>
    <h1>Bienvenido al Home</h1>
    <div>
      <strong>Mensaje desde backend:</strong> {{ mensaje }}
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { testConnection } from 'src/services/api.js'

const mensaje = ref('Cargando...')

onMounted(async () => {
  try {
    const res = await testConnection()
    mensaje.value = res.data.message || 'Sin mensaje'
  } catch (error) {
    mensaje.value = 'Error conectando al backend'
    console.error(error)
  }
})
</script>
