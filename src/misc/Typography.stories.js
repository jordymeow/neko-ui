// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoTypo } from './Typography';

export default {
  title: 'Components/Typography',
  component: NekoTypo,
  parameters: {
    componentSubtitle: 'The NekoTypo!'
  },
  argTypes: {
    h1: { control: 'boolean', description: 'Set the typography to be h1.' },
    h2: { control: 'boolean', description: 'Set the typography to be h2.' },
    h3: { control: 'boolean', description: 'Set the typography to be h3.' },
    h4: { control: 'boolean', description: 'Set the typography to be h4.' },
    h5: { control: 'boolean', description: 'Set the typography to be h5.' },
    h6: { control: 'boolean', description: 'Set the typography to be h6.' },
    p: { control: 'boolean', description: 'Set the typography to be p.' },
    label: { control: 'boolean', description: 'Set the typography to be label.' },
    children: { description: 'Content placed inside the typography.' },
  },
};

const Template = ({ children, ...args }) => <NekoTypo {...args}>{children}</NekoTypo>;

export const Default = Template.bind({});
Default.args = {
  h1: false,
  h2: false,
  p: false,
  label: false,
  children: 'Typography Text',
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h1>header 1 Text</NekoTypo>
      <NekoTypo h2>header 2 Text</NekoTypo>
      <NekoTypo h3>header 3 Text</NekoTypo>
      <NekoTypo h4>header 4 Text</NekoTypo>
      <NekoTypo h5>header 5 Text</NekoTypo>
      <NekoTypo h6>header 6 Text</NekoTypo>
      <NekoTypo p>Paragragh Text</NekoTypo>
      <NekoTypo label>Label Text</NekoTypo>
      <br />
      <NekoTypo>Span Text (Default)</NekoTypo>
    </>
  );
};
