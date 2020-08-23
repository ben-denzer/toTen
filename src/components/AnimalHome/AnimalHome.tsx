import React from 'react';
import styled from 'styled-components';
import { arrayOfTen } from '../../config';
import { animalLocation, AnimalLocationMap } from '../../types';
import Animal from '../Animal';

const AnimalHomeWrapper = styled.div``;

interface Props {
  animalLocationMap: AnimalLocationMap;
  addAnimalToHome: (position: number) => void;
}

const AnimalHome: React.FC<Props> = ({ animalLocationMap }) => {
  return (
    <AnimalHomeWrapper>
      {arrayOfTen.map((itemNumber: number) => {
        const shouldShowInHome = animalLocationMap[itemNumber] === animalLocation.home;
        return (
          <Animal key={itemNumber} location={animalLocation.home} position={itemNumber} shouldShow={shouldShowInHome} />
        );
      })}
    </AnimalHomeWrapper>
  );
};

export default AnimalHome;
