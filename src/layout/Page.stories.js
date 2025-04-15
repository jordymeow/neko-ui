// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoTypo } from '../../index';

import { NekoPage } from './Page';

export default {
  title: 'Layout/Page',
  component: NekoPage,
  parameters: {
    componentSubtitle: 'The NekoPage!'
  },
  argTypes: {
    className: { control: 'text', description: 'The class name of the page.' },
    style: {  description: 'The style of the page.' },
    nekoErrors: { control: 'array', description: 'The errors of the page.' },
    children: { description: 'Content placed inside the page.' },
  },
};

const Template = ({ children, ...args }) => (
  <NekoPage {...args}>
    {children}
  </NekoPage>
);

export const Default = Template.bind({});
Default.args = {
  className: '',
  style: {},
  nekoErrors: false,
  children: <p>Page Content</p>,
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <Default {...Default.args} />
    </>
  );
}

