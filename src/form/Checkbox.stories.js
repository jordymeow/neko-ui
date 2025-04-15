// Previous: none
// Current: 0.0.0

import React from 'react';
import { action } from '@storybook/addon-actions';

import { NekoTypo, NekoSpacer } from '../../index';

import { NekoCheckbox } from './Checkbox';
import { NekoCheckboxGroup } from './CheckboxGroup';

export default {
  title: 'Components/Checkbox',
  component: NekoCheckboxGroup,
  parameters: {
    componentSubtitle: 'The NekoCheckbox!'
  },
  subcomponents: { NekoCheckbox },
  argTypes: {
    label: { control: 'text', description: 'The label of the checkbox.' },
    description: { control: 'text', description: 'The description of the checkbox.' },
    checked: { control: 'boolean', description: 'Set the checkbox to be checked.' },
    indeterminate: { control: 'boolean', description: 'Set the checkbox to be indeterminate.' },
    small: { control: 'boolean', description: 'Set the checkbox to be small.' },
    disabled: { control: 'boolean', description: 'Set the checkbox to be disabled.' },
    isBusy: { control: 'boolean', description: 'Set the checkbox to be busy.' },
    isPro: { control: 'boolean', description: 'Set the checkbox to be pro.' },
    requirePro: { control: 'boolean', description: 'Set the checkbox to require pro.' },
    fullWidth: { control: 'boolean', description: 'Set the checkbox to be full width.' },
  },
};

const Template = (args) => <NekoCheckboxGroup>
  <NekoCheckbox {...args} />
</NekoCheckboxGroup>
export const Default = Template.bind({});
Default.args = {
  label: 'Enable',
  description: 'There is usually a little explanation about what it does.',
  onChange: action('onChange'),
};

export const Sample = () => {
  return (
    <>
      <NekoCheckboxGroup name="default-checkbox" max="1">
        <NekoCheckbox label="Enable (Pro Option)" description="There is usually a little explanation about what it does." requirePro={true} onChange={action('onChange')} />
        <NekoCheckbox checked label="Enable" description="There is usually a little explanation about what it does." onChange={action('onChange')} />
        <NekoCheckbox indeterminate label="Enable" description="There is usually a little explanation about what it does." onChange={action('onChange')} />
      </NekoCheckboxGroup>

      <NekoSpacer />

      <NekoTypo p>Pro User</NekoTypo>
      <NekoCheckboxGroup name="pro-user-checkbox" max="1" isPro={true}>
        <NekoCheckbox label="Enable (Pro Option)" description="There is usually a little explanation about what it does." requirePro={true} onChange={action('onChange')} />
        <NekoCheckbox checked label="Enable" description="There is usually a little explanation about what it does." onChange={action('onChange')} />
      </NekoCheckboxGroup>

      <NekoSpacer />

      <NekoTypo p>Busy</NekoTypo>
      <NekoCheckboxGroup name="busy-checkbox" max="1">
        <NekoCheckbox label="Enable (Pro Option)" description="There is usually a little explanation about what it does." requirePro={true} isBusy onChange={action('onChange')} />
        <NekoCheckbox checked label="Enable" description="There is usually a little explanation about what it does." onChange={action('onChange')} />
      </NekoCheckboxGroup>

      <NekoSpacer />

      <NekoTypo p>Small</NekoTypo>
      <NekoCheckboxGroup name="default-checkbox" max="1">
        <NekoCheckbox small label="Enable (Pro Option)" description="There is usually a little explanation about what it does." requirePro={true} onChange={action('onChange')} />
        <NekoCheckbox small checked label="Enable" description="There is usually a little explanation about what it does." onChange={action('onChange')} />
      </NekoCheckboxGroup>
    </>
  );
};
