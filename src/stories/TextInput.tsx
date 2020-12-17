import React from 'react';
import './textinput.css';
import TextInputSvg from './assets/textinput.svg';
import ErrorTextInputSvg from './assets/errortextinput.svg';

export interface TextInputProps {
  valid: boolean
}

export const TextInput: React.FC<TextInputProps> = ({ 
  valid
 }) => (
  <img src={valid ? TextInputSvg : ErrorTextInputSvg} alt="plugin" />
);
