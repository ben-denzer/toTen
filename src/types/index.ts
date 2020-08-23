import { DragObjectWithType } from 'react-dnd';

export enum itemTypes {
  animal = 'animal',
}

export enum animalLocation {
  home = 'home',
  vehicle = 'vehicle',
}

export type AnimalLocationMap = Record<number, animalLocation>;

export interface AnimalDragObj extends DragObjectWithType {
  position: number;
  location: animalLocation;
}
