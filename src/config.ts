import { gameStates } from './types';

export const arrayOfTen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const gameStateMessages: Record<gameStates, string> = {
  aiActionFirst: 'Click the button to choose a number',
  aiActionLast: 'Now the computer will fill in the rest of the seats',
  introScreen: 'Choose a color to get started',
  userActionFirst: 'Your Turn, Click the button to choose a number',
  userActionLast: 'Use the calculator to enter the right number',
  userTryAgainFirst: 'Try Again',
  userTryAgainLast: 'Try Again',
  userWinsMatch: 'Great Job',
};
