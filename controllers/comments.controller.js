import Comment from '../models/comments.models.js';
import Post from '../models/post.models.js';

export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const comment = new Comment({
      post: postId,
      author: req.user.id,
      content
    });

    await comment.save();
    await comment.populate('author', 'username profile');

    // Incrementar contador de comentarios en el post
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.status(201).json({
      message: 'Comentario creado exitosamente',
      comment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear comentario', error: error.message });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ post: postId })
      .populate('author', 'username profile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ post: postId });

    res.json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalComments: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comentarios', error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para editar este comentario' });
    }

    comment.content = content;
    await comment.save();

    res.json({
      message: 'Comentario actualizado exitosamente',
      comment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar comentario', error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    // Decrementar contador de comentarios en el post
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    res.json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar comentario', error: error.message });
  }
};