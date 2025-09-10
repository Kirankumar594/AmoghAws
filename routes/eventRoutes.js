import express from 'express';
import { createEvent, getAllEvents, getEventById, deleteEvent } from '../controllers/eventController.js';
import { eventUpload } from '../middleware/media.js';

const router = express.Router();

router.post('/', eventUpload, createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.delete('/:id', deleteEvent);

export default router;
