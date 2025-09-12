import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Conexión a la DB
await connectDB();

// Rutas de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionandooo 🚀' });
});

// Rutas de usuarios
app.use('/users', userRoutes);

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de productos
app.use('/products', productRoutes);

// Rutas de ventas
app.use('/api/sales', saleRoutes);

// Ruta dashboard
app.use('/api/dashboard', dashboardRoutes);

// Escuchar puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
