// Previous: none
// Current: 0.0.0

import React from 'react';
import { action } from '@storybook/addon-actions';

import { NekoButton, NekoTypo, NekoSpacer } from "../../index";

import { NekoSideTabs, NekoSideTab } from './SideTabs';

export default {
  title: 'Components/SideTabs',
  component: NekoSideTabs,
  parameters: {
    componentSubtitle: 'The NekoSideTabs!'
  },
  subcomponents: { NekoSideTab },
  argTypes: {
    onChange: { control: 'function', description: 'The callback when tab is changed.' },
    isPro: { control: 'boolean', description: 'Set the tab to be pro only.' },
  },
};

const Template = ({ children, ...args}) => <NekoSideTabs {...args}>
  {
    children.map((child, index) => <NekoSideTab key={index} {...child} />)
  }
  </NekoSideTabs>;

export const Default = Template.bind({});
Default.args = {
  onChange: action('onChange'),
  isPro: false,
  children: [
    { title: 'First tab', children: 'Hello, I am the content of the first tab' },
    { title: 'Second tab', children: 'Hello, I am the content of the second tab' },
    { title: 'Pro tab', children: 'Hello, I am the content of the pro tab', requirePro: true },
  ],
};

const ProUser = () => (
  <NekoSideTabs onChange={action('onChange')} isPro={true}>
    <NekoSideTab title='First tab'>
      Hello, I am the content of the first tab
    </NekoSideTab>
    <NekoSideTab title='Second tab'>
      Hello, I am the content of the second tab
    </NekoSideTab>
    <NekoSideTab title='Pro tab' requirePro={true}>
      Hello, I am the content of the pro tab
    </NekoSideTab>
  </NekoSideTabs>
);

const RightActions = () => (
  <NekoSideTabs onChange={action('onChange')}>
    <NekoSideTab title='First tab has RightActions' rightActions={<NekoButton className="secondary">Custom</NekoButton>}>
      Hello, I am the content of the first tab
    </NekoSideTab>
    <NekoSideTab title='Second tab'>
      Hello, I am the content of the second tab
    </NekoSideTab>
    <NekoSideTab title='Pro tab' requirePro={true}>
      Hello, I am the content of the pro tab
    </NekoSideTab>
  </NekoSideTabs>
);

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoSideTabs onChange={action('onChange')}>
        <NekoSideTab title='First tab'>
          Hello, I am the content of the first tab
        </NekoSideTab>
        <NekoSideTab title='Second tab'>
          Hello, I am the content of the second tab
        </NekoSideTab>
        <NekoSideTab title='Pro tab' requirePro={true}>
          Hello, I am the content of the pro tab
        </NekoSideTab>
      </NekoSideTabs>

      <NekoSpacer />

      <NekoTypo h3>Pro User</NekoTypo>
      <ProUser />

      <NekoSpacer />

      <NekoTypo h3>Right Actions</NekoTypo>
      <RightActions />
    </>
  )
}
