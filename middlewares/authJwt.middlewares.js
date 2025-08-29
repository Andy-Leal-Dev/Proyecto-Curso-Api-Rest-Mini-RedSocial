// Importar función para verificar tokens JWT
import { verifyToken } from '../utils/tokenmanager.js';

// Middleware para verificar autenticación JWT
export const verifyJwtToken = (req, res, next) => {
  // Obtener token del header Authorization
  const token = req.headers.authorization?.split(' ')[1]; // Formato: "Bearer TOKEN"

  // Si no hay token, responder con error 401
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = verifyToken(token);
    // Si el token es inválido, responder con error 401
    if (!decoded) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Agregar información del usuario decodificada al objeto request
    req.user = decoded;
    // Continuar con el siguiente middleware o controlador
    next();
  } catch (error) {
    // Manejar errores
    res.status(401).json({ message: 'Token inválido', error: error.message });
  }
};