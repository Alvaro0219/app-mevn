<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Barra superior -->
    <q-header elevated class="header--brand" dark>
      <q-toolbar>
        <!-- Botón menú -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          SISTEMA DE GESTION
        </q-toolbar-title>

        <!-- Info derecha -->
        <q-space />
        <div class="user-chip"><q-icon name="person" size="18px" /> <span>Admin</span></div>
      </q-toolbar>
    </q-header>

    <!-- Menú lateral -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="drawer--glass" dark>
      <q-list>
        <q-item-label header> Menú de Navegación </q-item-label>

        <q-item
          v-for="link in linksList"
          :key="link.title"
          clickable
          :to="link.to"
          :active="isActive(link.to)"
          active-class="nav-active"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption class="caption-custom">{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Contenido de páginas -->
    <q-page-container class="content-area">
      <transition name="fade-slide" mode="out-in">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const leftDrawerOpen = ref(false)
const route = useRoute()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function isActive(to) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

const linksList = [
  { title: 'Inicio', caption: 'Página principal', icon: 'home', to: '/inicio' },
  { title: 'Productos', caption: 'Gestión de productos', icon: 'shopping_bag', to: '/productos' },
  { title: 'Usuarios', caption: 'Gestión de usuarios', icon: 'group', to: '/usuarios' },
  { title: 'Reportes', caption: 'Ver reportes', icon: 'bar_chart', to: '/reportes' },
  { title: 'Configuración', caption: 'Ajustes del sistema', icon: 'settings', to: '/config' },
]
</script>

<style scoped lang="scss">
.header--brand {
  background: linear-gradient(135deg, #6c5ce7 0%, #00c2ff 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

.drawer--glass {
  background: rgba(17, 25, 40, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #e2e8f0;
}

.nav-active {
  background: rgba(255, 255, 255, 0.12) !important;
  border-radius: 10px;
}

.q-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
}

.caption-custom {
  color: #ffffff;
  font-style: italic;
}

/* Contenido general de páginas */
.content-area {
  /* Fondo sutil con acentos de marca */
  background:
    radial-gradient(1200px 600px at -10% -10%, rgba(108, 92, 231, 0.122), transparent 60%),
    radial-gradient(1000px 500px at 110% 110%, rgba(0, 194, 255, 0.10), transparent 55%);
  min-height: 100%;
  padding: 12px 0;
}

/* Ajuste de ancho y espaciado base para todas las páginas renderizadas */
:deep(.q-page) {
  max-width: 1200px;
  margin: 0 auto;
}

/* Tipografía y ritmo vertical por defecto */
:deep(.q-page h1) {
  font-weight: 700;
  letter-spacing: 0.3px;
  margin: 4px 0 16px;
}

/* Transición entre páginas */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
