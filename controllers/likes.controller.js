import Like from '../models/likes.models.js';
import Post from '../models/post.models.js';
import Comment from '../models/comments.models.js';

export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar si ya dio like
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      return res.status(400).json({ message: 'Ya diste like a este post' });
    }

    const like = new Like({
      user: userId,
      post: postId
    });

    await like.save();

    // Incrementar contador de likes en el post
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    res.json({ message: 'Post liked exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar like al post', error: error.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const like = await Like.findOneAndDelete({ user: userId, post: postId });

    if (!like) {
      return res.status(404).json({ message: 'Like no encontrado' });
    }

    // Decrementar contador de likes en el post
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

    res.json({ message: 'Like removido exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al remover like', error: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Verificar si ya dio like
    const existingLike = await Like.findOne({ user: userId, comment: commentId });
    if (existingLike) {
      return res.status(400).json({ message: 'Ya diste like a este comentario' });
    }

    const like = new Like({
      user: userId,
      comment: commentId
    });

    await like.save();

    // Incrementar contador de likes en el comentario
    await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });

    res.json({ message: 'Comentario liked exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar like al comentario', error: error.message });
  }
};

export const unlikeComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const like = await Like.findOneAndDelete({ user: userId, comment: commentId });

    if (!like) {
      return res.status(404).json({ message: 'Like no encontrado' });
    }

    // Decrementar contador de likes en el comentario
    await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: -1 } });

    res.json({ message: 'Like removido exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al remover like', error: error.message });
  }
};