// Importar modelos necesarios
import Like from '../models/likes.models.js';
import Post from '../models/post.models.js';
import Comment from '../models/comments.models.js';

// Controlador para dar like a un post
export const likePost = async (req, res) => {
  try {
    // Obtener ID del post desde parámetros de ruta
    const postId = req.params.postId;
    // Obtener ID del usuario autenticado
    const userId = req.user.id;

    // Buscar post por ID
    const post = await Post.findById(postId);
    // Si no se encuentra el post, responder con error 404
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar si el usuario ya dio like a este post
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      return res.status(400).json({ message: 'Ya diste like a este post' });
    }

    // Crear nuevo like
    const like = new Like({
      user: userId, // ID del usuario
      post: postId // ID del post
    });

    // Guardar like en la base de datos
    await like.save();

    // Incrementar contador de likes en el post
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    // Responder con éxito
    res.json({ message: 'Post liked exitosamente' });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al dar like al post', error: error.message });
  }
};

// Controlador para quitar like de un post
export const unlikePost = async (req, res) => {
  try {
    // Obtener ID del post desde parámetros de ruta
    const postId = req.params.postId;
    // Obtener ID del usuario autenticado
    const userId = req.user.id;

    // Buscar y eliminar el like del usuario para este post
    const like = await Like.findOneAndDelete({ user: userId, post: postId });

    // Si no se encuentra el like, responder con error 404
    if (!like) {
      return res.status(404).json({ message: 'Like no encontrado' });
    }

    // Decrementar contador de likes en el post
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

    // Responder con éxito
    res.json({ message: 'Like removido exitosamente' });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al remover like', error: error.message });
  }
};

// Controlador para dar like a un comentario
export const likeComment = async (req, res) => {
  try {
    // Obtener ID del comentario desde parámetros de ruta
    const commentId = req.params.commentId;
    // Obtener ID del usuario autenticado
    const userId = req.user.id;

    // Buscar comentario por ID
    const comment = await Comment.findById(commentId);
    // Si no se encuentra el comentario, responder con error 404
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Verificar si el usuario ya dio like a este comentario
    const existingLike = await Like.findOne({ user: userId, comment: commentId });
    if (existingLike) {
      return res.status(400).json({ message: 'Ya diste like a este comentario' });
    }

    // Crear nuevo like para comentario
    const like = new Like({
      user: userId, // ID del usuario
      comment: commentId // ID del comentario
    });

    // Guardar like en la base de datos
    await like.save();

    // Incrementar contador de likes en el comentario
    await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });

    // Responder con éxito
    res.json({ message: 'Comentario liked exitosamente' });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al dar like al comentario', error: error.message });
  }
};

// Controlador para quitar like de un comentario
export const unlikeComment = async (req, res) => {
  try {
    // Obtener ID del comentario desde parámetros de ruta
    const commentId = req.params.commentId;
    // Obtener ID del usuario autenticado
    const userId = req.user.id;

    // Buscar y eliminar el like del usuario para este comentario
    const like = await Like.findOneAndDelete({ user: userId, comment: commentId });

    // Si no se encuentra el like, responder con error 404
    if (!like) {
      return res.status(404).json({ message: 'Like no encontrado' });
    }

    // Decrementar contador de likes en el comentario
    await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: -1 } });

    // Responder con éxito
    res.json({ message: 'Like removido exitosamente' });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al remover like', error: error.message });
  }
};