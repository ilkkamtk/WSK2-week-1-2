import express from 'express';
import {
  speciesListGet,
  speciesGet,
  speciesPost,
  speciesPut,
  speciesDelete,
} from '../controllers/speciesController';

const router = express.Router();

router.route('/').get(speciesListGet).post(speciesPost);

router.route('/:id').get(speciesGet).put(speciesPut).delete(speciesDelete);

export default router;
