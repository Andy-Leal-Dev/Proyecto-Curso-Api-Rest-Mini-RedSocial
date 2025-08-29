// Importar el modelo Post desde el archivo de modelos
import Post from '../models/post.models.js';
// Importar el modelo User desde el archivo de modelos
import User from '../models/user.models.js';

// Controlador para crear un nuevo post
export const createPost = async (req, res) => {
  try {
    // Extraer el contenido del cuerpo de la solicitud
    const { content } = req.body;
    // Verificar si hay un archivo adjunto y obtener su ruta
    const image = req.file ? req.file.path : null;

    // Crear una nueva instancia del modelo Post
    const post = new Post({
      author: req.user.id, // ID del usuario autenticado
      content, // Contenido del post
      image // Ruta de la imagen (si existe)
    });

    // Guardar el post en la base de datos
    await post.save();
    // Popular el campo 'author' con información del usuario (username y profile)
    await post.populate('author', 'username profile');

    // Responder con éxito y los datos del post creado
    res.status(201).json({
      message: 'Post creado exitosamente',
      post
    });
  } catch (error) {
    // Manejar errores y responder con mensaje de error
    res.status(500).json({ message: 'Error al crear post', error: error.message });
  }
};

// Controlador para obtener todos los posts con paginación
export const getPosts = async (req, res) => {
  try {
    // Obtener número de página desde query params (valor por defecto: 1)
    const page = parseInt(req.query.page) || 1;
    // Obtener límite de resultados por página (valor por defecto: 10)
    const limit = parseInt(req.query.limit) || 10;
    // Calcular cuántos documentos saltar para la paginación
    const skip = (page - 1) * limit;

    // Buscar posts, popular información del autor, ordenar por fecha descendente
    const posts = await Post.find()
      .populate('author', 'username profile') // Incluir username y profile del autor
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación (más reciente primero)
      .skip(skip) // Saltar documentos según paginación
      .limit(limit); // Limitar cantidad de resultados

    // Contar el total de documentos en la colección Post
    const total = await Post.countDocuments();

    // Responder con los posts y metadatos de paginación
    res.json({
      posts,
      currentPage: page, // Página actual
      totalPages: Math.ceil(total / limit), // Total de páginas
      totalPosts: total // Total de posts
    });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al obtener posts', error: error.message });
  }
};

// Controlador para obtener posts de un usuario específico
export const getUserPosts = async (req, res) => {
  try {
    // Obtener ID del usuario desde los parámetros de la ruta
    const userId = req.params.userId;
    // Obtener parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Buscar posts del usuario específico
    const posts = await Post.find({ author: userId })
      .populate('author', 'username profile') // Popular información del autor
      .sort({ createdAt: -1 }) // Ordenar por fecha descendente
      .skip(skip) // Saltar documentos
      .limit(limit); // Limitar resultados

    // Contar total de posts del usuario
    const total = await Post.countDocuments({ author: userId });

    // Responder con posts y metadatos de paginación
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al obtener posts del usuario', error: error.message });
  }
};

// Controlador para obtener un post por su ID
export const getPostById = async (req, res) => {
  try {
    // Buscar post por ID y popular información del autor
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profile');

    // Si no se encuentra el post, responder con error 404
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Responder con el post encontrado
    res.json(post);
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al obtener post', error: error.message });
  }
};

// Controlador para actualizar un post
export const updatePost = async (req, res) => {
  try {
    // Extraer contenido del cuerpo de la solicitud
    const { content } = req.body;
    // Buscar post por ID
    const post = await Post.findById(req.params.id);

    // Si no se encuentra el post, responder con error 404
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar que el usuario autenticado es el autor del post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para editar este post' });
    }

    // Actualizar contenido del post (mantener el anterior si no se proporciona nuevo)
    post.content = content || post.content;
    // Guardar cambios
    await post.save();

    // Responder con éxito y el post actualizado
    res.json({
      message: 'Post actualizado exitosamente',
      post
    });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al actualizar post', error: error.message });
  }
};

// Controlador para eliminar un post
export const deletePost = async (req, res) => {
  try {
    // Buscar post por ID
    const post = await Post.findById(req.params.id);

    // Si no se encuentra el post, responder con error 404
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar que el usuario autenticado es el autor del post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para eliminar este post' });
    }

    // Eliminar post de la base de datos
    await Post.findByIdAndDelete(req.params.id);

    // Responder con éxito
    res.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al eliminar post', error: error.message });
  }
};