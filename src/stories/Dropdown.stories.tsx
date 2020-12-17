import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Dropdown, DropdownProps } from './Dropdown';

export default {
  title: 'Example/Dropdown',
  component: Dropdown,
} as Meta;

const Template: Story<DropdownProps> = (args) => <Dropdown {...args} />;

export const ComboDropdown = Template.bind({});
ComboDropdown.args = {
};

