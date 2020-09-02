import React from 'react';
import styled from 'styled-components';
import { arrayOfTen } from '../../config';
import { animalLocation, AnimalLocationMap, player } from '../../types';
import Animal from '../Animal';
import { Seat, seatWidth, seatPadding, AnimalContainerMixin } from '../../styles';
import trainStation from '../../img/station.png';

const AnimalHomeWrapper = styled.div`
  ${AnimalContainerMixin}
  height: 300px;
  background-image: url(${trainStation});
  background-size: contain;
  background-repeat: no-repeat;
`;

const HomeSeatWrapper = styled.div`
  width: ${(seatWidth + seatPadding * 2) * 5}px;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  bottom: 5px;
  z-index: 1;
`;

interface Props {
  animalLocationMap: AnimalLocationMap;
  addAnimalToHome: (position: number, movedBy: player) => void;
}

const AnimalHome: React.FC<Props> = ({ animalLocationMap }) => {
  return (
    <AnimalHomeWrapper>
      {/* <BackgroundImg src={trainStation} draggable={false} /> */}
      <HomeSeatWrapper>
        {arrayOfTen.map((itemNumber: number) => {
          const shouldShowInHome = animalLocationMap[itemNumber].location === animalLocation.home;
          return (
            <Seat key={itemNumber} location={animalLocation.home}>
              <Animal location={animalLocation.home} position={itemNumber} shouldShow={shouldShowInHome} />
            </Seat>
          );
        })}
      </HomeSeatWrapper>
    </AnimalHomeWrapper>
  );
};

export default AnimalHome;
