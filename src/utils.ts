import { AnimalLocationMap, animalConfig, animalLocation } from './types';

export const getAnimalsOnVehicleCount = (animalLocationMap: AnimalLocationMap): number => {
  return Object.values(animalLocationMap).filter((config: animalConfig) => config.location === animalLocation.vehicle)
    .length;
};
