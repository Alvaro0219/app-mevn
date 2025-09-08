<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row q-mb-md items-center">
        <div class="col">
          <h4 class="text-h4 q-my-none">Gestión de Productos</h4>
        </div>
        <div>
          <q-btn
            outline
            color="primary"
            no-caps
            icon="add"
            label="Nuevo Producto"
            @click="openCreateDialog"
          />
        </div>
      </div>

      <!-- Tarjetas de métricas -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-card class="metric-card gradient-primary">
            <q-card-section class="row items-center">
              <q-icon name="inventory" size="36px" color="white" class="q-mr-md" />
              <div>
                <div class="metric-title">Total de productos</div>
                <div class="metric-value">{{ products.length }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-card class="metric-card gradient-warning">
            <q-card-section class="row items-center">
              <q-icon name="warning" size="36px" color="white" class="q-mr-md" />
              <div>
                <div class="metric-title">Stock bajo</div>
                <div class="metric-value">{{ lowStockCount }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-card class="metric-card gradient-success">
            <q-card-section class="row items-center">
              <q-icon name="attach_money" size="36px" color="white" class="q-mr-md" />
              <div>
                <div class="metric-title">Valor total en inventario</div>
                <div class="metric-value">${{ totalInventoryValue }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card v-if="!isMobile">
        <q-table
          :rows="products"
          :columns="columns"
          row-key="_id"
          :loading="loading"
          v-model:pagination="pagination"
          @request="onRequest"
          :rows-per-page-options="[5, 10, 15, 20]"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                color="secondary"
                icon="visibility"
                @click="viewProduct(props.row._id)"
                class="q-mr-sm"
              />
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                @click="editProduct(props.row)"
                class="q-mr-sm"
              />
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                @click="confirmDelete(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card>

      <TableToCards v-else :rows="products" :columns="columns" rowKey="_id">
        <template #actions="{ row }">
          <q-btn
            flat
            round
            color="secondary"
            icon="visibility"
            @click="viewProduct(row._id)"
            class="q-mr-sm"
          />
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            @click="editProduct(row)"
            class="q-mr-sm"
          />
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            @click="confirmDelete(row)"
          />
        </template>
      </TableToCards>
    </div>

    <q-dialog v-model="showDialog">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">{{ editingProduct ? 'Editar' : 'Nuevo' }} Producto</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="saveProduct" class="q-gutter-md">
            <q-input
              v-model="formData.name"
              label="Nombre"
              :rules="[val => !!val || 'El nombre es requerido']"
              outlined
              dense
            />

            <q-input
              v-model="formData.description"
              label="Descripción"
              type="textarea"
              :rules="[val => !!val || 'La descripción es requerida']"
              outlined
              dense
            />

            <q-input
              v-model.number="formData.price"
              label="Precio"
              type="number"
              step="0.01"
              :rules="[val => val >= 0 || 'El precio debe ser mayor o igual a 0']"
              outlined
              dense
            />

            <q-input
              v-model.number="formData.stock"
              label="Stock"
              type="number"
              :rules="[val => val >= 0 || 'El stock debe ser mayor o igual a 0']"
              outlined
              dense
            />

            <q-select
              v-model="formData.category"
              :options="['Electrónica', 'Hogar', 'Ropa', 'Deportes', 'Otros']"
              label="Categoría"
              :rules="[val => !!val || 'La categoría es requerida']"
              outlined
              dense
            />

            <div>
              <q-file
                v-model="formData.image"
                label="Imagen del producto"
                accept="image/*"
                outlined
                dense
                @update:model-value="handleFileChange"
                :rules="[val => editingProduct ? true : val || 'La imagen es requerida']"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

              <div v-if="imagePreview" class="q-mt-sm">
                <q-img
                  :src="imagePreview"
                  style="max-width: 200px; max-height: 200px;"
                  class="q-mt-sm"
                />
                <div class="text-caption text-grey-7 q-mt-xs">
                  Nueva imagen
                </div>
              </div>

              <div v-else-if="editingProduct && formData.imageUrl" class="q-mt-sm">
                <q-img
                  :src="formData.imageUrl"
                  style="max-width: 200px; max-height: 200px;"
                  class="q-mt-sm"
                />
                <div class="text-caption text-grey-7 q-mt-xs">
                  Imagen actual
                </div>
              </div>
            </div>

            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn
                label="Cancelar"
                color="negative"
                flat
                @click="closeDialog"
                :disable="loading"
              />
              <q-btn
                type="submit"
                :label="editingProduct ? 'Actualizar' : 'Guardar'"
                color="primary"
                :loading="loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">¿Estás seguro de que deseas eliminar este producto?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="showDeleteDialog = false" />
          <q-btn flat label="Eliminar" color="negative" @click="deleteProduct" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useProducts } from 'src/composables/useProducts';
import { useRouter } from 'vue-router';
import TableToCards from 'src/components/TableToCards.vue';

export default {
  name: 'ProductosPage',
  components: { TableToCards },
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const {
      products,
      loading,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct: deleteProductApi
    } = useProducts();

    const showDialog = ref(false);
    const showDeleteDialog = ref(false);
    const editingProduct = ref(null);
    const productToDelete = ref(null);
    const imagePreview = ref('');
    const isMobile = ref(false);

    const formData = ref({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      image: null,
      imageUrl: ''
    });

    // Métrica: productos con stock bajo (por ejemplo, stock < 5)
    const lowStockCount = computed(() => {
      return products.value.filter(p => p.stock !== undefined && p.stock < 10).length;
    });

    // Métrica: valor total en inventario
    const totalInventoryValue = computed(() => {
      return products.value.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0).toFixed(2);
    });

    // Handle file selection
    const handleFileChange = (file) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.value = '';
      }
    };

    const columns = [
      { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
      { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
      { name: 'price', label: 'Precio', field: 'price', align: 'right', sortable: true },
      { name: 'stock', label: 'Stock', field: 'stock', align: 'center', sortable: true },
      { name: 'category', label: 'Categoría', field: 'category', align: 'left', sortable: true },
      { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
    ];

    const pagination = ref({
      sortBy: 'name',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    });

    const loadProducts = async () => {
      try {
        const { page, rowsPerPage, sortBy, descending } = pagination.value;
        const params = {
          page,
          limit: rowsPerPage,
          sort: descending ? `-${sortBy}` : sortBy
        };

        const data = await fetchProducts(params);
        pagination.value.rowsNumber = data.totalDocs;
      } catch (err) {
        $q.notify({
          type: 'negative',
          message: err.message || 'Error al cargar los productos',
          position: 'top'
        });
      }
    };

    const onRequest = (props) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;

      // Actualizar la paginación local
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;

      // Cargar los datos
      loadProducts();
    };

    // Reset form
    const resetForm = () => {
      formData.value = {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        image: null,
        imageUrl: ''
      };
      imagePreview.value = '';
      editingProduct.value = null;
    };

    // Cerrar diálogo y resetear form
    const closeDialog = () => {
      showDialog.value = false;
      resetForm();
    };

    const openCreateDialog = () => {
      resetForm();
      showDialog.value = true;
    };

    const editProduct = (product) => {
      editingProduct.value = product._id;
      formData.value = {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        image: null,
        imageUrl: product.image
      };
      imagePreview.value = '';
      showDialog.value = true;
    };

    const saveProduct = async () => {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData.value).forEach(key => {
          if (key !== 'imageUrl' && formData.value[key] !== null && formData.value[key] !== undefined) {
            formDataToSend.append(key, formData.value[key]);
          }
        });

        if (editingProduct.value) {
          // Si estamos editando y no se seleccionó una nueva imagen,
          // no enviamos el campo 'image' en el FormData para evitar errores en la API
          // y pasamos la URL de la imagen actual para que la API la mantenga
          if (!formData.value.image && formData.value.imageUrl) {
            formDataToSend.append('imageUrl', formData.value.imageUrl);
          }
          await updateProduct(editingProduct.value, formDataToSend);
          $q.notify({
            color: 'positive',
            message: 'Producto actualizado correctamente',
            icon: 'check_circle'
          });
        } else {
          await createProduct(formDataToSend);
          $q.notify({
            color: 'positive',
            message: 'Producto creado correctamente',
            icon: 'check_circle'
          });
        }

        closeDialog();
        loadProducts();
      } catch (err) {
        $q.notify({
          color: 'negative',
          message: err.message || 'Error al guardar el producto',
          icon: 'report_problem'
        });
      }
    };

    const viewProduct = (productId) => {
      router.push({ name: 'producto-detalle', params: { id: productId } });
    };

    const confirmDelete = (product) => {
      productToDelete.value = product;
      showDeleteDialog.value = true;
    };

    const deleteProduct = async () => {
      try {
        await deleteProductApi(productToDelete.value._id);
        $q.notify({
          color: 'positive',
          message: 'Producto eliminado correctamente',
          icon: 'check_circle'
        });
        showDeleteDialog.value = false;
        loadProducts();
      } catch (err) {
        $q.notify({
          color: 'negative',
          message: err.message || 'Error al eliminar el producto',
          icon: 'report_problem'
        });
      }
    };

    // Cargar los productos al montar el componente
    onMounted(() => {
      loadProducts();
      updateIsMobile();
      window.addEventListener('resize', updateIsMobile);
    });

    function updateIsMobile() {
      isMobile.value = window.innerWidth <= 600;
    }

    return {
      // State
      products,
      loading,
      formData,
      showDialog,
      showDeleteDialog,
      editingProduct,
      imagePreview,
      columns,
      pagination,
      lowStockCount,
      totalInventoryValue,
      isMobile,
      // Methods
      onRequest,
      openCreateDialog,
      editProduct,
      saveProduct,
      confirmDelete,
      deleteProduct,
      handleFileChange,
      closeDialog,
      viewProduct
    };
  }
};
</script>

<style scoped lang="scss">
.metric-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  color: #fff;
  min-height: 110px;
  .metric-title {
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.85;
    margin-bottom: 2px;
  }
  .metric-value {
    font-size: 2.1rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    margin-top: 2px;
  }
}
.gradient-primary {
  background: linear-gradient(135deg, $primary 0%, $secondary 100%);
}
.gradient-warning {
  background: linear-gradient(135deg, $warning 0%, $accent 100%);
}
.gradient-success {
  background: linear-gradient(135deg, $positive 0%, $primary 100%);
}

// Botones de acción
.q-btn {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
  &.q-mr-sm {
    margin-right: 0.5rem;
  }
  &[color="primary"] {
    background: linear-gradient(90deg, $primary 0%, $secondary 100%);
    color: #fff;
    border: none;
    &:hover {
      filter: brightness(1.1);
    }
  }
  &[color="secondary"] {
    background: $accent;
    color: #fff;
    border: none;
    &:hover {
      filter: brightness(1.1);
    }
  }
  &[color="negative"] {
    background: $destructive;
    color: #fff;
    border: none;
    &:hover {
      filter: brightness(1.1);
    }
  }
}
</style>