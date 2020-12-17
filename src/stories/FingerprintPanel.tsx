import React from 'react';
import FingerprintPanelSvg from './assets/fingerprint.svg';
import FingerprintPanelSuccessSvg from './assets/fingerprintsuccess.svg';


export interface FingerprintPanelProps {
  variant: string
}

export const FingerprintPanel: React.FC<FingerprintPanelProps> = ({ 
  variant
 }) => {
  switch (variant) {
    case 'success':
      return (
        <img src={FingerprintPanelSuccessSvg} alt="plugin" />
      )
    case 'default':
      return (
        <img src={FingerprintPanelSvg} alt="plugin" />    
      )
    default:
      return (
        <img src={FingerprintPanelSvg} alt="plugin" /> 
      );
  }
}
