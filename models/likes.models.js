// Importar mongoose para definir esquemas y modelos
import mongoose from 'mongoose';

// Definir esquema para likes
const likeSchema = new mongoose.Schema({
  // Referencia al usuario que dio el like
  user: {
    type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId de MongoDB
    ref: 'User', // Referencia al modelo User
    required: true // Campo obligatorio
  },
  // Referencia al post que recibió el like (opcional)
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post' // Referencia al modelo Post
  },
  // Referencia al comentario que recibió el like (opcional)
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment' // Referencia al modelo Comment
  }
}, {
  timestamps: true // Agregar campos createdAt y updatedAt automáticamente
});

// Índice compuesto para garantizar que un usuario solo pueda dar like una vez
// a un post o comentario específico
likeSchema.index({ user: 1, post: 1 }, { unique: true, sparse: true });
likeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });

// Exportar modelo Like basado en el esquema definido
export default mongoose.model('Like', likeSchema);