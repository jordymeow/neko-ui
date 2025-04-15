// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoButton, NekoTypo, NekoSpacer } from "../../index";

import { NekoToolbar } from './Toolbar';

export default {
  title: 'Components/Toolbar',
  component: NekoToolbar,
  parameters: {
    componentSubtitle: 'The NekoToolbar!'
  },
  argTypes: {
    align: { control: 'select', description: 'The alignment of the toolbar.', options: ['left', 'right'] },
  },
};

const Template = ({ children, ...args }) => (
  <NekoToolbar {...args}>
    {children}
  </NekoToolbar>
);

export const Default = Template.bind({});
Default.args = {
  align: 'left',
  children: <NekoButton variant="primary">Sync Extensions</NekoButton>,
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoToolbar>
        <NekoButton variant="primary">Sync Extensions</NekoButton>
        <NekoButton variant="danger">Reset Extensions</NekoButton>
        <NekoButton variant="primary">Clean DB</NekoButton>
      </NekoToolbar>

      <NekoSpacer />

      <NekoTypo h3>Align Right</NekoTypo>
      <NekoToolbar align="right">
        <NekoButton variant="primary">Sync Extensions</NekoButton>
        <NekoButton variant="danger">Reset Extensions</NekoButton>
        <NekoButton variant="primary">Clean DB</NekoButton>
      </NekoToolbar>
    </>
  );
};
