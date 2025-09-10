import express from 'express';
import {
  createContactInfo,
  getContactInfo,
  updateContactInfo,
  deleteContactInfo
} from '../controllers/contactInfoController.js';

const router = express.Router();

router.post('/', createContactInfo); // Create
router.get('/', getContactInfo); // Get latest
router.put('/:id', updateContactInfo); // Update by ID
router.delete('/:id', deleteContactInfo); // Delete by ID (optional)

export default router;
