// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoCheckbox, NekoCheckboxGroup, NekoTypo, NekoSpacer } from '../../index';

import { NekoSettings } from './Settings';

export default {
  title: 'Layout/Settings',
  component: NekoSettings,
  parameters: {
    componentSubtitle: 'The NekoSettings!'
  },
  argTypes: {
    title: { control: 'text', description: 'The title of the settings.' },
    contentAlign: { control: 'select', description: 'The content alignment of the settings.', options: ['left', 'right'] },
    className: { control: 'text', description: 'The class name of the settings.' },
    style: {  description: 'The style of the settings.' },
    children: { description: 'Content placed inside the settings.' },
  },
};

const Template = ({ children, ...args }) => (
  <NekoSettings {...args}>
    {children}
  </NekoSettings>
);

export const Default = Template.bind({});

Default.args = {
  title: 'Settings Title',
  contentAlign: 'left',
  className: '',
  style: {},
  children: <NekoCheckboxGroup max={1}>
    <NekoCheckbox id="i"  label="Component1" description="There is usually a little explanation about what it does." />
    <NekoCheckbox checked id="ii" label="Component2" description="There is usually a little explanation about what it does." />
  </NekoCheckboxGroup>,
};

const ContentAlignRight = () => (
  <NekoSettings title="Settings Title" contentAlign="right">
    <NekoCheckboxGroup max={1}>
      <NekoCheckbox id="i"  label="Component1" description="There is usually a little explanation about what it does." />
      <NekoCheckbox checked id="ii" label="Component2" description="There is usually a little explanation about what it does." />
    </NekoCheckboxGroup>
  </NekoSettings>
);

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <Default {...Default.args} />

      <NekoSpacer />

      <NekoTypo h3>Content Align Right</NekoTypo>
      <ContentAlignRight />
    </>
  );
}
