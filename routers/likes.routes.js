import express from 'express';
import {
  likePost,
  unlikePost,
  likeComment,
  unlikeComment
} from '../controllers/likes.controller.js';

const router = express.Router();

router.post('/post/:postId', likePost);
router.delete('/post/:postId', unlikePost);
router.post('/comment/:commentId', likeComment);
router.delete('/comment/:commentId', unlikeComment);

export default router;