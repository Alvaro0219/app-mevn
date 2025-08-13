# Changelog y guía de comunicación (MEVN + Quasar)

Este documento explica de forma sencilla cómo funcionan y se relacionan los archivos que vamos modificando. Sirve como guía rápida del stack.

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

---

## Cómo se comunican las piezas (flujo)

1. **Router** (`routes.js`) decide qué página mostrar dentro del **Layout** (`MainLayout.vue`) mediante `<router-view />`.
2. Las **Páginas** (ej. `IndexPage.vue`, `UsuariosPage.vue`) llaman a **Servicios** (`services/*.js`).
3. Los **Servicios** usan la instancia **Axios** (`boot/axios.js` → `api`) que ya conoce la `VITE_API_URL` del backend.
4. El **Backend** responde a las rutas (ej. `GET /`, `GET /api/users`), y el Frontend muestra los datos.
5. Opcionalmente, un **Store Pinia** (`stores/*.js`) maneja estado y acciones compartidas entre componentes/páginas.

---

## Tareas siguientes sugeridas (frontend)

- Módulo Usuarios (inicial):
  - `frontend/src/services/usersService.js`: `getAll`, `create`, `update`, `remove` usando `api`.
  - `frontend/src/stores/users.js`: state (`list`, `loading`, `error`) y actions (`fetchUsers`, CRUD).
  - `frontend/src/pages/UsuariosPage.vue`: `QTable` para listar y un botón “Nuevo Usuario”.

## Tareas siguientes sugeridas (backend)

- `backend/src/models/User.js`: esquema Mongoose (name, email único, role, status, timestamps).
- `backend/src/controllers/users.controller.js`: `getAll`, `getById`, `create`, `update`, `remove`.
- `backend/src/routes/users.routes.js`: monta las rutas y exporta el router de Express.
- Montaje en `server.js`: `app.use('/api/users', usersRoutes)`.

---

## Tips del stack

- Variables de entorno en frontend: siempre con prefijo `VITE_` (acceso con `import.meta.env`).
- Navegación Quasar: `QItem` entiende `:to` (vue-router). Usa `:active` para resaltar el ítem actual.
- Lazy imports en rutas reducen el bundle inicial y cargan páginas bajo demanda.
- Mantén la 404 (catch-all) para una UX clara ante rutas desconocidas.