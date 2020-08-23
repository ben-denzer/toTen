import React from 'react';
import styled from 'styled-components';
import { arrayOfTen } from '../../config';
import { animalLocation, AnimalLocationMap, player } from '../../types';
import Animal from '../Animal';
import { Seat } from '../../styles';

const AnimalHomeWrapper = styled.div``;

interface Props {
  animalLocationMap: AnimalLocationMap;
  addAnimalToHome: (position: number, movedBy: player) => void;
}

const AnimalHome: React.FC<Props> = ({ animalLocationMap }) => {
  return (
    <AnimalHomeWrapper>
      {arrayOfTen.map((itemNumber: number) => {
        const shouldShowInHome = animalLocationMap[itemNumber].location === animalLocation.home;
        return (
          <Seat key={itemNumber} location={animalLocation.home}>
            <Animal location={animalLocation.home} position={itemNumber} shouldShow={shouldShowInHome} />
          </Seat>
        );
      })}
    </AnimalHomeWrapper>
  );
};

export default AnimalHome;
