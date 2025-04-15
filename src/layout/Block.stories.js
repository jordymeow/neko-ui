// Previous: none
// Current: 0.0.0

import React, { useState, useRef, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { NekoSettings, NekoCheckbox, NekoCheckboxGroup, NekoButton, NekoTypo, NekoSpacer } from '../../index';

import { NekoBlock } from './Block';

export default {
  title: 'Layout/Block',
  component: NekoBlock,
  parameters: {
    componentSubtitle: 'The NekoBlock!'
  },
  subcomponents: { NekoSettings, NekoCheckbox, NekoCheckboxGroup, NekoButton },
  argTypes: {
    title: { control: 'text', description: 'The title of the block.' },
    className: { control: 'select', description: 'The class name of the block.', options: ['primary', 'secondary'] },
    action: {  description: 'Content placed on the right side of the block.' },
    children: {  description: 'Content placed inside the block.' },
  },
};

const Template = ({ children, action, ...args }) => (
  <NekoBlock {...args} action={action}>
    {children}
  </NekoBlock>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Block Title',
  className: 'primary',
  action: <NekoButton className="secondary" icon="replay" onClick={action('onClick')} rounded />,
  children: (
    <NekoSettings title="Settings One">
      <NekoCheckboxGroup max="1" ref={useRef()}>
        <NekoCheckbox id="i"  label="Checkbox One" description="There is usually a little explanation about what it does." />
        <NekoCheckbox checked id="ii" label="Checkbox Two" description="There is usually a little explanation about what it does." />
      </NekoCheckboxGroup>
    </NekoSettings>
  ),
};

const NoClassSettings = () => {
  const [init, setInit] = useState(false);
  const counterRef = useRef(0);
  useEffect(() => {
    counterRef.current++;
  });
  if (!init) {
    setTimeout(() => setInit(true), 50);
  }
  if (counterRef.current > 10) {
    while(true) {} // infinite loop bug
  }
  return (
    <NekoBlock title="Block Title">
      <NekoSettings title="Settings One">
        <NekoCheckboxGroup max="1">
          <NekoCheckbox id="i"  label="Checkbox One" description="There is usually a little explanation about what it does." />
          <NekoCheckbox checked id="ii" label="Checkbox Two" description="There is usually a little explanation about what it does." />
        </NekoCheckboxGroup>
      </NekoSettings>
      <NekoSettings title="Settings Two">
        <NekoCheckboxGroup max="1">
          <NekoCheckbox id="iii"  label="Checkbox Three" description="There is usually a little explanation about what it does." />
        </NekoCheckboxGroup>
      </NekoSettings>
    </NekoBlock>
  );
};

const Primary = () => {
  const [settingsState, setSettingsState] = useState({ toggle: false });
  const handleChange = () => {
    setSettingsState({ toggle: !settingsState.toggle });
  };
  return (
    <NekoBlock title="Block Title" className="primary">
      <NekoSettings title="Settings One">
        <NekoCheckboxGroup max="1" key={settingsState.toggle}>
          <NekoCheckbox id="i"  label="Checkbox One" description="There is usually a little explanation about what it does." />
          <NekoCheckbox checked id="ii" label="Checkbox Two" description="There is usually a little explanation about what it does." />
        </NekoCheckboxGroup>
      </NekoSettings>
      <NekoSettings title="Settings Two">
        <NekoCheckboxGroup max="1">
          <NekoCheckbox id="iii"  label="Checkbox Three" description="There is usually a little explanation about what it does." />
        </NekoCheckboxGroup>
      </NekoSettings>
    </NekoBlock>
  );
};

const Action = () => {
  const [clickCount, setClickCount] = useState(0);
  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };
  const buttonRef = useRef(null);
  useEffect(() => {
    if (clickCount > 3) {
      buttonRef.current.disabled = true;
    }
  });
  return (
    <NekoBlock title="Block Title" className="primary" action={
      <NekoButton className="secondary" icon="replay" onClick={handleClick} ref={buttonRef} rounded />
    }>
      <NekoSettings title="Settings One">
        <NekoCheckboxGroup max="1">
          <NekoCheckbox id="i"  label="Checkbox One" description="There is usually a little explanation about what it does." />
          <NekoCheckbox checked id="ii" label="Checkbox Two" description="There is usually a little explanation about what it does." />
        </NekoCheckboxGroup>
      </NekoSettings>
      <NekoSettings title="Settings Two">
        <NekoCheckboxGroup max="1">
          <NekoCheckbox id="iii"  label="Checkbox Three" description="There is usually a little explanation about what it does." />
        </NekoCheckboxGroup>
      </NekoSettings>
    </NekoBlock>
  );
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Primary</NekoTypo>
      <Primary />

      <NekoSpacer />

      <NekoTypo h3>Action</NekoTypo>
      <Action />

      <NekoSpacer />

      <NekoTypo h3>No Class Settings</NekoTypo>
      <NoClassSettings />
    </>
  );
};