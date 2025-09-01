<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row q-mb-md items-center">
        <div class="col">
          <h4 class="text-h4 q-my-none">Gestión de Productos</h4>
        </div>
        <div class="col-auto">
          <q-btn 
            outline 
            color="primary"
            no-caps
            icon="add" 
            label="Nuevo Producto" 
            @click="showDialog = true"
          />
        </div>
      </div>

      <!-- Tabla de productos -->
      <q-table
        :rows="products"
        :columns="columns"
        row-key="_id"
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
        :rows-per-page-options="[5, 10, 15, 20]"
      >
        <!-- Columna de acciones -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
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
    </div>

    <!-- Diálogo para crear/editar producto -->
    <q-dialog v-model="showDialog">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">{{ editingProduct ? 'Editar' : 'Nuevo' }} Producto</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveProduct" class="q-gutter-md">
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
            
            <q-file
              v-model="formData.image"
              label="Imagen"
              accept=".jpg, .jpeg, .png, image/*"
              :rules="[val => editingProduct || val || 'La imagen es requerida']"
              outlined
              dense
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            
            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn 
                label="Cancelar" 
                color="negative" 
                flat 
                @click="showDialog = false"
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

    <!-- Diálogo de confirmación de eliminación -->
    <q-dialog v-model="showDeleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">¿Estás seguro de que deseas eliminar este producto?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn 
            flat 
            label="Eliminar" 
            color="negative" 
            @click="deleteProduct" 
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useProducts } from 'src/composables/useProducts';

export default {
  name: 'ProductosPage',
  
  setup() {
    const $q = useQuasar();
    const { 
      products, 
      loading, 
      error, 
      fetchProducts, 
      createProduct, 
      updateProduct, 
      deleteProduct: deleteProductApi 
    } = useProducts();

    const showDialog = ref(false);
    const showDeleteDialog = ref(false);
    const editingProduct = ref(null);
    const productToDelete = ref(null);

    const formData = ref({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      image: null
    });

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
      } catch {
        $q.notify({
          type: 'negative',
          message: error.value || 'Error al cargar los productos',
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

    const resetForm = () => {
      formData.value = {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        image: null
      };
      editingProduct.value = null;
    };

    const editProduct = (product) => {
      editingProduct.value = product._id;
      formData.value = { ...product };
      showDialog.value = true;
    };

    const saveProduct = async () => {
      try {
        const formDataToSend = new FormData();
        
        // Agregar campos al formData
        Object.entries(formData.value).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formDataToSend.append(key, value);
          }
        });

        if (editingProduct.value) {
          await updateProduct(editingProduct.value, formDataToSend);
          $q.notify({
            type: 'positive',
            message: 'Producto actualizado correctamente',
            position: 'top'
          });
        } else {
          await createProduct(formDataToSend);
          $q.notify({
            type: 'positive',
            message: 'Producto creado correctamente',
            position: 'top'
          });
        }

        showDialog.value = false;
        resetForm();
        loadProducts();
      } catch {
        $q.notify({
          type: 'negative',
          message: error.value || 'Error al guardar el producto',
          position: 'top'
        });
      }
    };

    const confirmDelete = (product) => {
      productToDelete.value = product._id;
      showDeleteDialog.value = true;
    };

    const deleteProduct = async () => {
      try {
        await deleteProductApi(productToDelete.value);
        $q.notify({
          type: 'positive',
          message: 'Producto eliminado correctamente',
          position: 'top'
        });
        showDeleteDialog.value = false;
        loadProducts();
      } catch {
        $q.notify({
          type: 'negative',
          message: error.value || 'Error al eliminar el producto',
          position: 'top'
        });
      }
    };

    // Cargar los productos al montar el componente
    onMounted(() => {
      loadProducts();
    });

    return {
      // State
      products,
      loading,
      formData,
      showDialog,
      showDeleteDialog,
      editingProduct,
      columns,
      pagination,
      
      // Methods
      onRequest,
      editProduct,
      saveProduct,
      confirmDelete,
      deleteProduct
    };
  }
};
</script>

<style scoped>
.q-table__title {
  font-size: 1.5rem;
  font-weight: 500;
}
</style>