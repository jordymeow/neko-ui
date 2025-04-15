// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoTypo, NekoInput, NekoTextArea } from '../../index';

import { NekoForm } from './Form';

export default {
  title: 'Components/Form',
  component: NekoForm,
  parameters: {
    componentSubtitle: 'The NekoForm!'
  },
  argTypes: {
    // no argTypes
  },
};

const Template = ({ ...args }) => (
  <NekoForm {...args}>
    <NekoTypo label>Title</NekoTypo>
    <NekoInput autoFocus id="title" name="title" placeholder="title" />
    <NekoTypo label>Description</NekoTypo>
    <NekoTextArea id="description" name="description" placeholder="description" />
  </NekoForm>
);
export const Default = Template.bind({});

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <Default />
    </>
  );
};

