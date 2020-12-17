import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Handprint, HandprintProps } from './Handprint';

export default {
  title: 'Example/Handprint',
  component: Handprint,
} as Meta;

const Template: Story<HandprintProps> = (args) => <Handprint {...args} />;

export const Right = Template.bind({});
Right.args = {
  hand: 'right'
};

export const Left = Template.bind({});
Left.args = {
  hand: 'left'
};


