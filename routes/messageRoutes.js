import express from 'express';
import {
  createMessage,
  getAllMessages,
  getMessageById,
  deleteMessage
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessage);         // Create new message
router.get('/', getAllMessages);         // Get all messages
router.get('/:id', getMessageById);      // Get one message
router.delete('/:id', deleteMessage);    // Delete message

export default router;
