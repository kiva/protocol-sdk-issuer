import React from 'react';
import RightHandPrint from './assets/righthandprint.svg';
import LeftHandPrint from './assets/lefthandprint.svg';

export interface HandprintProps {
  hand: string
}

export const Handprint: React.FC<HandprintProps> = ({ 
  hand
 }) => {
  switch (hand) {
    case 'right':
      return (
        <img src={RightHandPrint} alt="plugin" />
      )
    case 'left':
      return (
        <img src={LeftHandPrint} alt="plugin" />    
      )
    default:
      return (
        <img src={RightHandPrint} alt="plugin" /> 
      );
  }
}
