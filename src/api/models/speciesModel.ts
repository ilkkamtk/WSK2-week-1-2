import CustomError from '../../classes/CustomError';
import promisePool from '../../database/db';
import {Species} from '../../types/DBTypes';
import {ResultSetHeader, RowDataPacket} from 'mysql2';

const getAllSpecies = async (): Promise<Species[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Species[]>(
    'SELECT * FROM species'
  );
  if (!rows) {
    throw new CustomError('No species found', 404);
  }
  return rows;
};

const getSpeciesById = async (id: number): Promise<Species> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Species[]>(
    'SELECT * FROM species WHERE species_id = ?',
    [id]
  );
  if (!rows) {
    throw new CustomError('No species found', 404);
  }
  return rows[0];
};

const addSpecies = async (
  species: Omit<Species, 'species_id'>
): Promise<number> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO species (species_name, category, image) VALUES (?, ?, ?);',
    [species.species_name, species.category, species.image]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Species not added', 400);
  }
  return headers.insertId;
};

const updateSpecies = async (
  id: number,
  species: Omit<Species, 'species_id'>
): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'UPDATE species SET species_name = ?, category = ?, image = ? WHERE species_id = ?;',
    [species.species_name, species.category, species.image, id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Species not updated', 304);
  }
  return true;
};

const deleteSpecies = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM species WHERE species_id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Species not updated', 304);
  }
  return true;
};

export {
  getAllSpecies,
  getSpeciesById,
  addSpecies,
  updateSpecies,
  deleteSpecies,
};
