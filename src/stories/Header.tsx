import React from 'react';
import './header.css';
import TitleFont from './assets/titlefont.svg';

export interface HeaderProps {
}

export const Header: React.FC<HeaderProps> = ({  }) => (
  <img src={TitleFont} alt="plugin" />
);
