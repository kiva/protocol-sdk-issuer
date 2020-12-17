import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { QrPanel, QrPanelProps } from './QrPanel';

export default {
  title: 'Example/QrPanel',
  component: QrPanel,
} as Meta;

const Template: Story<QrPanelProps> = (args) => <QrPanel {...args} />;

export const ComboQrPanel = Template.bind({});
ComboQrPanel.args = {
  success: false
};

