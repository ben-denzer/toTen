import { DragObjectWithType } from 'react-dnd';

export enum itemTypes {
  animal = 'animal',
}

export enum animalLocation {
  home = 'home',
  vehicle = 'vehicle',
}

export enum player {
  user = 'user',
  ai = 'ai',
}

export interface animalConfig {
  location: animalLocation;
  movedBy: player | null;
}

export type AnimalLocationMap = Record<number, animalConfig>;

export interface AnimalDragObj extends DragObjectWithType {
  position: number;
  location: animalLocation;
}
