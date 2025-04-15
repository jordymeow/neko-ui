// Previous: none
// Current: 0.0.0

import React, { useState, useEffect, useRef } from 'react';
import { action } from '@storybook/addon-actions';

import { NekoIcon, NekoTypo, NekoSpacer } from "../../index";

import { NekoTabs, NekoTab } from './Tabs';

export default {
  title: 'Components/Tabs',
  component: NekoTabs,
  parameters: {
    componentSubtitle: 'The NekoTabs!'
  },
  subcomponents: { NekoTab },
  argTypes: {
    onChange: { control: 'function', description: 'The callback when tab is changed.' },
    isPro: { control: 'boolean', description: 'Set the tab to be pro only.' },
    keepTabOnReload: { control: 'boolean', description: 'Set the tab to be kept on reload.' },
    action: { control: 'object', description: 'The action button.' },
    currentTab: { control: 'text', description: 'The current tab.' },
    callOnTabChangeFirst: { control: 'boolean', description: 'Set the callback to be called on tab change first.' },
  },
};

const Template = ({ children, ...args}) => <NekoTabs {...args}>
  {
    children.map((child, index) => <NekoTab key={index} {...child} />)
  }
  </NekoTabs>;

export const Default = Template.bind({});
Default.args = {
  onChange: action('onChange'),
  isPro: false,
  keepTabOnReload: false,
  action: <NekoIcon icon="cat" onClick={action('click')} />,
  currentTab: undefined,
  callOnTabChangeFirst: false,
  children: [
    { title: 'First tab', children: 'Hello, I am the content of the first tab' },
    { title: 'Second tab', children: 'Hello, I am the content of the second tab', icon: 'pencil' },
    { title: 'Pro tab', children: 'Hello, I am the content of the pro tab', requirePro: true },
  ],
};

const ProUser = () => (
  <NekoTabs onChange={action('onChange')} isPro={true}>
    <NekoTab title='First tab'>
      Hello, I am the content of the first tab
    </NekoTab>
    <NekoTab title='Second tab'>
      Hello, I am the content of the second tab
    </NekoTab>
    <NekoTab title='Pro tab' requirePro={true}>
      Hello, I am the content of the pro tab
    </NekoTab>
  </NekoTabs>
);

const KeepTabOnReload = () => (
  <NekoTabs onChange={action('onChange')} keepTabOnReload={true} =>
    <NekoTab title='First tab'>
      Hello, I am the content of the first tab
    </NekoTab>
    <NekoTab title='Second tab'>
      Hello, I am the content of the second tab
    </NekoTab>
    <NekoTab title='Pro tab' requirePro={true}>
      Hello, I am the content of the pro tab
    </NekoTab>
  </NekoTabs>
);

const Action = () => (
  <NekoTabs onChange={action('onChange')} action={<NekoIcon icon="cat" onClick={action('click')} />}>
    <NekoTab title='First tab'>
      Hello, I am the content of the first tab
    </NekoTab>
    <NekoTab title='Second tab' icon="pencil">
      Hello, I am the content of the second tab
    </NekoTab>
    <NekoTab title='Pro tab' requirePro={true}>
      Hello, I am the content of the pro tab
    </NekoTab>
  </NekoTabs>
);

const CurrentTab = () => {
  const [selected, setSelected] = useState('second-tab');
  return (
    <NekoTabs onChange={(tab) => { action('onChange')(tab); setSelected(tab); }} currentTab={selected}>
      <NekoTab title='First tab'>
        Hello, I am the content of the first tab
      </NekoTab>
      <NekoTab title='Second tab'>
        Hello, I am the content of the second tab. (Default tab)
      </NekoTab>
      <NekoTab title='Pro tab' requirePro={true}>
        Hello, I am the content of the pro tab
      </NekoTab>
    </NekoTabs>
  );
};

const CallOnTabChangeFirst = () => {
  const calledRef = useRef(false);
  return (
    <NekoTabs
      onChange={(tab) => {
        action('onChange')(tab);
        if (!calledRef.current) {
          calledRef.current = true;
          console.log('First callback');
        }
      }}
      callOnTabChangeFirst={true}
    >
      <NekoTab title='First tab'>
        Hello, I am the content of the first tab
      </NekoTab>
      <NekoTab title='Second tab'>
        Hello, I am the content of the second tab.
      </NekoTab>
      <NekoTab title='Pro tab' requirePro={true}>
        Hello, I am the content of the pro tab
      </NekoTab>
    </NekoTabs>
  );
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoTabs onChange={action('onChange')}>
        <NekoTab title='First tab'>
          Hello, I am the content of the first tab
        </NekoTab>
        <NekoTab title='Second tab' icon="pencil">
          Hello, I am the content of the second tab
        </NekoTab>
        <NekoTab title='Pro tab' requirePro={true}>
          Hello, I am the content of the pro tab
        </NekoTab>
      </NekoTabs>

      <NekoSpacer />

      <NekoTypo h3>Pro User</NekoTypo>
      <ProUser />

      <NekoSpacer />

      <NekoTypo h3>Keep Tab On Reload</NekoTypo>
      <KeepTabOnReload />

      <NekoSpacer />

      <NekoTypo h3>Action</NekoTypo>
      <Action />

      <NekoSpacer />

      <NekoTypo h3>Current Tab (Second tab is selected)</NekoTypo>
      <CurrentTab />

      <NekoSpacer />

      <NekoTypo h3>Call On Tab Change First</NekoTypo>
      <CallOnTabChangeFirst />
    </>
  );
}