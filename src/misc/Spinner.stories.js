// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoTypo, NekoSpacer } from "../../index";

import { NekoSpinner } from './Spinner';

export default {
  title: 'Components/Spinner',
  component: NekoSpinner,
  parameters: {
    componentSubtitle: 'The NekoSpinner!'
  },
  argTypes: {
    type: { control: 'select', options: ['circle'], description: 'The type of the spinner.' },
    color: { control: 'color', description: 'The color of the spinner.' },
    size: { control: 'text', description: 'The size of the spinner.' },
  },
};


const Template = ({ children, ...args }) => (
  <NekoSpinner {...args}>
    {children}
  </NekoSpinner>
);

export const Default = Template.bind({});
Default.args = {
  type: 'circle',
  color: '#000',
  size: '10%',
};

export const Sample = () => {
  return(
    <div style={{ width: '150px' }}>
      <NekoTypo h3>Default (Circle)</NekoTypo>
      <NekoSpinner />

      <NekoSpacer />

      <NekoTypo h3>Set Type Circle</NekoTypo>
      <NekoSpinner type="circle" />

      <NekoSpacer />

      <NekoTypo h3>Set Color</NekoTypo>
      <div style={{ backgroundColor: 'gray' }}><NekoSpinner color="#fff" /></div>

      <NekoSpacer />

      <NekoTypo h3>Set Size</NekoTypo>
      <NekoSpinner size="20%" />
    </div>
  );
}
