import MainLayout from 'layouts/MainLayout.vue'
import IndexPage from 'pages/IndexPage.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: 'inicio', component: IndexPage },
      { path: 'productos', component: () => import('pages/ProductosPage.vue') },
      { path: 'usuarios', name: 'usuarios', component: () => import('src/pages/UsersPage.vue') },
      { path: 'usuarios/registrar', component: () => import('pages/auth/RegisterUsers.vue') },
      { path: 'reportes', component: () => import('pages/ReportesPage.vue') },
      { path: 'config', component: () => import('pages/ConfigPage.vue') },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes