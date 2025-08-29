// Importar modelo User
import User from '../models/user.models.js';
// Importar función para generar tokens JWT
import { generateToken } from '../utils/tokenmanager.js';

// Controlador para registro de usuarios
export const register = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { username, email, password, firstName, lastName } = req.body;

    // Verificar si el usuario ya existe por email o username
    const existingUser = await User.findOne({
        $or: [{ email }, { username }] // Buscar por email OR username
    });

    // Si ya existe un usuario, responder con error 400
    if (existingUser) {
      return res.status(400).json({
        message: 'El usuario o email ya existe'
      });
    }

    // Crear nueva instancia de usuario
    const user = new User({
      username,
      email,
      password,
      profile: { firstName, lastName } // Datos del perfil
    });

    // Guardar usuario en la base de datos
    await user.save();

    // Generar token JWT para el usuario
    const token = generateToken(user._id);

    // Responder con éxito, token y datos del usuario (sin password)
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

// Controlador para login de usuarios
export const login = async (req, res) => {
  try {
    // Extraer credenciales del cuerpo de la solicitud
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    // Si no se encuentra el usuario, responder con error 401
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    // Si la contraseña es inválida, responder con error 401
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT para el usuario
    const token = generateToken(user._id);

    // Responder con éxito, token y datos del usuario (sin password)
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};