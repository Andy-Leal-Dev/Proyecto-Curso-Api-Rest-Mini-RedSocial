import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  likesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índice para búsquedas eficientes
commentSchema.index({ post: 1, createdAt: -1 });

export default mongoose.model('Comment', commentSchema);