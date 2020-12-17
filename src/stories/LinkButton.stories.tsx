import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { LinkButton, LinkButtonProps } from './LinkButton';

export default {
  title: 'Example/LinkButton',
  component: LinkButton,
} as Meta;

const Template: Story<LinkButtonProps> = (args) => <LinkButton {...args} />;

export const ComboLinkButton = Template.bind({});
ComboLinkButton.args = {
};

