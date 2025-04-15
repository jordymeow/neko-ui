// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoTypo } from '../../index';

import { ProOnly } from './ProOnly';

export default {
  title: 'Components/ProOnly',
  component: ProOnly,
  parameters: {
    componentSubtitle: 'The ProOnly label!'
  },
  argTypes: {
    show: { control: 'boolean', description: 'Set the label to be shown.' },
    className: { control: 'text', description: 'The class name of the label.' },
  },
};

const Template = (args) => <ProOnly {...args} />
export const Default = Template.bind({});
Default.args = {
  show: true,
  className: '',
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <Default {...Default.args} />
    </>
  );
};

