// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoTypo } from '../../index';

import { NekoWindow } from './Window';

export default {
  title: 'Layout/Window',
  component: NekoWindow,
  parameters: {
    componentSubtitle: 'The NekoWindow!'
  },
  argTypes: {
    title: { control: 'text', description: 'The title of the window.' },
  },
};

const Template = ({ children, ...args }) => <NekoWindow {...args}>
  {children}
</NekoWindow>

export const Default = Template.bind({});
Default.args = {
  title: 'Window Title',
  children: <p>Window Content</p>,
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <Default {...Default.args} />
    </>
  );
};
