import Post from '../models/post.models.js';
import User from '../models/user.models.js';

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? req.file.path : null;

    const post = new Post({
      author: req.user.id,
      content,
      image
    });

    await post.save();
    await post.populate('author', 'username profile');

    res.status(201).json({
      message: 'Post creado exitosamente',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear post', error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'username profile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener posts', error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: userId })
      .populate('author', 'username profile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ author: userId });

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener posts del usuario', error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profile');

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener post', error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para editar este post' });
    }

    post.content = content || post.content;
    await post.save();

    res.json({
      message: 'Post actualizado exitosamente',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar post', error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para eliminar este post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar post', error: error.message });
  }
};