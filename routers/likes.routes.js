// Importar Express para crear el router
import express from 'express';
// Importar controladores de likes
import {
  likePost,
  unlikePost,
  likeComment,
  unlikeComment
} from '../controllers/likes.controller.js';

// Crear instancia del router de Express
const router = express.Router();

// Definir ruta para dar like a un post (POST /api/likes/post/:postId)
router.post('/post/:postId', likePost);
// Definir ruta para quitar like de un post (DELETE /api/likes/post/:postId)
router.delete('/post/:postId', unlikePost);
// Definir ruta para dar like a un comentario (POST /api/likes/comment/:commentId)
router.post('/comment/:commentId', likeComment);
// Definir ruta para quitar like de un comentario (DELETE /api/likes/comment/:commentId)
router.delete('/comment/:commentId', unlikeComment);

// Exportar el router para su uso en otros archivos
export default router;