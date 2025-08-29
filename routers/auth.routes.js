// Importar Express para crear el router
import express from 'express';
// Importar controladores de autenticación
import { register, login } from '../controllers/auth.controller.js';

// Crear instancia del router de Express
const router = express.Router();

// Definir ruta para registro de usuarios (POST /api/auth/register)
router.post('/register', register);
// Definir ruta para login de usuarios (POST /api/auth/login)
router.post('/login', login);

// Exportar el router para su uso en otros archivos
export default router;