// Importar mongoose para definir esquemas y modelos
import mongoose from 'mongoose';

// Definir esquema para posts
const postSchema = new mongoose.Schema({
  // Referencia al autor del post
  author: {
    type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId de MongoDB
    ref: 'User', // Referencia al modelo User
    required: true // Campo obligatorio
  },
  // Contenido del post
  content: {
    type: String,
    required: true, // Campo obligatorio
    maxlength: 1000 // Longitud máxima de 1000 caracteres
  },
  // Ruta de la imagen adjunta (opcional)
  image: {
    type: String,
    default: null // Valor por defecto: null
  },
  // Contador de likes del post
  likesCount: {
    type: Number,
    default: 0 // Valor por defecto: 0
  },
  // Contador de comentarios del post
  commentsCount: {
    type: Number,
    default: 0 // Valor por defecto: 0
  }
}, {
  timestamps: true // Agregar campos createdAt y updatedAt automáticamente
});

// Índice para búsquedas eficientes: buscar posts por autor y ordenar por fecha
postSchema.index({ author: 1, createdAt: -1 });

// Exportar modelo Post basado en el esquema definido
export default mongoose.model('Post', postSchema);