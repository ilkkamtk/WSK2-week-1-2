import express from 'express';
import {
  animalListGet,
  animalGet,
  animalPost,
  animalPut,
  animalDelete,
} from '../controllers/animalController';
import {body, param} from 'express-validator';

const router = express.Router();

router
  .route('/')
  .get(animalListGet)
  .post(
    body('animal_name').isString().notEmpty().escape(),
    body('birthdate').isDate(),
    body('species').isInt(),
    animalPost
  );

router
  .route('/:id')
  .get(param('id').isInt(), animalGet)
  .put(
    param('id').isInt(),
    body('animal_name').isString().optional().escape(),
    body('birthdate').isDate().optional(),
    body('species').isInt().optional(),
    animalPut
  )
  .delete(param('id').isInt(), animalDelete);

export default router;
