import express from 'express';
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment
} from '../controllers/comments.controller.js';

const router = express.Router();

router.post('/:postId', createComment);
router.get('/:postId', getPostComments);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;