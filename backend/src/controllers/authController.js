import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Crear token
        const token = user.getSignedJwtToken();

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener usuario autenticado
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cerrar sesión / Limpiar cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = (req, res) => {
    try {
      // Opcional: Aquí podrías invalidar el token si estás usando una lista negra
      // Por ahora, simplemente devolvemos éxito
      res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión'
      });
    }
  };