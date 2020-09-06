import styled from 'styled-components';
import { animalLocation } from '../types';

export const seatWidth = 100;
export const seatBorderWidth = 1;
export const seatPadding = 0;
export const tabletBreakpoint = 900;
export const calcWidth = 175;

interface SeatProps {
  location: animalLocation;
}
export const Seat = styled.div<SeatProps>`
  width: ${seatWidth}px;
  height: ${seatWidth}px;
  border: ${(p) => (p.location === animalLocation.home ? 'none' : seatBorderWidth + 'px solid black')};
  border-left: none;
  border-bottom: none;
  display: flex;
  justify-content: center;
  align-items: center;

  &:nth-child(1),
  &:nth-child(2) {
    border-left: ${(p) => (p.location === animalLocation.home ? 'none' : seatBorderWidth + 'px solid black')};
  }

  &:nth-child(even) {
    border-bottom: ${(p) => (p.location === animalLocation.home ? 'none' : seatBorderWidth + 'px solid black')};
  }
`;

export const AnimalContainerMixin = `
  width: 50%;
  max-width: 500px;
  @media (max-width: ${tabletBreakpoint}px) {
    width: 90%;
  }
`;

export const rightPanelContainer = `
  width: 200px;
`;
