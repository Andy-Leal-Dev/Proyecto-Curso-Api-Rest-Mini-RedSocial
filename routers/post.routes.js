import express from 'express';
import {
  createPost,
  getPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/post.controller.js';
import upload from '../utils/upload.utils.js';

const router = express.Router();

router.post('/', upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;