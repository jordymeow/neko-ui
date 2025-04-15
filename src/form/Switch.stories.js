// Previous: none
// Current: 0.0.0

import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { NekoTypo, NekoSpacer } from '../../index';

import { NekoSwitch } from './Switch';

export default {
  title: 'Components/Switch',
  parameters: {
    componentSubtitle: 'The NekoSwitch!'
  },
  subcomponents: { NekoSwitch },
  argTypes: {
    onLabel: { control: 'text', description: 'The label of the on state.' },
    offLabel: { control: 'text', description: 'The label of the off state.' },
    onValue: { control: 'text', description: 'The value of the on state.' },
    offValue: { control: 'text', description: 'The value of the off state.' },
    width: { control: 'text', description: 'The width of the switch.' },
    height: { control: 'text', description: 'The height of the switch.' },
    fontSize: { control: 'text', description: 'The font size of the switch.' },
    onBackgroundColor: { control: 'color', description: 'The background color of the on state.' },
    offBackgroundColor: { control: 'color', description: 'The background color of the off state.' },
    checked: { control: 'boolean', description: 'Set the switch to be checked.' },
    disabled: { control: 'boolean', description: 'Set the switch to be disabled.' },
    onChange: { action: 'onChange', description: 'The action to perform when the switch is changed.' },
  },
};

const Template = (args) => <NekoSwitch {...args} />
export const Default = Template.bind({});
Default.args = {
  onLabel: 'ON',
  offLabel: 'OFF',
  onValue: 'on',
  offValue: 'off',
  width: '100px',
  height: '34px',
  fontSize: '16px',
  onBackgroundColor: `var(--neko-main-color)`,
  offBackgroundColor: `var(--neko-gray-60)`,
  onChange: action('onChange'),
  checked: false,
};

export const Sample = () => {
  const [ checked, setChecked ] = useState(false);
  const [ checkedDisabledOne, setCheckedDisabledOne ] = useState(true);

  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoSwitch
        onLabel="ON"
        offLabel="OFF"
        onValue="on"
        offValue="off"
        width="100px"
        height="34px"
        fontSize="16px"
        onBackgroundColor={`var(--neko-main-color)`}
        offBackgroundColor={`var(--neko-gray-60)`}
        onChange={(value) => setChecked(value === "on")}
        checked={checked}
      />

      <NekoSpacer />

      <NekoTypo h3>Disabled</NekoTypo>
      <NekoSwitch
        onLabel="ON"
        offLabel="OFF"
        onValue="on"
        offValue="off"
        width="100px"
        height="34px"
        fontSize="16px"
        onBackgroundColor={`var(--neko-main-color)`}
        offBackgroundColor={`var(--neko-gray-60)`}
        onChange={(value) => setCheckedDisabledOne(value === "on")}
        checked={checkedDisabledOne}
        disabled={true}
      />
    </>
  );
}
