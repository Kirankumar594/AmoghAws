import express from 'express';
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  deleteApplication
} from '../controllers/careerController.js';


import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/', upload.single('resume'), createApplication);
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.delete('/:id', deleteApplication); // ✅ DELETE endpoint added

export default router;
