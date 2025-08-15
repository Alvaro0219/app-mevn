import express from 'express';
import {getUsers, getUserById, createUser, updateUser, deleteUser} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);         // Listar usuarios
router.get('/:id', getUserById);   // Obtener usuario por ID
router.post('/', createUser);      // Crear usuario
router.put('/:id', updateUser);    // Actualizar usuario
router.delete('/:id', deleteUser); // Eliminar usuario

export default router;