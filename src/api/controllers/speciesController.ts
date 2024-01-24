import {
  getAllSpecies,
  getSpeciesById,
  addSpecies,
  updateSpecies,
  deleteSpecies,
} from '../models/speciesModel';
import {Species} from '../../types/DBTypes';
import {NextFunction, Request, Response} from 'express';
import {MessageResponse, PostMessage} from '../../types/MessageTypes';

const speciesListGet = async (
  _req: Request,
  res: Response<Species[]>,
  next: NextFunction
) => {
  try {
    const species = await getAllSpecies();
    res.json(species);
  } catch (error) {
    next(error);
  }
};

const speciesGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<Species>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const species = await getSpeciesById(id);
    res.json(species);
  } catch (error) {
    next(error);
  }
};

const speciesPost = async (
  req: Request<{}, {}, Omit<Species, 'species_id'>>,
  res: Response<PostMessage>,
  next: NextFunction
) => {
  try {
    const speciesID = await addSpecies(req.body);

    res.send({
      message: 'Species added',
      id: speciesID,
    });
  } catch (error) {
    next(error);
  }
};

const speciesPut = async (
  req: Request<{id: string}, {}, Omit<Species, 'species_id'>>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    await updateSpecies(id, req.body);
    res.send({
      message: 'Species updated',
    });
  } catch (error) {
    next(error);
  }
};

const speciesDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    await deleteSpecies(id);
    res.send({
      message: 'Species deleted',
    });
  } catch (error) {
    next(error);
  }
};

export {speciesListGet, speciesGet, speciesPost, speciesPut, speciesDelete};
