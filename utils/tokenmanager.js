// Importar jsonwebtoken para manejar tokens JWT
import jwt from 'jsonwebtoken';

// Función para generar token JWT
export const generateToken = (userId) => {
  // Crear y firmar token JWT
  return jwt.sign(
    { id: userId }, // Payload: contiene el ID del usuario
    process.env.JWT_SECRET || 'secret_key', // Clave secreta (usar variable de entorno o valor por defecto)
    { expiresIn: '7d' } // Tiempo de expiración del token (7 días)
  );
};

// Función para verificar token JWT
export const verifyToken = (token) => {
  try {
    // Verificar y decodificar el token usando la clave secreta
    return jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
  } catch (error) {
    // Si hay error en la verificación, retornar null
    return null;
  }
};