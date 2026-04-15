import { Router } from 'express';
import {
  listDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  reorderDestinations,
} from '../controllers/destination.controller';
import { destinationValidation } from '../middlewares/validators';

const router = Router();

router.get('/', listDestinations);
router.post('/', destinationValidation, createDestination);
router.put('/reorder', reorderDestinations);
router.put('/:id', destinationValidation, updateDestination);
router.delete('/:id', deleteDestination);

export default router;
