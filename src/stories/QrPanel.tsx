import React from 'react';
import QrPanelSvg from './assets/qrpanel.svg';
import QrPanelSvgSuccess from './assets/qrpanelsuccess.svg';

export interface QrPanelProps {
  success: boolean
}

export const QrPanel: React.FC<QrPanelProps> = ({
  success
 }) => (
  <img src={success ? QrPanelSvgSuccess : QrPanelSvg} alt="plugin" />
 )
