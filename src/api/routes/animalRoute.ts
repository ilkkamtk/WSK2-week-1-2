import express from 'express';
import {
  animalListGet,
  animalGet,
  animalPost,
  animalPut,
  animalDelete,
} from '../controllers/animalController';

const router = express.Router();

router.route('/').get(animalListGet).post(animalPost);

router.route('/:id').get(animalGet).put(animalPut).delete(animalDelete);

export default router;
