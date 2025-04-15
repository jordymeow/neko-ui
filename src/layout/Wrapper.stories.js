// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoTypo, NekoSpacer } from '../../index';

import { NekoWrapper, NekoColumn } from './Wrapper';

export default {
  title: 'Layout/Wrapper',
  component: NekoWrapper,
  parameters: {
    componentSubtitle: 'The NekoWrapper!'
  },
  subcomponents: { NekoColumn },
  argTypes: {
    fullWidth: { control: 'boolean', description: 'Set the column to be full width.' },
  }
};

const Template = ({ children, ...args }) => (
  <NekoWrapper {...args}>
    {children}
  </NekoWrapper>
);

export const Default = Template.bind({});
Default.args = {
  children: <>
    <NekoColumn>Our second column</NekoColumn>
    <NekoColumn>Our third column</NekoColumn>
  </>,
  fullWidth: false,
};

const FullWidth = () => (
  <NekoWrapper>
    <NekoColumn fullWidth>Our first column (set FullWidth)</NekoColumn>
    <NekoColumn>Our second column</NekoColumn>
    <NekoColumn>Our third column</NekoColumn>
    <NekoColumn fullWidth>Our fourth column (set FullWidth)</NekoColumn>
    <NekoColumn fullWidth>Our fifth column (set FullWidth)</NekoColumn>
  </NekoWrapper>
);

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <Default {...Default.args} />

      <NekoSpacer />

      <NekoTypo h3>Neko Column Full Width</NekoTypo>
      <FullWidth />
    </>
  );
}
