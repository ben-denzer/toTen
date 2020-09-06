import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { seatWidth } from '../../styles';
import { itemTypes, animalLocation } from '../../types';
import snake from '../../img/snake.png';

interface WrapperProps {
  canDrag: boolean;
  shouldShow: boolean;
}
const AnimalWrapper = styled.img<WrapperProps>`
  visibility: ${(p) => (p.shouldShow ? 'visible' : 'hidden')};
  width: ${seatWidth}px;
  height: ${seatWidth}px;
  cursor: ${(p) => (p.canDrag ? 'pointer' : 'default')};
`;

interface Props {
  canDrag: boolean;
  location: animalLocation;
  position: number;
  shouldShow: boolean;
}

const Animal: React.FC<Props> = ({ location, position, shouldShow, canDrag }) => {
  const [, drag] = useDrag({
    item: { type: itemTypes.animal, location, position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return <AnimalWrapper src={snake} ref={shouldShow ? drag : null} shouldShow={shouldShow} canDrag={canDrag} />;
};

export default Animal;
