type Category = {
  category_id: number;
  category_name: string;
};

type Animal = {
  animal_id: number;
  animal_name: string;
  species: number;
  birthdate: Date;
};

type Species = {
  species_id: number;
  species_name: string;
  category: number;
  image: string;
};

export {Category, Animal, Species};
