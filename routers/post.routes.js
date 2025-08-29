// Importar Express para crear el router
import express from 'express';
// Importar controladores de posts
import {
  createPost,
  getPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/post.controller.js';
// Importar middleware para upload de archivos
import upload from '../utils/upload.utils.js';

// Crear instancia del router de Express
const router = express.Router();

// Definir ruta para crear post (POST /api/posts)
// Usar middleware upload.single para manejar upload de una imagen con campo 'image'
router.post('/', upload.single('image'), createPost);
// Definir ruta para obtener todos los posts (GET /api/posts)
router.get('/', getPosts);
// Definir ruta para obtener posts de un usuario específico (GET /api/posts/user/:userId)
router.get('/user/:userId', getUserPosts);
// Definir ruta para obtener un post por ID (GET /api/posts/:id)
router.get('/:id', getPostById);
// Definir ruta para actualizar un post (PUT /api/posts/:id)
router.put('/:id', updatePost);
// Definir ruta para eliminar un post (DELETE /api/posts/:id)
router.delete('/:id', deletePost);

// Exportar el router para su uso en otros archivos
export default router;