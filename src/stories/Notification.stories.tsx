import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Notification, NotificationProps } from './Notification';

export default {
  title: 'Example/Notification',
  component: Notification,
} as Meta;

const Template: Story<NotificationProps> = (args) => <Notification {...args} />;

export const Success = Template.bind({});
Success.args = {
  variant: 'success'
};

export const Error = Template.bind({});
Error.args = {
  variant: 'error'
};

export const Info = Template.bind({});
Info.args = {
  variant: 'info'
};

