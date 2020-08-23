import styled from 'styled-components';
import { animalLocation } from '../types';

export const seatWidth = 50;
export const seatBorderWidth = 1;
export const seatPadding = 0;

interface SeatProps {
  location: animalLocation;
}
export const Seat = styled.div<SeatProps>`
  width: ${seatWidth}px;
  height: ${seatWidth}px;
  border: ${seatBorderWidth}px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
`;
