import React from 'react';
import NotificationError from './assets/notificationError.svg';
import NotificationSuccess from './assets/notificationSuccess.svg';
import NotificationInfo from './assets/notificationInfo.svg';


export interface NotificationProps {
  variant: string
}

export const Notification: React.FC<NotificationProps> = ({ 
  variant
 }) => {
  switch (variant) {
    case 'success':
      return (
        <img src={NotificationSuccess} alt="plugin" />
      )
    case 'error':
      return (
        <img src={NotificationError} alt="plugin" />    
      )
    case 'info':
      return (
        <img src={NotificationInfo} alt="plugin" />    
      )
    default:
      return (
        <img src={NotificationError} alt="plugin" /> 
      );
  }
}
