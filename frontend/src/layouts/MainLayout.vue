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
          SISTEMA DE GESTIÓN
        </q-toolbar-title>

        <!-- Botón de usuario y logout -->
        <q-space />
        <div class="row items-center q-gutter-sm">
          <span>{{ user?.username || 'Usuario' }}</span>
          <q-btn
            flat
            round
            dense
            icon="logout"
            @click="handleLogout"
            title="Cerrar sesión"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Menú lateral -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="drawer--glass" dark>
      <q-list>
        <q-item-label 
          header 
          class="menu-header"
        >
          Nombre de la Empresa
          <div class="menu-subheader">
            Menú de Navegación
          </div>
        </q-item-label>

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
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuth } from 'src/composables/useAuth'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleLogout = async () => {
  try {
    await logout();
    $q.notify({
      type: 'positive',
      message: 'Sesión cerrada correctamente'
    });
    router.push('/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cerrar sesión'
    });
  }
};

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
.q-toolbar__title {
  font-size: 1.1rem;
  font-weight: 500;
}

/* Asegúrate de que el botón sea visible en el header */
.q-btn--round {
  font-size: 1.1rem;
}

.header--brand {
  background: linear-gradient(135deg, #6c5ce7 0%, #0f172a 100%);
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

/* Encabezado del menú lateral */
.menu-header {
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--q-secondary);
  letter-spacing: 1px;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.menu-subheader {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.8;
  margin-top: 0.25rem;
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
