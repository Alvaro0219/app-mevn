import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuth } from 'src/composables/useAuth'

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Navigation guard
  Router.beforeEach((to, from, next) => {
    const { isAuthenticated, user } = useAuth()
    
    // If route requires auth and user is not authenticated
    if (to.meta.requiresAuth && !isAuthenticated()) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // If user is authenticated but tries to access login page
    if (to.name === 'login' && isAuthenticated()) {
      return next({ name: 'inicio' })
    }

    // Check roles if route requires specific roles
    if (to.meta.roles) {
      const userRole = user.value?.role
      if (!userRole || !to.meta.roles.includes(userRole)) {
        return next({ name: 'inicio' })
      }
    }

    next()
  })

  return Router
})