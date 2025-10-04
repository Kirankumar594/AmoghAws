import express from 'express';
import { createEvent, getAllEvents, getEventById, deleteEvent,updateEvent } from '../controllers/eventController.js';
// import { eventUpload } from '../middleware/media.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export const eventUpload = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]);

const router = express.Router();

router.post('/', eventUpload, createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.delete('/:id', deleteEvent);
router.put('/:id', eventUpload, updateEvent); 

export default router;
