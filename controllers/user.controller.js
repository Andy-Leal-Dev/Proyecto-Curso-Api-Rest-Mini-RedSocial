import User from '../models/user.models.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('followers', 'username profile')
      .populate('following', 'username profile');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username profile')
      .populate('following', 'username profile');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'profile.firstName': firstName,
          'profile.lastName': lastName,
          'profile.bio': bio
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'No puedes seguirte a ti mismo' });
    }

    // Agregar a following del usuario actual
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { following: userToFollow._id }
    });

    // Agregar a followers del usuario seguido
    await User.findByIdAndUpdate(userToFollow._id, {
      $addToSet: { followers: req.user.id }
    });

    res.json({ message: 'Usuario seguido exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al seguir usuario', error: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Remover de following del usuario actual
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: userToUnfollow._id }
    });

    // Remover de followers del usuario
    await User.findByIdAndUpdate(userToUnfollow._id, {
      $pull: { followers: req.user.id }
    });

    res.json({ message: 'Dejaste de seguir al usuario exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al dejar de seguir usuario', error: error.message });
  }
};