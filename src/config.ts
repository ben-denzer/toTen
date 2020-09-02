import { gameStates } from './types';

export const arrayOfTen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const gameStateMessages: Record<gameStates, string> = {
  userClickButton: 'Click the button to choose a number.',
  aiFirstRound: 'The bear will put .. snakes on the train.',
  userFirstRound: 'Enter the number of empty seats into the calculator, then press OK.',
  aiClickButton: 'Awesome. .. is correct. Next, the bear will click the button to choose a number.',
  userSecondRound: 'Your turn, put .. snakes onto the train and click the OK button.',
  aiSecondRound: 'Great Job. Now the bear will add the other .. to the train.',
  userWinsMatch: 'Great Job',
};

export const getGameStateMessage = (gameState: gameStates, dynamicText?: string): string => {
  let message = gameStateMessages[gameState];
  if (dynamicText && message.includes('..')) {
    message = message.replace('..', dynamicText);
  }
  return message;
};

export type CalculatorState = 'DISABLED' | 'OK_ONLY' | 'ENABLED';

export const calculatorStateMap: Record<gameStates, CalculatorState> = {
  userClickButton: 'DISABLED',
  aiFirstRound: 'DISABLED',
  userFirstRound: 'ENABLED',
  aiClickButton: 'DISABLED',
  userSecondRound: 'OK_ONLY',
  aiSecondRound: 'DISABLED',
  userWinsMatch: 'DISABLED',
};
