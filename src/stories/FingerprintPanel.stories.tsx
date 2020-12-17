import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { FingerprintPanel, FingerprintPanelProps } from './FingerprintPanel';

export default {
  title: 'Example/FingerprintPanel',
  component: FingerprintPanel,
} as Meta;

const Template: Story<FingerprintPanelProps> = (args) => <FingerprintPanel {...args} />;

export const Default = Template.bind({});
Default.args = {
  variant: 'default'
};

export const Success = Template.bind({});
Success.args = {
  variant: 'success'
};


