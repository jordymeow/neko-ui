// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoTooltip } from './Tooltip';

export default {
  title: 'Components/Tooltip',
  component: NekoTooltip,
  parameters: {
    componentSubtitle: 'The NekoTooltip!'
  },
  argTypes: {
    position: { control: 'select', options: ['top', 'right', 'bottom', 'left'], description: 'The position of the tooltip.' },
    children: { description: 'Content placed inside the tooltip.' },
  },
};

const Template = ({ children, ...args }) => <NekoTooltip {...args}>{children}</NekoTooltip>;

export const Default = Template.bind({});
Default.args = {
  position: 'top',
  children: 'Tooltip',
};

export const Sample = () => {
  return (
    <>
      <div style={{ padding: '100px 300px' }}><NekoTooltip>hover here!</NekoTooltip></div>
      <div style={{ padding: '100px 300px' }}><NekoTooltip position="top">hover here: Show Top!</NekoTooltip></div>
      <div style={{ padding: '100px 300px' }}><NekoTooltip position="right">hover here: Show Right!</NekoTooltip></div>
      <div style={{ padding: '100px 300px' }}><NekoTooltip position="bottom">hover here: Show Bottom!</NekoTooltip></div>
      <div style={{ padding: '100px 300px' }}><NekoTooltip position="left">hover here: Show Left!</NekoTooltip></div>
    </>
  );
}
