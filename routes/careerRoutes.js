import express from 'express';
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  deleteApplication
} from '../controllers/careerController.js';

import { uploadResume } from '../middleware/resume.js';

const router = express.Router();

router.post('/', uploadResume.single('resume'), createApplication);
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.delete('/:id', deleteApplication); // ✅ DELETE endpoint added

export default router;
