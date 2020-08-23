import React from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { seatWidth, seatBorderWidth, seatPadding } from '../../styles';
import { itemTypes, AnimalDragObj, animalLocation, AnimalLocationMap } from '../../types';
import Animal from '../Animal';
import { arrayOfTen } from '../../config';

const Seat = styled.div`
  width: ${seatWidth}px;
  height: ${seatWidth}px;
  border: ${seatBorderWidth}px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const gridWidth = seatWidth * 5 + seatBorderWidth * 10 + seatPadding * 10;

const VehicleWrapper = styled.div`
  height: 100px;
  width: 500px;
  border: 1px solid black;
  display: flex;
`;

interface Props {
  addAnimalToVehicle: (position: number) => void;
  animalLocationMap: AnimalLocationMap;
}

const Vehicle: React.FC<Props> = ({ addAnimalToVehicle, animalLocationMap }) => {
  const [, drop] = useDrop({
    accept: itemTypes.animal,
    drop: (e: AnimalDragObj) => {
      addAnimalToVehicle(e.position);
    },
  });

  return (
    <VehicleWrapper ref={drop}>
      {arrayOfTen.map((itemNumber: number) => {
        const shouldShowInVehicle = animalLocationMap[itemNumber] === animalLocation.vehicle;
        return (
          <Seat>
            <Animal
              key={itemNumber}
              location={animalLocation.vehicle}
              position={itemNumber}
              shouldShow={shouldShowInVehicle}
            />
          </Seat>
        );
      })}
    </VehicleWrapper>
  );
};

export default Vehicle;
