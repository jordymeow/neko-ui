// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoButton, NekoTypo, NekoSpacer } from '../../index';

import { NekoHeader } from './Header';

export default {
  title: 'Components/Header',
  component: NekoHeader,
  parameters: {
    componentSubtitle: 'The NekoHeader!'
  },
  argTypes: {
    title: { control: 'text', description: 'The title of the header.' },
    subtitle: { control: 'text', description: 'The subtitle of the header.' },
    saving: { control: 'boolean', description: 'Set the header to be saving.' },
    children: { description: 'Content placed inside the header.' },
  },
};

const Template = ({ children, ...args }) => <NekoHeader {...args}/>

export const Default = Template.bind({});
Default.args = {
  title: 'Header Title',
  subtitle: 'Header Subtitle',
  saving: false,
  children: <NekoButton>Button</NekoButton>,
};


export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoHeader />

      <NekoSpacer />
      <NekoTypo h3>Saving</NekoTypo>
      <NekoHeader saving={true} />
    </>
  );
};
