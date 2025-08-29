// Importar modelo User
import User from '../models/user.models.js';

// Controlador para obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    // Buscar usuario por ID (del token JWT) y excluir password
    const user = await User.findById(req.user.id)
      .select('-password') // Excluir campo password
      .populate('followers', 'username profile') // Popular seguidores con username y profile
      .populate('following', 'username profile'); // Popular seguidos con username y profile

    // Si no se encuentra el usuario, responder con error 404
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder con datos del usuario
    res.json(user);
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

// Controlador para obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    // Buscar usuario por ID (de parámetros de ruta) y excluir password
    const user = await User.findById(req.params.id)
      .select('-password') // Excluir campo password
      .populate('followers', 'username profile') // Popular seguidores
      .populate('following', 'username profile'); // Popular seguidos

    // Si no se encuentra el usuario, responder con error 404
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder con datos del usuario
    res.json(user);
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

// Controlador para actualizar perfil de usuario
export const updateProfile = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { firstName, lastName, bio } = req.body;
    
    // Actualizar usuario por ID (del token JWT)
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // ID del usuario autenticado
      {
        $set: { // Usar operador $set para actualizar campos específicos
          'profile.firstName': firstName,
          'profile.lastName': lastName,
          'profile.bio': bio
        }
      },
      { new: true, runValidators: true } // Opciones: retornar documento actualizado y ejecutar validaciones
    ).select('-password'); // Excluir campo password

    // Responder con éxito y datos del usuario actualizado
    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

// Controlador para seguir a un usuario
export const followUser = async (req, res) => {
  try {
    // Obtener ID del usuario a seguir desde parámetros de ruta
    const userToFollowId = req.params.id;
    // Obtener ID del usuario autenticado
    const currentUserId = req.user.id;

    // Verificar que no se intenta seguir a sí mismo
    if (userToFollowId === currentUserId) {
      return res.status(400).json({ message: 'No puedes seguirte a ti mismo' });
    }

    // Buscar usuario a seguir
    const userToFollow = await User.findById(userToFollowId);
    // Si no se encuentra el usuario, responder con error 404
    if (!userToFollow) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si ya se sigue a este usuario
    const isAlreadyFollowing = await User.findOne({
      _id: currentUserId,
      following: userToFollowId
    });

    // Si ya se sigue, responder con error 400
    if (isAlreadyFollowing) {
      return res.status(400).json({ message: 'Ya sigues a este usuario' });
    }

    // Agregar usuario a la lista de seguidos del usuario autenticado
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userToFollowId } // Usar $addToSet para evitar duplicados
    });

    // Agregar usuario autenticado a la lista de seguidores del usuario seguido
    await User.findByIdAndUpdate(userToFollowId, {
      $addToSet: { followers: currentUserId } // Usar $addToSet para evitar duplicados
    });

    // Responder con éxito
    res.json({ message: 'Usuario seguido exitosamente' });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al seguir usuario', error: error.message });
  }
};

// Controlador para dejar de seguir a un usuario
export const unfollowUser = async (req, res) => {
  try {
    // Obtener ID del usuario a dejar de seguir desde parámetros de ruta
    const userToUnfollowId = req.params.id;
    // Obtener ID del usuario autenticado
    const currentUserId = req.user.id;

    // Verificar que no se intenta dejar de seguir a sí mismo
    if (userToUnfollowId === currentUserId) {
      return res.status(400).json({ message: 'No puedes dejar de seguirte a ti mismo' });
    }

    // Buscar usuario a dejar de seguir
    const userToUnfollow = await User.findById(userToUnfollowId);
    // Si no se encuentra el usuario, responder con error 404
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si realmente se sigue a este usuario
    const isFollowing = await User.findOne({
      _id: currentUserId,
      following: userToUnfollowId
    });

    // Si no se sigue, responder con error 400
    if (!isFollowing) {
      return res.status(400).json({ message: 'No sigues a este usuario' });
    }

    // Remover usuario de la lista de seguidos del usuario autenticado
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userToUnfollowId } // Usar $pull para remover elemento del array
    });

    // Remover usuario autenticado de la lista de seguidores del usuario
    await User.findByIdAndUpdate(userToUnfollowId, {
      $pull: { followers: currentUserId } // Usar $pull para remover elemento del array
    });

    // Responder con éxito
    res.json({ message: 'Dejaste de seguir al usuario exitosamente' });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al dejar de seguir usuario', error: error.message });
  }
};