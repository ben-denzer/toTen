import React, { useState } from 'react';
import styled from 'styled-components';
import Vehicle from '../Vehicle';
import { animalLocation, AnimalLocationMap, player } from '../../types';
import { arrayOfTen } from '../../config';
import AnimalHome from '../AnimalHome';
import NumberGenerator from '../NumberGenerator';
import Calculator from '../Calculator';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const initialState: AnimalLocationMap = arrayOfTen.reduce((acc, cur) => {
  return { ...acc, [cur]: { location: animalLocation.home, movedBy: null } };
}, {});

const App: React.FC<{}> = () => {
  const [animalLocationMap, setAnimalLocationMap] = useState<AnimalLocationMap>({ ...initialState });
  const [generatorVal, setGeneratorVal] = useState<number | null>(null);
  const [calculatorVal, setCalculatorVal] = useState<number | null>(null);

  const moveAnimal = (newLocation: animalLocation) => (position: number, movedBy: player) => {
    const updated = { ...animalLocationMap, [position]: { location: newLocation, movedBy } };
    setAnimalLocationMap(updated);
  };

  const addAnimalToVehicle = moveAnimal(animalLocation.vehicle);
  const addAnimalToHome = moveAnimal(animalLocation.home);

  const aiMove = (count: number) => {
    let updatedCount = 0;
    let updated: AnimalLocationMap = JSON.parse(JSON.stringify(animalLocationMap));
    for (let i of arrayOfTen) {
      if (updated[i].location === animalLocation.home) {
        updated[i].location = animalLocation.vehicle;
        updatedCount++;
        if (updatedCount === count) {
          break;
        }
      }
    }
    setAnimalLocationMap(updated);
  };

  const getRandom = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  const generatorClicked = () => {
    if (!generatorVal) {
      const val = getRandom(9);
      setGeneratorVal(val);
      setTimeout(() => aiMove(val), 2000);
    }
  };

  const submitCalcVal = () => {
    console.log('submitting');
    return;
  };

  return (
    <AppWrapper>
      <Row>
        <Vehicle animalLocationMap={animalLocationMap} addAnimalToVehicle={addAnimalToVehicle} />
        <NumberGenerator generatorClicked={generatorClicked} generatorVal={generatorVal} />
      </Row>
      <Row>
        <AnimalHome animalLocationMap={animalLocationMap} addAnimalToHome={addAnimalToHome} />
        <Calculator calculatorVal={calculatorVal} setCalculatorVal={setCalculatorVal} submitCalcValue={submitCalcVal} />
      </Row>
    </AppWrapper>
  );
};

export default App;
