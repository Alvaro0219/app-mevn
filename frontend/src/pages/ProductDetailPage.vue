<template>
    <q-page padding>
      <div class="q-pa-md" v-if="loading">
        <q-spinner-dots size="50px" color="primary" />
      </div>
  
      <div class="q-pa-md" v-else-if="error">
        <q-banner dense rounded class="bg-negative text-white">
          <template v-slot:avatar>
            <q-icon name="error" />
          </template>
          {{ error }}
        </q-banner>
        <q-btn
          class="q-mt-md"
          label="Volver a la lista"
          color="primary"
          no-caps
          outline
          @click="$router.push({ name: 'productos' })"
        />
      </div>
  
      <div class="row q-col-gutter-lg" v-else-if="product">
        <div class="col-12 text-center">
          <h4 class="text-h4 q-my-none text-primary">{{ product.name }}</h4>
        </div>
        <div class="col-12 col-md-6">
          <q-card flat bordered class="rounded-borders">
            <q-img
              :src="product.image || 'https://via.placeholder.com/600x400.png?text=Sin+Imagen'"
              :alt="product.name"
              class="full-width"
              fit="contain"
              ratio="1.6"
            />
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card flat bordered class="rounded-borders">
            <q-card-section>
              <div class="text-subtitle1 text-grey-8">
                {{ product.description }}
              </div>
              <q-list separator class="q-mt-md">
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Precio</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-primary text-h6">{{ formatPrice(product.price) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Stock</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{ product.stock }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Categoría</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{ product.category }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Última Actualización</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{ formatDate(product.updatedAt) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions align="right" class="q-pt-none">
              <q-btn
                label="Volver"
                color="primary"
                flat
                no-caps
                @click="$router.push({ name: 'productos' })"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useProducts } from 'src/composables/useProducts';
  import { useQuasar } from 'quasar';
  
  const $q = useQuasar();
  const route = useRoute();
  const { product, loading, error, fetchProductById } = useProducts();
  
  onMounted(async () => {
    const productId = route.params.id;
    if (productId) {
      try {
        await fetchProductById(productId);
      } catch (err) {
        $q.notify({
          type: 'negative',
          message: err.message || 'Error al cargar los detalles del producto',
          position: 'top'
        });
      }
    }
  });
  
  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  </script>
  
  <style scoped>
  .rounded-borders {
    border-radius: 10px;
  }
  .q-card-section {
    padding: 16px;
  }
  </style>