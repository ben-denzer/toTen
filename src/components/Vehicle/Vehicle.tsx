import React from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { seatWidth, seatBorderWidth, seatPadding, Seat } from '../../styles';
import { itemTypes, AnimalDragObj, animalLocation, AnimalLocationMap, animalConfig, player } from '../../types';
import Animal from '../Animal';
import { arrayOfTen } from '../../config';
import { getAnimalsOnVehicleCount } from '../../utils';

const gridWidth = seatWidth * 5 + seatBorderWidth * 10 + seatPadding * 10;

const VehicleWrapper = styled.div`
  height: 100px;
  width: 500px;
  border: 1px solid black;
  display: flex;
`;

interface Props {
  addAnimalToVehicle: (position: number, movedBy: player) => void;
  animalLocationMap: AnimalLocationMap;
}

const Vehicle: React.FC<Props> = ({ addAnimalToVehicle, animalLocationMap }) => {
  const [, drop] = useDrop({
    accept: itemTypes.animal,
    drop: (e: AnimalDragObj) => {
      addAnimalToVehicle(e.position, player.user);
    },
  });

  const animalsOnVehicle = getAnimalsOnVehicleCount(animalLocationMap);
  return (
    <VehicleWrapper ref={drop}>
      {arrayOfTen.map((itemNumber: number, i: number) => {
        const shouldShowInVehicle = itemNumber < animalsOnVehicle;
        return (
          <Seat location={animalLocation.vehicle} key={itemNumber}>
            <Animal location={animalLocation.vehicle} position={itemNumber} shouldShow={shouldShowInVehicle} />
          </Seat>
        );
      })}
    </VehicleWrapper>
  );
};

export default Vehicle;
