import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

// Importar rutas
import authRoutes from './routers/auth.routes.js';
import userRoutes from './routers/user.routes.js';
import postRoutes from './routers/post.routes.js';
import commentsRoutes from './routers/comments.routes.js';
import likesRoutes from './routers/likes.routes.js';

// Importar middleware de autenticación
import { verifyToken } from './middlewares/authJwt.middlewares.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mini_red_social')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (para imágenes)
app.use('/uploads', express.static('uploads'));

// Rutas públicas
app.use('/api/auth', authRoutes);

// Middleware de autenticación para rutas protegidas
app.use(verifyToken);

// Rutas protegidas
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likesRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});