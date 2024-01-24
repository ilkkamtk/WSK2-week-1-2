import {
  getAllAnimals,
  getAnimalById,
  addAnimal,
  updateAnimal,
  deleteAnimal,
} from '../models/animalModel';

import {Animal} from '../../types/DBTypes';
import {NextFunction, Request, Response} from 'express';
import {MessageResponse, PostMessage} from '../../types/MessageTypes';

const animalListGet = async (
  _req: Request,
  res: Response<Animal[]>,
  next: NextFunction
) => {
  try {
    const animals = await getAllAnimals();
    res.json(animals);
  } catch (error) {
    next(error);
  }
};

const animalGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<Animal>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const animal = await getAnimalById(id);
    res.json(animal);
  } catch (error) {
    next(error);
  }
};

const animalPost = async (
  req: Request<{}, {}, Omit<Animal, 'animal_id'>>,
  res: Response<PostMessage>,
  next: NextFunction
) => {
  try {
    const animalID = await addAnimal(req.body);

    res.send({
      message: 'Animal added',
      id: animalID,
    });
  } catch (error) {
    next(error);
  }
};

const animalPut = async (
  req: Request<{id: string}, {}, Omit<Animal, 'animal_id'>>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    await updateAnimal(id, req.body);
    res.send({
      message: 'Animal updated',
    });
  } catch (error) {
    next(error);
  }
};

const animalDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    await deleteAnimal(id);
    res.send({
      message: 'Animal deleted',
    });
  } catch (error) {
    next(error);
  }
};

export {animalListGet, animalGet, animalPost, animalPut, animalDelete};
