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

    <!-- Diálogo de manejo de imagenes -->
    <q-dialog v-model="showDialog">
    <q-card style="width: 500px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6">{{ editingProduct ? 'Editar' : 'Nuevo' }} Producto</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="saveProduct" class="q-gutter-md">
          <!-- ... existing form fields ... -->
          
          <!-- Image Upload Section -->
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
            
            <!-- Image Preview -->
            <div v-if="imagePreview" class="q-mt-sm">
              <q-img
                :src="imagePreview"
                style="max-width: 200px; max-height: 200px;"
                class="q-mt-sm"
              />
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
              @click="showDialog = false"
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
    const imagePreview = ref('');

    const formData = ref({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      image: null,
      imageUrl: ''
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
        
        // Add all form fields to FormData
        Object.keys(formData.value).forEach(key => {
          if (key !== 'imageUrl' && formData.value[key] !== null && formData.value[key] !== undefined) {
            formDataToSend.append(key, formData.value[key]);
          }
        });

        if (editingProduct.value) {
          // For update, include the old image ID if not changing the image
          if (!formData.value.image && formData.value.imageUrl) {
            formDataToSend.append('oldImageId', formData.value.imageUrl);
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
        
        showDialog.value = false;
        resetForm();
        fetchProducts();
      } catch (err) {
        $q.notify({
          color: 'negative',
          message: err.message || 'Error al guardar el producto',
          icon: 'report_problem'
        });
      }
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
        fetchProducts();
      } catch {
        $q.notify({
          color: 'negative',
          message: 'Error al eliminar el producto',
          icon: 'report_problem'
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
      imagePreview,
      columns,
      pagination,
      
      // Methods
      onRequest,
      editProduct,
      saveProduct,
      confirmDelete,
      deleteProduct,
      handleFileChange,
      resetForm
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