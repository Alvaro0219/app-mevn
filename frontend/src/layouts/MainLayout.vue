<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Barra superior moderna -->
    <q-header elevated class="header--modern" dark>
      <q-toolbar class="q-px-lg">
        <!-- Botón menú con animación -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="menu-toggle"
          size="md"
        />

        <q-toolbar-title class="row items-center no-wrap">
          <div class="brand-container">
            <div class="brand-text">
              <div class="brand-title">{{ pageTitle }}</div>
            </div>
          </div>
        </q-toolbar-title>

        <q-space />
      </q-toolbar>
    </q-header>

    <!-- Menú lateral moderno -->
    <q-drawer 
      v-model="leftDrawerOpen" 
      show-if-above 
      bordered 
      class="drawer--modern"
      :width="280"
    >
      <!-- Header del drawer -->
      <div class="drawer-header">
        <div class="logo-section">
          <div class="logo-container">
            <q-icon name="event_available" size="36px" class="logo-icon" />
          </div>
          <div class="logo-text">
            <div class="logo-title">Sistema de Gestión</div>
            <div class="logo-caption">Panel de Control</div>
          </div>
        </div>
      </div>

      <!-- Navegación principal -->
      <q-scroll-area class="drawer-content">
        <div class="q-pa-md">
          <!-- Sección principal -->
          <div class="nav-section">
            <div class="section-label">Principal</div>
            <q-list class="nav-list">
              <q-item
                clickable
                :to="'/inicio'"
                :active="isActive('/inicio')"
                class="nav-item"
                active-class="nav-item--active"
              >
                <q-item-section avatar>
                  <q-icon name="dashboard" class="nav-icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="nav-label">Inicio</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                :to="'/productos'"
                :active="isActive('/productos')"
                class="nav-item"
                active-class="nav-item--active"
              >
                <q-item-section avatar>
                  <q-icon name="store" class="nav-icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="nav-label">Productos</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Sección de administración -->
          <div class="nav-section">
            <div class="section-label">Administración</div>
            <q-list class="nav-list">
              <q-item
                clickable
                :to="'/usuarios'"
                :active="isActive('/usuarios')"
                class="nav-item"
                active-class="nav-item--active"
              >
                <q-item-section avatar>
                  <q-icon name="group" class="nav-icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="nav-label">Usuarios</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                :to="'/reportes'"
                :active="isActive('/reportes')"
                class="nav-item"
                active-class="nav-item--active"
              >
                <q-item-section avatar>
                  <q-icon name="analytics" class="nav-icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="nav-label">Reportes</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                :to="'/config'"
                :active="isActive('/config')"
                class="nav-item"
                active-class="nav-item--active"
              >
                <q-item-section avatar>
                  <q-icon name="settings" class="nav-icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="nav-label">Configuración</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-scroll-area>
      
      <!-- Footer del drawer con información del usuario -->
      <div class="drawer-footer">
        <div class="user-section">
          <q-avatar size="42px" class="user-avatar-large flex flex-center">
            <q-icon name="person" size="22px" style="margin: 0; padding: 0;" />
          </q-avatar>
          <div class="user-info">
            <div class="user-name">{{ user?.username || 'Administrador' }}</div>
            <div class="user-email">{{ user?.email || 'admin@reservas.com' }}</div>
          </div>
          <q-btn
            flat
            round
            dense
            color="negative"
            icon="logout"
            @click="handleLogout"
            class="logout-btn"
            size="sm"
          >
            <q-tooltip>Cerrar sesión</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-drawer>

    <!-- Contenido de páginas -->
    <q-page-container class="page-container">
      <transition name="page-transition" mode="out-in">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuth } from 'src/composables/useAuth'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()
const leftDrawerOpen = ref(false)

const pageTitle = computed(() => {
  const routeName = route.name
  const titles = {
    'inicio': 'Inicio',
    'usuarios': 'Usuarios',
    'usuarios-registrar': 'Registrar Usuario',
    'usuarios-editar': 'Editar Usuario',
    'productos': 'Productos',
    'reportes': 'Reportes',
    'config': 'Configuración'
  }
  return titles[routeName] || 'Sistema de Gestión'
})

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
</script>

<style scoped lang="scss">
// Variables de colores modernos - sin :root para evitar conflictos
$primary-color: #ff0000;
$secondary-color: #764ba2;
$text-primary: #2d3748;
$text-secondary: #718096;
$bg-light: #f8fafc;
$bg-lighter: #f1f5f9;
$border-color: #e2e8f0;

// Header moderno
.header--modern {
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-toggle {
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  color: #ffffff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.025em;
}

// Drawer moderno
.drawer--modern {
  background: linear-gradient(180deg, $bg-light 0%, $bg-lighter 100%);
  border-right: 1px solid $border-color;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.drawer-header {
  padding: 24px 20px 20px;
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-icon {
  color: #ffffff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logo-text {
  flex: 1;
}

.logo-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
  letter-spacing: 0.025em;
}

.logo-caption {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  margin-top: 2px;
}

.drawer-content {
  flex: 1;
  height: calc(100vh - 140px - 80px); // Ajustar según header y footer
}

.nav-section {
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 16px;
  }
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: $text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
  padding: 0 4px;
}

.nav-list {
  .nav-item {
    border-radius: 10px;
    margin-bottom: 4px;
    transition: all 0.2s ease;
    color: $text-primary;
    
    &:hover {
      background: rgba(102, 126, 234, 0.08);
      transform: translateX(4px);
    }
    
    &--active {
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      color: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transform: translateX(4px);
      
      .nav-icon {
        color: #ffffff;
      }
      
      .nav-label {
        color: #ffffff;
        font-weight: 600;
      }
      
      .active-indicator {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.nav-icon {
  color: $text-secondary;
  transition: all 0.2s ease;
}

.nav-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: $text-primary;
  transition: all 0.2s ease;
}

.active-indicator {
  opacity: 0.7;
}

// Footer del drawer
.drawer-footer {
  padding: 16px 20px;
  background: #ffffff;
  border-top: 1px solid $border-color;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-large {
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  color: #ffffff;
  border: 2px solid $border-color;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: $text-secondary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}

.logout-btn {
  transition: all 0.2s ease;
  color: #dc2626;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(220, 38, 38, 0.1);
    transform: scale(1.05);
  }
}

// Contenedor de páginas
.page-container {
  background: linear-gradient(135deg, $bg-light 0%, $bg-lighter 100%);
  min-height: 100vh;
}

// Transiciones de página
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(1.02);
}

// Responsive
@media (max-width: 600px) {
  .brand-title {
    font-size: 1rem;
  }
  
  .drawer--modern {
    width: 100% !important;
  }
  
  .user-email {
    display: none;
  }
}

// Animaciones y efectos
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.q-badge {
  animation: pulse 2s infinite;
}

// Mejoras de accesibilidad
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>