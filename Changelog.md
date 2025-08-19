# Changelog y guía de comunicación (MEVN + Quasar)

Este documento explica de forma sencilla cómo funcionan y se relacionan los archivos que vamos modificando. Sirve como guía rápida del stack.

## 2025-08-19 — Edición de usuarios y navegación unificada

### Frontend

- **`frontend/src/router/routes.js`**
  - Cambio: se agrega ruta de edición `usuarios/editar/:id` con nombre `usuarios-editar` y se mantiene `usuarios` y `usuarios-registrar` con nombres explícitos.
  - Orden: se reubicó `productos` luego de las rutas de usuarios (cambio no funcional, solo orden visual del archivo).

- **`frontend/src/pages/UsersPage.vue`**
  - Cambio: se agrega botón de edición (icono lápiz) en la columna Acciones.
  - Navegación: se unifica el acceso a rutas usando navegación declarativa con `QBtn :to` en lugar de `$router.push()`/`useRouter`.
  - Limpieza: se elimina `useRouter` y la función `goToEdit()` por quedar obsoletas.
  - Fix: en la eliminación, se evita sombrear el ref `error` usando `catch (e)` y notificación con `error.value || e.message`.

- **`frontend/src/pages/auth/EditUser.vue`** (nuevo)
  - Nuevo formulario para editar usuario por ID.
  - Carga: `fetchUserById(id)` en `onMounted` + `watch(user)` para poblar `form`.
  - Guardado: `updateUser(id, form)` con notificaciones y redirección a la lista (`name: 'usuarios'`).
  - Campos: `username`, `email`, `role`, `isActive`.

## 2025-08-12 — Navegación inicial, Home y configuración de API

### Frontend

- **`frontend/src/boot/axios.js`**
  - Cambio: `baseURL` ahora usa `import.meta.env.VITE_API_URL || 'http://localhost:5000'`.
  - Por qué: En Vite/Quasar, las variables de entorno expuestas al cliente deben tener prefijo `VITE_`. Así el frontend sabe a qué backend llamar.
  - Relación: Otros módulos consumen la instancia `api` (Axios) que exporta este boot.
  - Requisito: en `frontend/.env` define `VITE_API_URL=http://localhost:5000` (o la URL real del backend).

- **`frontend/src/layouts/MainLayout.vue`**
  - Cambio: Layout refinado (header + drawer) y menú de navegación propio.
  - Menú: lista `linksList` con rutas internas (`/`, `/productos`, `/usuarios`, `/reportes`, `/config`).
  - Activo: se usa `useRoute()` y `:active="isActive(link.to)"` para resaltar el ítem actual.
  - Relación: El layout contiene `<router-view />` que renderiza la página definida por el router dentro del contenedor.

- **`frontend/src/router/routes.js`**
  - Cambio: rutas hijas bajo `/` con carga perezosa (lazy) para páginas nuevas:
    - `productos` → `pages/ProductosPage.vue`
    - `usuarios` → `pages/UsuariosPage.vue`
    - `reportes` → `pages/ReportesPage.vue`
    - `config` → `pages/ConfigPage.vue`
  - Se restauró la ruta 404: `/:catchAll(.*)*` → `pages/ErrorNotFound.vue`.
  - Relación: El router decide qué página se renderiza en `<router-view />` del `MainLayout.vue`.

- **`frontend/src/pages/IndexPage.vue`** (Home)
  - Función: Página inicial que hace un ping al backend (`GET /`) usando `services/api.js`.
  - Relación: Usa `testConnection()` que internamente usa `api` (Axios) del boot.

- **`frontend/src/services/api.js`**
  - Función: expone `testConnection()` que llama a la raíz del backend.
  - Relación: Depende de la instancia `api` configurada en `boot/axios.js`.

### Backend (estado actual)

- **`backend/src/server.js`** y **`backend/src/config/db.js`**
  - Servidor Express con middlewares y conexión a MongoDB Atlas (`MONGO_URI`).
  - Ruta `GET /` devuelve `{ message: 'API funcionandooo 🚀' }`, usada por la Home.
  - Próximo: montar rutas REST para el módulo Usuarios: `app.use('/api/users', usersRoutes)`.
