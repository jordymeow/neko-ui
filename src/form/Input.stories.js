// Previous: none
// Current: 0.0.0

import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { NekoTypo, NekoSpacer } from '../../index';

import { NekoInput } from './Input';

export default {
  title: 'Components/Input',
  component: NekoInput,
  parameters: {
    componentSubtitle: 'The NekoInput!'
  },
  argTypes: {
    name: { control: 'text', description: 'The name of the input.' },
    value: { control: 'text', description: 'The value of the input.' },
    placeholder: { control: 'text', description: 'The placeholder of the input.' },
    description: { control: 'text', description: 'The description of the input.' },
    type: { control: 'select', options: ['text', 'number', 'password'], description: 'The type of the input.' },
    readOnly: { control: 'boolean', description: 'Set the input to be read only.' },
    isCommaSeparatedArray: { control: 'boolean', description: 'Set the input to be comma separated array.' },
    disabled: { control: 'boolean', description: 'Set the input to be disabled.' },
  },
};

const Template = (args) => <NekoInput {...args} />
export const Default = Template.bind({});
Default.args = {
  name: 'neko',
  value: '',
  placeholder: 'Type your text here...',
  description: 'There is usually a little explanation about what it does.',
  onBlur: action('onBlur'),
  readOnly: false,
  isCommaSeparatedArray: false,
  disabled: false,
  type: 'text',
};

export const Sample = () => {
  const [value, setValue] = useState('');
  const [valueToBeSeparated, setValueToBeSeparated ] = useState([]);

  return (
    <>
      <NekoInput name="neko" value="" placeholder="Type your text here..." onBlur={action('onBlur')} />

      <NekoSpacer />

      <NekoInput name="neko" value="" type="number" placeholder="Number input" onBlur={action('onBlur')} />

      <NekoSpacer />

      <NekoInput name="neko" value="" placeholder="Type your text here..." description="Description example. There is usually a little explanation about what it does." onBlur={action('onBlur')} />

      <NekoSpacer />

      <NekoInput name="neko" value="" placeholder="Type your text here..." description="Read only input" readOnly={true} />

      <NekoSpacer />

      <NekoInput name="neko" value={value} placeholder="Type your text here..." description="Input something, then you can see the remove 'x' icon on the right side." onChange={(v) => setValue(v)} onReset={() => setValue("")} />

      <NekoSpacer />

      <NekoInput name="neko" value={valueToBeSeparated} placeholder="Type your text here..." description="Input something, and then insert commas." onChange={(v) => setValueToBeSeparated(v)} onReset={() => setValueToBeSeparated([])} isCommaSeparatedArray />
      <NekoTypo p>The value is: [{valueToBeSeparated.join(',')}]</NekoTypo>
    </>
  );
};

