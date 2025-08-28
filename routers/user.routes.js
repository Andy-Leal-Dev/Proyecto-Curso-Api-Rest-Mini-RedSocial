import express from 'express';
import {
  getProfile,
  getUserById,
  updateProfile,
  followUser,
  unfollowUser
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile', getProfile);
router.get('/:id', getUserById);
router.put('/profile', updateProfile);
router.post('/:id/follow', followUser);
router.post('/:id/unfollow', unfollowUser);

export default router;