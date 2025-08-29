// Importar Express para crear el router
import express from 'express';
// Importar controladores de usuario
import {
  getProfile,
  getUserById,
  updateProfile,
  followUser,
  unfollowUser
} from '../controllers/user.controller.js';

// Crear instancia del router de Express
const router = express.Router();

// Definir ruta para obtener perfil del usuario autenticado (GET /api/users/profile)
router.get('/profile', getProfile);
// Definir ruta para obtener usuario por ID (GET /api/users/:id)
router.get('/:id', getUserById);
// Definir ruta para actualizar perfil (PUT /api/users/profile)
router.put('/profile', updateProfile);
// Definir ruta para seguir a un usuario (POST /api/users/:id/follow)
router.post('/:id/follow', followUser);
// Definir ruta para dejar de seguir a un usuario (POST /api/users/:id/unfollow)
router.post('/:id/unfollow', unfollowUser);

// Exportar el router para su uso en otros archivos
export default router;