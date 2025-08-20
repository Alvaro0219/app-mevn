import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';

// Middleware para proteger rutas
export const protect = async (req, res, next) => {
    let token;

    // Verificar si el token está en el encabezado
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // O verificar si está en las cookies
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Asegurarse de que exista el token
    if (!token) {
        return next(new ErrorResponse('No estás autorizado para acceder a esta ruta', 401));
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Obtener usuario del token
        req.user = await User.findById(decoded.id);
        
        next();
    } catch (err) {
        return next(new ErrorResponse('No estás autorizado para acceder a esta ruta', 401));
    }
};

// Middleware para autorizar por roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(`El rol ${req.user.role} no está autorizado para acceder a esta ruta`, 403)
            );
        }
        next();
    };
};
