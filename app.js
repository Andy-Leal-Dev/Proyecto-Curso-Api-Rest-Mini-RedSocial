// Importar y configurar variables de entorno
import 'dotenv/config';
// Importar Express para crear la aplicación
import express from 'express';
// Importar body-parser para parsear cuerpos de solicitud
import bodyParser from 'body-parser';
// Importar morgan para logging de solicitudes HTTP
import morgan from 'morgan';
// Importar mongoose para conexión con MongoDB
import mongoose from 'mongoose';

// Importar rutas de la aplicación
import authRoutes from './routers/auth.routes.js';
import userRoutes from './routers/user.routes.js';
import postRoutes from './routers/post.routes.js';
import commentsRoutes from './routers/comments.routes.js';
import likesRoutes from './routers/likes.routes.js';
import connectDB from './config/db.js';
// Importar middleware de autenticación JWT
import { verifyJwtToken } from './middlewares/authJwt.middlewares.js';
import { verifyToken } from './utils/tokenmanager.js';

// Crear instancia de la aplicación Express
const app = express();
// Definir puerto (usar variable de entorno o puerto 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos MongoDB
connectDB();

// Middlewares de la aplicación
app.use(morgan('dev')); // Usar morgan en modo 'dev' para logging
app.use(bodyParser.json()); // Parsear cuerpos JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parsear cuerpos URL-encoded

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static('uploads'));

// Rutas públicas (no requieren autenticación)
app.use('/api/auth', authRoutes);

// Middleware de autenticación para rutas protegidas
app.use(verifyJwtToken);

// Rutas protegidas (requieren autenticación)
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likesRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack); // Log del error
  res.status(500).json({ message: 'Error interno del servidor' }); // Responder con error genérico
});

// Iniciar servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});