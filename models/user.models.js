// Importar mongoose para definir esquemas y modelos
import mongoose from 'mongoose';
// Importar bcrypt para hashing de contraseñas
import bcrypt from 'bcryptjs';

// Definir esquema para usuarios
const userSchema = new mongoose.Schema({
  // Nombre de usuario (único)
  username: {
    type: String,
    required: true, // Campo obligatorio
    unique: true, // Debe ser único
    trim: true, // Eliminar espacios en blanco al inicio y final
    minlength: 3, // Longitud mínima de 3 caracteres
    maxlength: 30 // Longitud máxima de 30 caracteres
  },
  // Email del usuario (único)
  email: {
    type: String,
    required: true, // Campo obligatorio
    unique: true, // Debe ser único
    lowercase: true, // Convertir a minúsculas
    match: [ // Validar formato de email con expresión regular
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ]
  },
  // Contraseña (hasheada)
  password: {
    type: String,
    required: true, // Campo obligatorio
    minlength: 6 // Longitud mínima de 6 caracteres
  },
  // Datos del perfil del usuario
  profile: {
    firstName: {
      type: String,
      required: true, // Campo obligatorio
      trim: true, // Eliminar espacios en blanco
      maxlength: 50 // Longitud máxima de 50 caracteres
    },
    lastName: {
      type: String,
      required: true, // Campo obligatorio
      trim: true, // Eliminar espacios en blanco
      maxlength: 50 // Longitud máxima de 50 caracteres
    },
    // Biografía del usuario (opcional)
    bio: {
      type: String,
      maxlength: 500, // Longitud máxima de 500 caracteres
      default: '' // Valor por defecto: cadena vacía
    },
    // URL de la foto de perfil (opcional)
    photo: {
      type: String,
      default: null // Valor por defecto: null
    }
  },
  // Array de IDs de usuarios que siguen a este usuario
  followers: [{
    type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId de MongoDB
    ref: 'User' // Referencia al modelo User
  }],
  // Array de IDs de usuarios que este usuario sigue
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true // Agregar campos createdAt y updatedAt automáticamente
});

// Middleware pre-save: hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear la contraseña si ha sido modificada
  if (!this.isModified('password')) return next();
  
  try {
    // Generar salt para el hashing (10 rondas)
    const salt = await bcrypt.genSalt(10);
    // Hashear la contraseña con el salt
    this.password = await bcrypt.hash(this.password, salt);
    // Continuar con el proceso de guardado
    next();
  } catch (error) {
    // Pasar error al siguiente middleware
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Comparar contraseña proporcionada con la contraseña hasheada
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    // Si hay error, retornar false
    return false;
  }
};

// Índices para mejorar rendimiento en búsquedas
userSchema.index({ username: 1 }); // Índice en campo username
userSchema.index({ email: 1 }); // Índice en campo email

// Exportar modelo User basado en el esquema definido
export default mongoose.model('User', userSchema);