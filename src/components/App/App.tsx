import React, { useState } from 'react';
import styled from 'styled-components';
import Vehicle from '../Vehicle';
import { animalLocation, AnimalLocationMap } from '../../types';
import { arrayOfTen } from '../../config';
import AnimalHome from '../AnimalHome';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const initialState: AnimalLocationMap = arrayOfTen.reduce((acc, cur) => {
  return { ...acc, [cur]: animalLocation.home };
}, {});

const App: React.FC<{}> = () => {
  const [animalLocationMap, setAnimalLocationMap] = useState<AnimalLocationMap>({ ...initialState });
  const moveAnimal = (newLocation: animalLocation) => (position: number) => {
    console.log(`Moving ${position} to ${newLocation}`);
    const updated = { ...animalLocationMap, [position]: newLocation };
    setAnimalLocationMap(updated);
  };
  const addAnimalToVehicle = moveAnimal(animalLocation.vehicle);
  const addAnimalToHome = moveAnimal(animalLocation.home);

  return (
    <AppWrapper>
      <Vehicle animalLocationMap={animalLocationMap} addAnimalToVehicle={addAnimalToVehicle} />
      <AnimalHome animalLocationMap={animalLocationMap} addAnimalToHome={addAnimalToHome} />
    </AppWrapper>
  );
};

export default App;
