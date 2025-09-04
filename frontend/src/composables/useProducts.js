import { ref } from 'vue';
import { api } from 'boot/axios';

export function useProducts() {
    const products = ref([]);
    const product = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // Obtener todos los productos
    const fetchProducts = async (params = {}) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.get('/products', { params });
            products.value = res.data.docs || [];
            return res.data;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Obtener un producto por ID
    const fetchProductById = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.get(`/products/${id}`);
            product.value = res.data;
            return res.data;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Crear un nuevo producto
    const createProduct = async (formData) => {
        loading.value = true;
        error.value = null;
        try {
            // Si no es FormData, crear uno
            if (!(formData instanceof FormData)) {
                const newFormData = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        newFormData.append(key, value);
                    }
                });
                formData = newFormData;
            }

            const res = await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return res.data;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Actualizar un producto
    const updateProduct = async (id, formData) => {
        loading.value = true;
        error.value = null;
        try {
            // Si no es FormData, crear uno
            if (!(formData instanceof FormData)) {
                const newFormData = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        newFormData.append(key, value);
                    }
                });
                formData = newFormData;
            }

            const res = await api.put(`/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            return res.data;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Eliminar un producto (soft delete)
    const deleteProduct = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.delete(`/products/${id}`);
            return res.data;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        // State
        products,
        product,
        loading,
        error,
        
        // Methods
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct
    };
}

export default useProducts;