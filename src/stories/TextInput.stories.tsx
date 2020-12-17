import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { TextInput, TextInputProps } from './TextInput';

export default {
  title: 'Example/TextInput',
  component: TextInput,
} as Meta;

const Template: Story<TextInputProps> = (args) => <TextInput {...args} />;

export const Input = Template.bind({});
Input.args = {
  valid: true
};
