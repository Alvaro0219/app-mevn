backend/
├── src/
│   ├── config/
│   │   └── db.js           # Configuración y conexión a MongoDB
│   ├── controllers/
│   │   └── ...             # Lógica que recibe solicitudes y responde (controladores)
│   ├── models/
│   │   └── ...             # Modelos Mongoose (definición de esquemas para colecciones)
│   ├── routes/
│   │   └── ...             # Definición de rutas/endpoints REST
│   ├── server.js           # Archivo principal que arranca el servidor Express
│   └── ...                 # Otros archivos según estructura
├── .env                    # Variables de entorno (conexión DB, puerto, etc.)
├── package.json            # Dependencias y scripts npm
└── nodemon.json (opcional) # Configuración de nodemon para reinicios automáticos

# Que hace cada cosa en el backend
1. server.js -> Punto de entrada. Configura Express, middlewares, conexión a la base de datos y define los endpoints. Arranca el servidor.
2. db.js -> Conecta a MongoDB usando Mongoose y la URI que está en .env
3. models/ -> Define los “modelos” o esquemas de tus datos (por ejemplo: Usuario, Producto). Son clases que representan las colecciones en MongoDB.
4. controllers/ -> Aquí va la lógica que maneja la solicitud, consulta/modifica la base y responde al cliente. Ejemplo: crear usuario, listar productos, eliminar etc.
5. routes/ -> Define las rutas HTTP (GET, POST, PUT, DELETE) y las asocia a funciones en los controladores.

frontend/
├── public/                # Archivos estáticos públicos (favicon, iconos)
├── src/
│   ├── assets/            # Imágenes, logos y archivos estáticos usados en la app
│   ├── boot/              # Archivos para inicializar plugins o librerías (ej. axios)
│   │   └── axios.js       # Configuración global de Axios para llamadas al backend
│   ├── components/        # Componentes Vue reutilizables (botones, cards, etc.)
│   ├── layouts/           # Layouts (estructuras de página que envuelven el contenido)
│   │   └── MainLayout.vue # Layout principal, contiene header, footer, sidebar
│   ├── pages/             # Páginas completas que se muestran según la ruta
│   │   └── IndexPage.vue  # Página principal
│   ├── router/            # Configuración de rutas de Vue Router
│   │   ├── index.js       # Crea el router y lo exporta
│   │   └── routes.js      # Definición de rutas URL → componentes
│   ├── stores/            # Estado global manejado con Pinia
│   ├── services/          # Funciones para consumir API (backend) con Axios
│   │   └── api.js         # Servicios para hacer llamadas a backend
│   ├── css/               # Archivos SCSS y variables para estilos
│   ├── App.vue            # Componente raíz que arranca la app Vue
│   ├── quasar.config.js   # Configuración general de Quasar (plugins, temas)
│   └── main.js (o main.ts) # Entrada principal, carga app y router
├── package.json           # Dependencias y scripts npm
├── .env                   # Variables de entorno (ej. URL backend)
├── .eslintrc.js           # Configuración ESLint para linting de código
└── .prettierrc.json       # Configuración Prettier para formateo

# Que hace cada cosa en el frontend
1. src/components/ -> Componentes reutilizables (botones, cards, etc.)
2. src/pages/ -> Páginas completas que se muestran según la ruta
3. src/router/ -> Configuración de rutas de Vue Router
4. src/stores/ -> Estado global manejado con Pinia
5. src/services/ -> Funciones para consumir API (backend) con Axios
6. src/css/ -> Archivos SCSS y variables para estilos
7. src/App.vue -> Componente raíz que arranca la app Vue
8. src/quasar.config.js -> Configuración general de Quasar (plugins, temas)
9. src/main.js (o main.ts) -> Entrada principal, carga app y router
10. src/layouts -> Plantillas de página que definen estructura fija (header, menú lateral, footer). Las páginas se “insertan” dentro del layout.

# FLUJO DE TRABAJO FRONT-BACK
Usuario abre frontend (http://localhost:8080)
          ↓
IndexPage.vue (onMounted) → llama a testConnection() (Axios GET a backend)
          ↓
Backend recibe GET '/' → responde JSON { message: 'Hola desde el backend MEVN!' }
          ↓
Frontend recibe la respuesta → actualiza variable mensaje → muestra el texto en pantalla