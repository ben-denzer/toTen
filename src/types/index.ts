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

export enum gameStates {
  aiActionFirst = 'aiActionFirst',
  aiActionLast = 'aiActionLast',
  introScreen = 'introScreen',
  userActionFirst = 'userActionFirst',
  userActionLast = 'userActionLast',
  userTryAgainFirst = 'userTryAgainFirst',
  userTryAgainLast = 'userTryAgainLast',
  userWinsMatch = 'userWinsMatch',
}

export type Scores = Record<player, number>;

export type CalculatorState = 'DISABLED' | 'OK_ONLY' | 'ENABLED';

export const calculatorStateMap: Record<gameStates, CalculatorState> = {
  aiActionFirst: 'DISABLED',
  aiActionLast: 'DISABLED',
  introScreen: 'DISABLED',
  userActionFirst: 'OK_ONLY',
  userActionLast: 'ENABLED',
  userTryAgainFirst: 'OK_ONLY',
  userTryAgainLast: 'ENABLED',
  userWinsMatch: 'DISABLED',
};
