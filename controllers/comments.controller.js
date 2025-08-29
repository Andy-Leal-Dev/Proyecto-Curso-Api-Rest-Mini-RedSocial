// Importar modelos necesarios
import Comment from '../models/comments.models.js';
import Post from '../models/post.models.js';

// Controlador para crear un comentario
export const createComment = async (req, res) => {
  try {
    // Extraer contenido del cuerpo de la solicitud
    const { content } = req.body;
    // Obtener ID del post desde parámetros de ruta
    const postId = req.params.postId;

    // Buscar post por ID
    const post = await Post.findById(postId);
    // Si no se encuentra el post, responder con error 404
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Crear nueva instancia de comentario
    const comment = new Comment({
      post: postId, // ID del post
      author: req.user.id, // ID del usuario autenticado
      content // Contenido del comentario
    });

    // Guardar comentario en la base de datos
    await comment.save();
    // Popular información del autor
    await comment.populate('author', 'username profile');

    // Incrementar contador de comentarios en el post
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    // Responder con éxito y datos del comentario creado
    res.status(201).json({
      message: 'Comentario creado exitosamente',
      comment
    });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al crear comentario', error: error.message });
  }
};

// Controlador para obtener comentarios de un post
export const getPostComments = async (req, res) => {
  try {
    // Obtener ID del post desde parámetros de ruta
    const postId = req.params.postId;
    // Obtener parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Buscar comentarios del post específico
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username profile') // Popular información del autor
      .sort({ createdAt: -1 }) // Ordenar por fecha descendente
      .skip(skip) // Saltar documentos según paginación
      .limit(limit); // Limitar cantidad de resultados

    // Contar total de comentarios del post
    const total = await Comment.countDocuments({ post: postId });

    // Responder con comentarios y metadatos de paginación
    res.json({
      comments,
      currentPage: page, // Página actual
      totalPages: Math.ceil(total / limit), // Total de páginas
      totalComments: total // Total de comentarios
    });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al obtener comentarios', error: error.message });
  }
};

// Controlador para actualizar un comentario
export const updateComment = async (req, res) => {
  try {
    // Extraer contenido del cuerpo de la solicitud
    const { content } = req.body;
    // Buscar comentario por ID
    const comment = await Comment.findById(req.params.id);

    // Si no se encuentra el comentario, responder con error 404
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Verificar que el usuario autenticado es el autor del comentario
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para editar este comentario' });
    }

    // Actualizar contenido del comentario
    comment.content = content;
    // Guardar cambios
    await comment.save();

    // Responder con éxito y comentario actualizado
    res.json({
      message: 'Comentario actualizado exitosamente',
      comment
    });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al actualizar comentario', error: error.message });
  }
};

// Controlador para eliminar un comentario
export const deleteComment = async (req, res) => {
  try {
    // Buscar comentario por ID
    const comment = await Comment.findById(req.params.id);

    // Si no se encuentra el comentario, responder con error 404
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Verificar que el usuario autenticado es el autor del comentario
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
    }

    // Eliminar comentario de la base de datos
    await Comment.findByIdAndDelete(req.params.id);

    // Decrementar contador de comentarios en el post
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    // Responder con éxito
    res.json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al eliminar comentario', error: error.message });
  }
};