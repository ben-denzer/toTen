import React from 'react';
import styled from 'styled-components';

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
  ok = 'ok',
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

const calcWidth = 300;

const CalculatorWrapper = styled.div`
  width: ${calcWidth}px;
  display: flex;
  flex-direction: column;
  padding: ${calcPadding}px;
`;

const CalculatorScreen = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CalcButtonWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: space-around;
`;

interface CalcButtonProps {
  val: buttonValues;
}

const CalcButton = styled.div<CalcButtonProps>`
  width: ${calcWidth / 3 - 10}px;
  height: ${calcWidth / 3 - 10}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  calculatorVal: number | null;
  setCalculatorVal: (newVal: number | null) => void;
  submitCalcValue: () => void;
}

const Calculator: React.FC<Props> = ({ calculatorVal, setCalculatorVal, submitCalcValue }) => {
  const handleCalcClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const val = target.dataset.buttonVal;
    if (!val) {
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
    <CalculatorWrapper>
      <CalculatorScreen>{calculatorVal || calculatorVal === 0 ? calculatorVal.toString() : ''}</CalculatorScreen>
      <CalcButtonWrapper onClick={handleCalcClick}>
        {calcButtons.map((val: buttonValues) => (
          <CalcButton key={val} data-button-val={val} val={val}>
            {val}
          </CalcButton>
        ))}
      </CalcButtonWrapper>
    </CalculatorWrapper>
  );
};

export default Calculator;
