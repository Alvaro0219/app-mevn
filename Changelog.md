# Changelog y guía de comunicación (MEVN + Quasar)

Este documento explica de forma sencilla cómo funcionan y se relacionan los archivos que vamos modificando. Sirve como guía rápida del stack.

## 2025-09-02 — Integración de Cloudinary para Gestión de Imágenes

### Backend

- **`backend/src/config/cloudinary.js`** (nuevo)
  - Configuración del cliente de Cloudinary con credenciales seguras.
  - Uso de variables de entorno para almacenar credenciales sensibles.

- **`backend/src/config/cloudinaryStorage.js`** (nuevo)
  - Configuración de almacenamiento en Cloudinary usando multer-storage-cloudinary.
  - Definición de carpeta 'productos' para organizar las imágenes.
  - Transformaciones automáticas de imágenes (redimensionamiento a 800x800px).
  - Validación de formatos de imagen permitidos (jpg, jpeg, png, webp).

- **`backend/src/config/multerConfig.js`** (actualizado)
  - Integración con Cloudinary Storage.
  - Límite de tamaño de archivo configurado a 5MB.
  - Filtro para aceptar solo archivos de imagen.

- **`backend/src/controllers/productController.js`** (actualizado)
  - Manejo de URLs de Cloudinary para las imágenes de productos.
  - Eliminación de imágenes antiguas al actualizar o eliminar productos.
  - Validación de carga de imágenes requerida.

### Frontend

- **`frontend/src/pages/ProductosPage.vue`** (actualizado)
  - Vista previa de imágenes antes de subirlas.
  - Manejo de carga de archivos con FormData.
  - Mejoras en la experiencia de usuario con notificaciones.
  - Visualización de imágenes existentes en modo edición.

## 2025-08-29 — Implementación del Módulo de Productos

### Backend

- **`backend/src/models/Product.js`** (nuevo)
  - Esquema de Mongoose para productos con campos: name, description, price, stock, category, image, active.
  - Índice de texto para búsquedas en name y description.
  - Validaciones de campos y tipos de datos.

- **`backend/src/controllers/productController.js`** (nuevo)
  - Controlador completo con operaciones CRUD para productos.
  - Búsqueda paginada de productos con filtros.
  - Búsqueda por texto en nombre y descripción.
  - Manejo de imágenes con Multer.
  - Soft delete para productos.

- **`backend/src/routes/productRoutes.js`** (nuevo)
  - Rutas públicas para listar y buscar productos.
  - Rutas protegidas para administradores (crear, actualizar, eliminar).
  - Integración de middleware de autenticación y subida de archivos.

- **`backend/src/config/multerConfig.js`** (nuevo)
  - Configuración de Multer para subida de imágenes.
  - Validación de tipos de archivo (solo imágenes).
  - Límite de tamaño de archivo (5MB).
  - Generación de nombres de archivo únicos.

## 2025-08-21 — Implementación de Cierre de Sesión

### Frontend

- **`frontend/src/composables/useAuth.js`**
  - Nueva función `logout()`: Maneja el cierre de sesión tanto en el frontend como en el backend.
  - Mejora: Manejo robusto de errores y limpieza de estado local.
  - Mejora: Envío automático del token en el header de autorización.

- **`frontend/src/layouts/MainLayout.vue`**
  - Implementación de botón de cierre de sesión en la barra superior.
  - Visualización del nombre de usuario actual.
  - Manejo de notificaciones para feedback al usuario.

### Backend

- **`backend/src/controllers/authController.js`**
  - Nuevo controlador `logout` para manejar el cierre de sesión.
  - Respuestas estandarizadas para el cliente.

- **`backend/src/routes/authRoutes.js`**
  - Nueva ruta POST `/auth/logout` para el cierre de sesión.

## 2025-08-20 — Implementación de Autenticación JWT

### Backend

- **`backend/src/models/User.js`**
  - Mejora: Se agregaron validaciones de campos (email, username, password).
  - Nuevo: Se implementó encriptación de contraseñas con bcrypt.
  - Nuevo: Se agregaron métodos para generar JWT y comparar contraseñas.
  - Cambio: Se actualizó el esquema con campos adicionales para autenticación.

- **`backend/src/middleware/auth.js`** (nuevo)
  - Nuevo: Middleware `protect` para verificar tokens JWT.
  - Nuevo: Middleware `authorize` para control de acceso por roles.
  - Manejo de errores para rutas protegidas.

- **`backend/src/controllers/authController.js`** (nuevo)
  - Nuevo: Controlador con métodos para login, perfil y logout.
  - Implementación de generación de tokens JWT.
  - Validación de credenciales y manejo de sesiones.

- **`backend/src/routes/authRoutes.js`** (nuevo)
  - Nuevo: Rutas para autenticación (`/auth/login`, `/auth/me`, `/auth/logout`).
  - Protección de rutas con middleware JWT.

- **`backend/src/utils/errorResponse.js`** (nuevo)
  - Nuevo: Clase personalizada para manejar respuestas de error consistentes.

- **`backend/src/server.js`**
  - Cambio: Se integraron las rutas de autenticación.
  - Configuración de manejo de cookies para JWT.

### Frontend

- **`frontend/src/pages/auth/Login.vue`** (nuevo)
  - Nuevo: Formulario de inicio de sesión.
  - Integración con el backend para autenticación.
  - Almacenamiento seguro del token JWT.

- **`frontend/src/router/index.js`**
  - Cambio: Se agregaron rutas protegidas.
  - Implementación de navegación guardada para autenticación.

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
