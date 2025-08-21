# Documentación: Backend (Node/Express) + MongoDB Atlas + Frontend (Vue 3 + Quasar)

## Estructura general
- **`backend/`**: API REST con Express y conexión a MongoDB vía Mongoose.
- **`frontend/`**: SPA con Vue 3 + Quasar (Vite) que consume la API.

## Backend (`backend/`)
- **Punto de entrada**: `backend/src/server.js`
  - Middlewares: `cors`, `express.json()`, `morgan('dev')`.
  - Carga `.env` con `dotenv`.
  - Conecta a la base de datos: `connectDB()` desde `backend/src/config/db.js`.
  - Ruta de prueba: `GET /` -> responde `{ message: 'API funcionandooo 🚀' }`.
  - Puerto: `process.env.PORT || 5000`.
- **Conexión a DB**: `backend/src/config/db.js`
  - `mongoose.connect(process.env.MONGO_URI)`.
  - Sale del proceso si falla la conexión.
- **Variables de entorno**: `backend/.env`
  - `PORT=5000`
  - `MONGO_URI=<cadena de conexión de Atlas>`
- **Scripts**: `backend/package.json`
  - `npm run dev` -> `nodemon src/server.js` (recarga en caliente).

Actualmente el backend se inicia, conecta a Atlas y expone la ruta raíz de prueba. Las carpetas `controllers/`, `models/`, `routes/`, `middlewares/` están listas para crecer.

## Base de datos: MongoDB Atlas
- **Conexión**: via `MONGO_URI` (cadena de conexión del clúster Atlas) en `backend/.env`.
- **Cuándo se conecta**: al iniciar el servidor (antes de atender peticiones).
- **Uso**: Hoy no hay modelos/rutas que consulten la DB; la conexión está preparada para cuando agregues `models` y `controllers`.
- **Seguridad**:
  - No subir `.env` (contiene credenciales) al repositorio público.
  - Restringir IPs permitidas en Atlas o usar VPC/peering cuando aplique.

## Frontend (`frontend/`)
- **Stack**: Vue 3 + Quasar CLI (Vite), Router v4, Pinia (lista para usar).
- **Entrada**: `frontend/src/App.vue` -> renderiza `<router-view />`.
- **Layout y páginas**:
  - `frontend/src/layouts/MainLayout.vue`: layout principal (header/drawer).
  - `frontend/src/pages/IndexPage.vue`: página inicial; muestra el mensaje del backend.
- **Ruteo**:
  - `frontend/src/router/routes.js`: `/` -> `MainLayout.vue` -> `IndexPage.vue`; 404 por catch-all.
  - `frontend/src/router/index.js`: crea el router (modo `hash` por `quasar.config.js`).
- **Consumo de API**:
  - `frontend/src/boot/axios.js`: crea instancia `api` de Axios con `baseURL = process.env.API_URL || 'http://localhost:5000'` y la expone como `this.$api`.
  - `frontend/src/services/api.js`: `testConnection()` hace `GET '/'` contra `baseURL`.
  - `frontend/src/pages/IndexPage.vue`: en `onMounted`, llama `testConnection()` y muestra `res.data.message`.
- **Variables de entorno**: `frontend/.env`
  - `API_URL=http://localhost:5000`
  - Nota: En Vite, las variables expuestas al cliente suelen llevar prefijo `VITE_` (p.ej. `VITE_API_URL`) o definirse en `quasar.config.js > build.env`. Si `process.env.API_URL` no se inyecta, se usa el fallback a `http://localhost:5000`.

## Flujo de comunicación (end-to-end)
1. Inicias backend (Express) -> se conecta a MongoDB Atlas usando `MONGO_URI`.
2. Inicias frontend (Quasar) -> registra boot `axios` con `baseURL` del backend.
3. `IndexPage.vue` ejecuta `testConnection()` -> `GET /` a `http://localhost:5000/`.
4. `backend/src/server.js` responde `{ message: 'API funcionandooo 🚀' }`.
5. El frontend muestra el mensaje en la UI.

La conexión con Atlas se establece al arrancar el backend; aunque la ruta `/` no consulta DB, los futuros endpoints usarán `models` Mongoose para CRUD.

## Cómo ejecutar localmente
- **Backend**
  - Crear `backend/.env` con `PORT` y `MONGO_URI`.
  - Comandos:
    - `cd backend`
    - `npm install`
    - `npm run dev`
  - API en: `http://localhost:5000` (o el puerto configurado).
- **Frontend**
  - Opcional: `frontend/.env` con `API_URL` (o preferible `VITE_API_URL`).
  - Comandos:
    - `cd frontend`
    - `npm install`
    - `quasar dev`
  - App en: URL que abre Quasar (por defecto `http://localhost:9000`).

## Flujo de Autenticación

### Backend
- **Rutas de autenticación**: `backend/src/routes/authRoutes.js`
  - `POST /auth/register`: Registro de nuevos usuarios
  - `POST /auth/login`: Inicio de sesión (devuelve JWT)
  - `POST /auth/logout`: Cierre de sesión
  - `GET /auth/me`: Obtener información del usuario actual

- **Seguridad**:
  - Uso de JWT (JSON Web Tokens) para autenticación
  - Middleware de autenticación en `backend/src/middleware/auth.js`
  - Protección de rutas con `protect` middleware

### Frontend
- **Manejo de autenticación**: `frontend/src/composables/useAuth.js`
  - Estado global de autenticación
  - Funciones `login()`, `logout()`, `isAuthenticated()`, etc.
  - Persistencia de sesión mediante `localStorage`

- **Páginas de autenticación**:
  - `LoginPage.vue`: Formulario de inicio de sesión
  - `RegisterPage.vue`: Formulario de registro
  - `MainLayout.vue`: Muestra el estado de autenticación y botón de cierre de sesión

- **Protección de rutas**:
  - Middleware de navegación en `frontend/src/router/index.js`
  - Rutas protegidas con `meta: { requiresAuth: true }`
  - Redirección a login si no autenticado

### Flujo de Inicio de Sesión
1. Usuario ingresa credenciales en `LoginPage.vue`
2. Se llama a `login(credentials)` de `useAuth.js`
3. Si es exitoso, se guarda el token JWT y los datos del usuario
4. El token se envía en el header `Authorization` de todas las peticiones
5. El usuario es redirigido a la ruta protegida

### Flujo de Cierre de Sesión
1. Usuario hace clic en "Cerrar Sesión" en `MainLayout.vue`
2. Se llama a `logout()` de `useAuth.js`
3. Se limpia el estado de autenticación
4. Se elimina el token del almacenamiento local
5. Se redirige al usuario a la página de login
