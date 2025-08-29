// Importar Express para crear el router
import express from 'express';
// Importar controladores de comentarios
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment
} from '../controllers/comments.controller.js';

// Crear instancia del router de Express
const router = express.Router();

// Definir ruta para crear comentario (POST /api/comments/:postId)
router.post('/:postId', createComment);
// Definir ruta para obtener comentarios de un post (GET /api/comments/:postId)
router.get('/:postId', getPostComments);
// Definir ruta para actualizar comentario (PUT /api/comments/:id)
router.put('/:id', updateComment);
// Definir ruta para eliminar comentario (DELETE /api/comments/:id)
router.delete('/:id', deleteComment);

// Exportar el router para su uso en otros archivos
export default router;