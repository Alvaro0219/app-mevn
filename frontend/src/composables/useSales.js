import { ref } from 'vue';
import { api } from 'boot/axios';

export function useSales() {
  const sales = ref([]);
  const sale = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchSales = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get('/api/sales');
      sales.value = data;
    } catch (e) {
      error.value = e.message || 'Error al obtener ventas';
    } finally {
      loading.value = false;
    }
  };

  const fetchSaleById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get(`/api/sales/${id}`);
      sale.value = data;
    } catch (e) {
      error.value = e.message || 'Error al obtener venta';
    } finally {
      loading.value = false;
    }
  };

  const createSale = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.post('/api/sales', payload);
      return data;
    } catch (e) {
      error.value = e.message || 'Error al registrar venta';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return { sales, sale, loading, error, fetchSales, fetchSaleById, createSale };
}
