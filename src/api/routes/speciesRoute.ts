import express from 'express';
import {
  speciesListGet,
  speciesGet,
  speciesPost,
  speciesPut,
  speciesDelete,
} from '../controllers/speciesController';
import {imageFromWikipedia} from '../../middlewares';

const router = express.Router();

router.route('/').get(speciesListGet).post(imageFromWikipedia, speciesPost);

router.route('/:id').get(speciesGet).put(speciesPut).delete(speciesDelete);

export default router;
