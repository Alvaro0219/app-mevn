<template>
  <q-page padding>
    <h1>Bienvenido al Home</h1>
    <div>
      <strong>Mensaje desde backend:</strong> {{ message || 'Cargando...' }}
      <q-inner-loading :showing="loading" />
      <q-banner v-if="error" class="bg-negative text-white q-mt-md">
        {{ error }}
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHome } from 'src/composables/useHome'

const { message, loading, error, fetchHomeData } = useHome()

onMounted(() => {
  fetchHomeData()
})
</script>
