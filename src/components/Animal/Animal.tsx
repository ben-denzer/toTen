import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { seatWidth } from '../../styles';
import { itemTypes, animalLocation } from '../../types';

const triangleSize = seatWidth / 2 - 2;

interface WrapperProps {
  shouldShow: boolean;
}
const AnimalWrapper = styled.div<WrapperProps>`
  visibility: ${(p) => (p.shouldShow ? 'visible' : 'hidden')};
  width: 0;
  height: 0;
  border-left: ${triangleSize}px solid transparent;
  border-right: ${triangleSize}px solid transparent;

  border-bottom: ${triangleSize}px solid black;
`;

interface Props {
  key: number;
  location: animalLocation;
  position: number;
  shouldShow: boolean;
}

const Animal: React.FC<Props> = ({ location, position, shouldShow }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: itemTypes.animal, location, position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return <AnimalWrapper ref={shouldShow ? drag : null} shouldShow={shouldShow} />;
};

export default Animal;
