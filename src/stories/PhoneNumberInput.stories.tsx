import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { PhoneNumberInput, PhoneNumberInputProps } from './PhoneNumberInput';

export default {
  title: 'Example/PhoneNumberInput',
  component: PhoneNumberInput,
} as Meta;

const Template: Story<PhoneNumberInputProps> = (args) => <PhoneNumberInput {...args} />;

export const ComboDropdown = Template.bind({});
ComboDropdown.args = {
};

