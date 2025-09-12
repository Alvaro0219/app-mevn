<template>
  <q-page padding>
    <h1 class="text-h4 q-mb-md">Dashboard</h1>
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-xs-12 col-sm-6 col-md-3" v-for="stat in stats" :key="stat.title">
        <q-card class="metric-card">
          <q-card-section class="row items-center">
            <q-icon :name="stat.icon" size="36px" :color="stat.color" class="q-mr-md" />
            <div>
              <div class="metric-title">{{ stat.title }}</div>
              <div class="metric-value">{{ stat.value }}</div>
              <div class="text-caption text-grey-6">{{ stat.description }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Ventas por Mes</div>
            <!-- Aquí iría un gráfico tipo bar/area con ventasData -->
            <div v-if="salesData.length">[Gráfico de ventas]</div>
            <div v-else class="text-caption">Sin datos de ventas</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Productos por Categoría</div>
            <!-- Aquí iría un gráfico tipo pie con categoryData -->
            <div v-if="categoryData.length">[Gráfico de categorías]</div>
            <div v-else class="text-caption">Sin datos de categorías</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md q-mt-lg">
      <div class="col-xs-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Pedidos Recientes</div>
            <q-table
              :rows="recentOrdersTable"
              :columns="recentOrderColumns"
              row-key="_id"
              dense
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Productos Más Vendidos</div>
            <q-table
              :rows="topProductsTable"
              :columns="topProductColumns"
              row-key="_id"
              dense
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {onMounted, computed } from 'vue'
import { useHome } from 'src/composables/useHome'

const {
  dashboardMetrics,
  fetchDashboardData
} = useHome()

const stats = computed(() => [
  {
    title: 'Total Usuarios',
    value: dashboardMetrics.value.totalUsers ?? 0,
    description: '',
    icon: 'people',
    color: 'primary'
  },
  {
    title: 'Productos Activos',
    value: dashboardMetrics.value.activeProducts ?? 0,
    description: '',
    icon: 'inventory',
    color: 'positive'
  },
  {
    title: 'Ventas del Mes',
    value: `$${dashboardMetrics.value.salesOfMonth ?? 0}`,
    description: '',
    icon: 'attach_money',
    color: 'accent'
  },
  {
    title: 'Reportes Generados',
    value: dashboardMetrics.value.reportsGenerated ?? 0,
    description: '',
    icon: 'bar_chart',
    color: 'warning'
  }
])

const salesData = computed(() => dashboardMetrics.value.salesByMonth ?? [])
const categoryData = computed(() => dashboardMetrics.value.productsByCategory ?? [])

// Adaptar pedidos recientes para mostrar productos y totales
const recentOrdersTable = computed(() => {
  return (dashboardMetrics.value.recentOrders ?? []).map(order => ({
    _id: order._id,
    products: order.products.map(p => `${p.product.name} (x${p.quantity})`).join(', '),
    total: order.total,
    notes: order.notes,
    date: new Date(order.date).toLocaleString()
  }))
})

const recentOrderColumns = [
  { name: 'products', label: 'Productos', field: 'products' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'notes', label: 'Notas', field: 'notes' },
  { name: 'date', label: 'Fecha', field: 'date' }
]

// Adaptar productos más vendidos para mostrar nombre y ventas
const topProductsTable = computed(() => {
  // Si tienes los productos en recentOrders, puedes hacer un lookup
  const allProducts = {};
  (dashboardMetrics.value.recentOrders ?? []).forEach(order => {
    order.products.forEach(p => {
      allProducts[p.product._id] = p.product.name;
    })
  })
  return (dashboardMetrics.value.topProducts ?? []).map(tp => ({
    _id: tp._id,
    name: allProducts[tp._id] || tp._id,
    sales: tp.sales,
    revenue: tp.revenue
  }))
})

const topProductColumns = [
  { name: 'name', label: 'Producto', field: 'name' },
  { name: 'sales', label: 'Ventas', field: 'sales', align: 'right' },
  { name: 'revenue', label: 'Ingresos', field: 'revenue', align: 'right' }
]

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.metric-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  color: #fff;
  min-height: 110px;
  background: linear-gradient(135deg, #1976d2 0%, #26a69a 100%);
}
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
</style>
