// Importar mongoose para definir esquemas y modelos
import mongoose from 'mongoose';

// Definir esquema para comentarios
const commentSchema = new mongoose.Schema({
  // Referencia al post al que pertenece el comentario
  post: {
    type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId de MongoDB
    ref: 'Post', // Referencia al modelo Post
    required: true // Campo obligatorio
  },
  // Referencia al autor del comentario
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencia al modelo User
    required: true
  },
  // Contenido del comentario
  content: {
    type: String,
    required: true, // Campo obligatorio
    maxlength: 500 // Longitud máxima de 500 caracteres
  },
  // Contador de likes del comentario
  likesCount: {
    type: Number,
    default: 0 // Valor por defecto: 0
  }
}, {
  timestamps: true // Agregar campos createdAt y updatedAt automáticamente
});

// Índice para búsquedas eficientes: buscar comentarios por post y ordenar por fecha
commentSchema.index({ post: 1, createdAt: -1 });

// Exportar modelo Comment basado en el esquema definido
export default mongoose.model('Comment', commentSchema);