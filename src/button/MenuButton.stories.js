// Previous: none
// Current: 0.0.0

import React from 'react';
import { action } from '@storybook/addon-actions';

import { NekoSpacer } from '../../index';

import { NekoMenuButton, NekoMenuItem } from './MenuButton';

export default {
  title: 'Components/MenuButton',
  component: NekoMenuButton,
  parameters: {
    componentSubtitle: 'The NekoMenuButton!'
  },
  subcomponents: {NekoMenuItem},
  argTypes: {
    title: { control: 'text', description: 'The title of the button.' },
    disabled: { control: 'boolean', description: 'Set the button to be disabled.' },
  },
};

const Template = (args) => (
  <NekoMenuButton {...args}>
    <NekoMenuItem onClick={action('onClick 1')}>Action 1</NekoMenuItem>
    <NekoMenuItem requirePro={true} onClick={action('onClick 2')}>Action 2</NekoMenuItem>
  </NekoMenuButton>
);
export const Default = Template.bind({});
Default.args = {
  title: 'Advanced Actions',
};

export const Sample = () => {

  return (
    <>
      <NekoMenuButton title="Advanced Actions">
        <NekoMenuItem onClick={action('onClick 1')}>Action 1</NekoMenuItem>
        <NekoMenuItem requirePro={true} onClick={action('onClick 2')}>Action 2</NekoMenuItem>
      </NekoMenuButton>

      <NekoSpacer />

      <NekoMenuButton title="Disabled Actions" disabled={true} onClick={action('onClick')}>
        <NekoMenuItem onClick={action('onClick 1')}>Action 1</NekoMenuItem>
        <NekoMenuItem requirePro={true} onClick={action('onClick 2')}>Action 2</NekoMenuItem>
      </NekoMenuButton>

      <NekoSpacer />

      <NekoMenuButton title="Advanced Actions for Pro User" onClick={action('onClick')} isPro={true}>
        <NekoMenuItem onClick={action('onClick 1')}>Action 1</NekoMenuItem>
        <NekoMenuItem requirePro={true} onClick={action('onClick 2')}>Action 2</NekoMenuItem>
      </NekoMenuButton>

      <NekoSpacer />

      <NekoMenuButton title="Advanced Actions with Separator">
        <NekoMenuItem onClick={action('onClick 1')}>Action 1</NekoMenuItem>
        <NekoMenuItem onClick={action('onClick 2')}>Action 2</NekoMenuItem>
        <NekoMenuItem onClick={action('onClick something')} separator>Something Menu</NekoMenuItem>
      </NekoMenuButton>
    </>
  );
};

