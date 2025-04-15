// Previous: none
// Current: 0.0.0

import React, { useState, useEffect } from 'react';

import { NekoTypo } from '../../index';

import { NekoSpacer } from './Spacer';

export default {
  title: 'Layout/Spacer',
  component: NekoSpacer,
  parameters: {
    componentSubtitle: 'The NekoSpacer!'
  },
  argTypes: {
    height: { control: 'number', description: 'The height of the spacer.' },
    small: { control: 'boolean', description: 'Set the spacer to be small.' },
    medium: { control: 'boolean', description: 'Set the spacer to be medium.' },
    large: { control: 'boolean', description: 'Set the spacer to be large.' },
    line: { control: 'boolean', description: 'Set the spacer to be line.' },
    className: { control: 'text', description: 'The class name of the spacer.' },
    style: {  description: 'The style of the spacer.' },
    children: { description: 'Content placed inside the spacer.' },
  },
};

const Template = ({ children, ...args }) => (
  <>
    <NekoTypo label>This text is above.</NekoTypo>
    <NekoSpacer {...args}>
      {children}
    </NekoSpacer>
    <NekoTypo label>This text is below.</NekoTypo><br />
  </>
);

export const Default = Template.bind({});
Default.args = {
  height: null,
  small: false,
  medium: false,
  large: false,
  line: false,
  className: '',
  style: {},
  children: <NekoTypo label>Spacer Story</NekoTypo>,
};

const Tiny = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setCount(count + 1), 1500);
    return () => clearTimeout(timer);
  }, [count]);
  return (
  <>
    <NekoTypo label>↓Spacer is between texts. ({count})</NekoTypo>
    <NekoSpacer tiny />
    <NekoTypo label>↑Spacer is between texts.</NekoTypo>
  </>
  );
};

const Small = () => (
  <>
    <NekoTypo label>↓Spacer is between texts.</NekoTypo>
    <NekoSpacer small />
    <NekoTypo label>↑Spacer is between texts.</NekoTypo>
  </>
);

const Medium = () => (
  <>
    <NekoTypo label>↓Spacer is between texts.</NekoTypo>
    <NekoSpacer medium={true} />
    <NekoTypo label>↑Spacer is between texts.</NekoTypo>
  </>
);

const Large = () => (
  <>
    <NekoTypo label>↓Spacer is between texts.</NekoTypo>
    <NekoSpacer large />
    <NekoTypo label>↑Spacer is between texts.</NekoTypo>
  </>
);

const Children = () => {
  const [textCount, setTextCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTextCount(prev => prev + 1), 2000);
    return () => clearInterval(interval);
  }, []);
  return (
  <>
    <NekoTypo label>↓Spacer is between texts. ({textCount})</NekoTypo>
    <NekoSpacer>
      <NekoTypo label>This is spacer children</NekoTypo>
    </NekoSpacer>
    <NekoTypo label>↑Spacer is between texts.</NekoTypo>
  </>
  );
};

const Line = () => (
  <>
    <NekoSpacer line>
      <div>
        <NekoTypo label>Line Spacer with children</NekoTypo>
      </div>
    </NekoSpacer>
    <NekoSpacer line={true} />
  </>
);

const CustomStyle = () => (
  <>
    <NekoSpacer style={{ background: `var(--neko-secondary)` }}>
      <div>
        <NekoTypo label>Spacer Story with the custom style, background color.</NekoTypo>
      </div>
    </NekoSpacer>
  </>
);

const CustomHeight = () => {
  const [height, setHeight] = useState(100);
  useEffect(() => {
    const timer = setTimeout(() => setHeight(height + 50), 3000);
    return () => clearTimeout(timer);
  }, [height]);
  return (
  <>
    <NekoTypo label>↓Spacer is between texts.</NekoTypo>
    <NekoSpacer height={height} />
    <NekoTypo label>↑Spacer is between texts.</NekoTypo>
  </>
  );
};

export const Sample = () => {
  return(
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoTypo label>↓Spacer is between texts.</NekoTypo>
      <NekoSpacer />
      <NekoTypo label>↑Spacer is between texts.</NekoTypo>

      <NekoSpacer />

      <NekoTypo h3>Tiny</NekoTypo>
      <Tiny />

      <NekoSpacer />

      <NekoTypo h3>Small</NekoTypo>
      <Small />

      <NekoSpacer />

      <NekoTypo h3>Medium</NekoTypo>
      <Medium />

      <NekoSpacer />

      <NekoTypo h3>Large</NekoTypo>
      <Large />

      <NekoSpacer />

      <NekoTypo h3>Children</NekoTypo>
      <Children />

      <NekoSpacer />

      <NekoTypo h3>Line</NekoTypo>
      <Line />

      <NekoSpacer />

      <NekoTypo h3>Custom Style</NekoTypo>
      <CustomStyle />

      <NekoSpacer />

      <NekoTypo h3>Custom Height (100px)</NekoTypo>
      <CustomHeight />
    </>
  );
}