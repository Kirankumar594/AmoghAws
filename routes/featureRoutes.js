import express from 'express';
import {
  createFeature,
  getAllFeatures,
  getFeatureById,
  updateFeature,
  deleteFeature
} from '../controllers/featureController.js';

const router = express.Router();

// Routes
router.post('/', createFeature);
router.get('/', getAllFeatures);
router.get('/:id', getFeatureById);
router.put('/:id', updateFeature);
router.delete('/:id', deleteFeature);

export default router;
