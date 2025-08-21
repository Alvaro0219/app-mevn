import MainLayout from 'layouts/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/auth/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { 
        path: 'inicio', 
        name: 'inicio',
        component: () => import('pages/IndexPage.vue')
      },
      { 
        path: 'usuarios', 
        name: 'usuarios', 
        component: () => import('pages/UsersPage.vue'),
        meta: { roles: ['admin'] }
      },
      { 
        path: 'usuarios/registrar', 
        name: 'usuarios-registrar', 
        component: () => import('pages/auth/RegisterUsers.vue'),
        meta: { roles: ['admin'] }
      },
      { 
        path: 'usuarios/editar/:id', 
        name: 'usuarios-editar', 
        component: () => import('pages/auth/EditUser.vue'),
        meta: { roles: ['admin'] }
      },
      { 
        path: 'productos', 
        name: 'productos',
        component: () => import('pages/ProductosPage.vue')
      },
      { 
        path: 'reportes', 
        name: 'reportes',
        component: () => import('pages/ReportesPage.vue')
      },
      { 
        path: 'config', 
        name: 'config',
        component: () => import('pages/ConfigPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes