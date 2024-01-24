import CustomError from '../../classes/CustomError';
import promisePool from '../../database/db';
import {Animal, FullAnimal} from '../../types/DBTypes';
import {ResultSetHeader, RowDataPacket} from 'mysql2';

const getAllAnimals = async (): Promise<FullAnimal[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & FullAnimal[]>(
    `SELECT animal_id, animal_name, birthdate,
    JSON_OBJECT(
      'species_id', species.species_id, 'species_name', species.species_name, 'image', species.image,
      'categegory', JSON_OBJECT('category_id', categories.category_id, 'category_name', categories.category_name)
    )
    AS species
    FROM animals
    JOIN species ON animals.species = species.species_id
    JOIN categories ON species.category = categories.category_id
    ;`
  );
  if (!rows) {
    throw new CustomError('No animals found', 404);
  }
  rows.forEach((animal: FullAnimal) => {
    animal.species = JSON.parse(animal.species as unknown as string);
  });
  return rows;
};

const getAnimalById = async (id: number): Promise<FullAnimal> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & FullAnimal[]>(
    `SELECT animal_id, animal_name, birthdate,
    JSON_OBJECT(
      'species_id', species.species_id, 'species_name', species.species_name, 'image', species.image,
      'categegory', JSON_OBJECT('category_id', categories.category_id, 'category_name', categories.category_name)
    )
    AS species
    FROM animals
    JOIN species ON animals.species = species.species_id
    JOIN categories ON species.category = categories.category_id
    WHERE animal_id = ?;`,
    [id]
  );
  if (!rows) {
    throw new CustomError('No animals found', 404);
  }
  rows.forEach((animal: FullAnimal) => {
    animal.species = JSON.parse(animal.species as unknown as string);
  });
  return rows[0];
};

const addAnimal = async (
  animal: Omit<Animal, 'animal_id'>
): Promise<number> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO animals (animal_name, species, birthdate) VALUES (?, ?, ?);',
    [animal.animal_name, animal.species, animal.birthdate]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Animal not added', 400);
  }
  return headers.insertId;
};

const updateAnimal = async (
  id: number,
  animal: Omit<Animal, 'animal_id'>
): Promise<boolean> => {
  const sql = promisePool.format('UPDATE animals SET ? WHERE animal_id = ?;', [
    animal,
    id,
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Animal not updated', 304);
  }
  return true;
};

const deleteAnimal = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM animals WHERE animal_id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Animal not deleted', 404);
  }
  return true;
};

export {getAllAnimals, getAnimalById, addAnimal, updateAnimal, deleteAnimal};
