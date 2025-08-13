// backend/src/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Conexión a la DB
connectDB();

// Rutas de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionandooo 🚀' });
});

// Escuchar puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
