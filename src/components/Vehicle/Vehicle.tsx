import React from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { Seat, AnimalContainerMixin, seatWidth } from '../../styles';
import { itemTypes, AnimalDragObj, animalLocation, AnimalLocationMap, player } from '../../types';
import Animal from '../Animal';
import { arrayOfTen } from '../../config';
import { getAnimalsOnVehicleCount } from '../../utils';

const VehicleWrapper = styled.div`
  ${AnimalContainerMixin};
  display: flex;
  flex-flow: column wrap;
  height: ${seatWidth * 2 + 10}px;
`;

interface Props {
  addAnimalToVehicle: (position: number, movedBy: player) => void;
  animalLocationMap: AnimalLocationMap;
  canDrag: boolean;
}

const Vehicle: React.FC<Props> = ({ addAnimalToVehicle, animalLocationMap, canDrag }) => {
  const [, drop] = useDrop({
    accept: itemTypes.animal,
    drop: (e: AnimalDragObj) => {
      addAnimalToVehicle(e.position, player.user);
    },
  });

  const animalsOnVehicle = getAnimalsOnVehicleCount(animalLocationMap);
  return (
    <VehicleWrapper ref={canDrag ? drop : null}>
      {arrayOfTen.map((itemNumber: number, i: number) => {
        const shouldShowInVehicle = itemNumber < animalsOnVehicle;
        return (
          <Seat location={animalLocation.vehicle} key={itemNumber}>
            <Animal
              location={animalLocation.vehicle}
              position={itemNumber}
              shouldShow={shouldShowInVehicle}
              canDrag={canDrag}
            />
          </Seat>
        );
      })}
    </VehicleWrapper>
  );
};

export default Vehicle;
