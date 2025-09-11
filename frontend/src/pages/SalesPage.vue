<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <h4 class="text-h4 q-my-none">Ventas</h4>
      </div>
      <div>
        <q-btn outline color="primary" icon="add" label="Registrar Venta" @click="showDialog = true" />
        <q-btn outline color="primary" icon="refresh" label="Actualizar" @click="fetchSales" class="q-ml-sm" />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <h6 class="text-h6">Listado de Ventas</h6>
        <q-table
          :rows="sales"
          :columns="columns"
          row-key="_id"
          :loading="loading"
        >
          <template v-slot:body-cell-products="props">
            <q-td :props="props">
              <ul>
                <li v-for="p in props.row.products" :key="p.product._id">
                  {{ p.product.name }} x {{ p.quantity }}
                </li>
              </ul>
            </q-td>
          </template>
          <template v-slot:body-cell-total="props">
            <q-td :props="props">
              {{ formatPrice(props.row.total) }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showDialog">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Registrar nueva venta</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
            <q-select
              v-model="selectedProducts"
              :options="productOptions"
              label="Productos"
              multiple
              emit-value
              map-options
              option-value="_id"
              option-label="name"
              use-chips
              :disable="loadingProducts"
              @update:model-value="updateQuantities"
            />
            <div v-for="item in selectedProducts" :key="item">
              <q-input
                v-model.number="quantities[item]"
                type="number"
                min="1"
                :label="`Cantidad para ${getProductName(item)}`"
                :disable="loadingProducts"
                class="q-mb-sm"
              />
            </div>
            <q-input v-model="notes" label="Observaciones" type="textarea" class="q-mb-sm" />
            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn label="Cancelar" color="negative" flat @click="showDialog = false" :disable="loading" />
              <q-btn type="submit" label="Registrar Venta" color="primary" :loading="loading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSales } from 'src/composables/useSales';
import { useProducts } from 'src/composables/useProducts';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const { sales, loading, error, fetchSales, createSale } = useSales();
const { products, fetchProducts, loading: loadingProducts } = useProducts();

const showDialog = ref(false);
const selectedProducts = ref([]);
const quantities = ref({});
const notes = ref('');

const productOptions = ref([]);

const columns = [
  { name: 'date', label: 'Fecha', field: 'date', align: 'left', format: val => formatDate(val) },
  { name: 'products', label: 'Productos', field: 'products', align: 'left' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'notes', label: 'Observaciones', field: 'notes', align: 'left' }
];

onMounted(async () => {
  await fetchProducts();
  productOptions.value = products.value.map(p => ({ ...p }));
  fetchSales();
});

function updateQuantities() {
  // Inicializa cantidades en 1 si no existe
  selectedProducts.value.forEach(id => {
    if (!quantities.value[id]) quantities.value[id] = 1;
  });
}

function getProductName(id) {
  const prod = products.value.find(p => p._id === id);
  return prod ? prod.name : '';
}

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(value);
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('es-AR', options);
}

async function handleSubmit() {
  try {
    const payload = {
      products: selectedProducts.value.map(id => ({ product: id, quantity: quantities.value[id] })),
      notes: notes.value
    };
    await createSale(payload);
    $q.notify({ type: 'positive', message: 'Venta registrada correctamente' });
    selectedProducts.value = [];
    quantities.value = {};
    notes.value = '';
    showDialog.value = false;
    fetchSales();
  } catch (e) {
    // Mejorar manejo de errores para mostrar mensaje de stock insuficiente si existe
    let msg = error.value || e.message;
    if (e.response && e.response.data && e.response.data.message) {
      msg = e.response.data.message;
    }
    $q.notify({ type: 'negative', message: msg });
  }
}
</script>

<style scoped lang="scss">
.q-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.q-btn {
  border-radius: 8px;
  font-weight: 600;
}
.q-table {
  th, td {
    font-size: 0.98rem;
    padding: 8px 4px;
  }
}
</style>
