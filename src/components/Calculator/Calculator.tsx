import React from 'react';
import styled from 'styled-components';
import { gameStates, calculatorStateMap, CalculatorState } from '../../types';

enum buttonValues {
  zero = '0',
  one = '1',
  two = '2',
  three = '3',
  four = '4',
  five = '5',
  six = '6',
  seven = '7',
  eight = '8',
  nine = '9',
  clear = 'C',
  ok = 'OK',
}

const calcButtons = [
  buttonValues.seven,
  buttonValues.eight,
  buttonValues.nine,
  buttonValues.four,
  buttonValues.five,
  buttonValues.six,
  buttonValues.one,
  buttonValues.two,
  buttonValues.three,
  buttonValues.zero,
  buttonValues.clear,
  buttonValues.ok,
];

const calcPadding = 10;

const calcWidth = 150;

const CalculatorWrapper = styled.div`
  width: ${calcWidth}px;
  display: flex;
  flex-direction: column;
  padding: ${calcPadding}px;
  background-color: blue;
  align-items: center;
`;

const CalculatorScreen = styled.div`
  width: 100%;
  height: 30px;
  background-color: lightgray;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const CalcButtonWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: space-around;
  justify-content: center;
`;

interface CalcButtonProps {
  val: buttonValues;
  calcState: CalculatorState;
}

const CalcButton = styled.div<CalcButtonProps>`
  ${(p) => {
    const isDisabled = p.calcState === 'DISABLED' || (p.calcState === 'OK_ONLY' && p.val !== buttonValues.ok);
    return `
    width: ${calcWidth / 3 - 20}px;
    height: ${calcWidth / 3 - 20}px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: red;
    border: 1px solid white;
    border-radius: 4px;
    cursor: ${isDisabled ? 'default' : 'pointer'};
    opacity: ${isDisabled ? '.2' : '1'};
    margin: 5px;`;
  }}
`;

interface Props {
  calculatorVal: number | null;
  gameState: gameStates;
  setCalculatorVal: (newVal: number | null) => void;
  submitCalcValue: () => void;
}

const Calculator: React.FC<Props> = ({ calculatorVal, gameState, setCalculatorVal, submitCalcValue }) => {
  const calcState: CalculatorState = calculatorStateMap[gameState];
  const handleCalcClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const val = target.dataset.buttonVal;

    if (!val || calcState === 'DISABLED') {
      return;
    }
    if (calcState === 'OK_ONLY' && val !== buttonValues.ok) {
      return;
    }

    switch (val) {
      case buttonValues.clear:
        setCalculatorVal(null);
        break;
      case buttonValues.ok:
        submitCalcValue();
        break;
      default:
        const oldVal: string = calculatorVal ? calculatorVal.toString() : '';
        const newVal = Number(oldVal + val);
        setCalculatorVal(newVal);
        break;
    }
  };

  return (
    <div>
      <CalculatorWrapper>
        <CalculatorScreen>{calculatorVal || calculatorVal === 0 ? calculatorVal.toString() : ''}</CalculatorScreen>
        <CalcButtonWrapper onClick={handleCalcClick}>
          {calcButtons.map((val: buttonValues) => (
            <CalcButton key={val} data-button-val={val} val={val} calcState={calcState}>
              {val}
            </CalcButton>
          ))}
        </CalcButtonWrapper>
      </CalculatorWrapper>
    </div>
  );
};

export default Calculator;
