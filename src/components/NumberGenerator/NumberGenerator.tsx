import React from 'react';
import styled from 'styled-components';
import { calcWidth } from '../../styles';

const generatorWidth = calcWidth;
const generatorSidePadding = 20;

const NumberGeneratorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${generatorWidth}px;
  padding: 10px ${generatorSidePadding}px;
  align-items: center;
  background-color: blue;
`;

const GeneratorScreen = styled.div`
  background: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

interface ButtonProps {
  canClick: boolean;
}

const GeneratorButton = styled.button<ButtonProps>`
  cursor: ${(p) => (p.canClick ? 'pointer' : 'default')};
  width: 100%;
  height: ${generatorWidth - generatorSidePadding * 2}px;
  background-color: green;
`;

interface Props {
  generatorClicked: () => void;
  generatorVal: number | null;
}

const NumberGenerator: React.FC<Props> = ({ generatorVal, generatorClicked }) => {
  const canClick = !generatorVal;
  return (
    <NumberGeneratorWrapper>
      <GeneratorScreen>{generatorVal === null ? '' : generatorVal.toString()}</GeneratorScreen>
      <GeneratorButton type="button" onClick={generatorClicked} canClick={canClick} />
    </NumberGeneratorWrapper>
  );
};

export default NumberGenerator;
