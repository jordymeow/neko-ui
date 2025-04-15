// Previous: none
// Current: 0.0.0

import React from 'react';
import { action } from '@storybook/addon-actions';

import { NekoSpacer, NekoTypo } from '../../index';

import { NekoQuickLinks, NekoLink } from './Links';

export default {
  title: 'Components/Links',
  component: NekoQuickLinks,
  parameters: {
    componentSubtitle: 'The NekoLinks!'
  },
  subcomponents: {NekoLink},
  argTypes: {
    name: { control: 'text', description: 'The name of the links.' },
    value: { control: 'number', description: 'The value of the links.' },
  },
};

const Template = ({ children, ...args }) => (
  <NekoQuickLinks {...args}>
    {
      children.map((child, index) => (
        <NekoLink key={index} {...child}/>
      ))
    }
  </NekoQuickLinks>
);

export const Default = Template.bind({});
Default.args = {
  name: 'neko-link',
  value: 29,
  children: [
    { title: "Issues", value: 29, onClick: action('onClick') },
    { title: "Ignored", value: 5, onClick: action('onClick'), variant: 'danger' },
    { title: "Trash", value: 12, onClick: action('onClick') },
  ],
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoQuickLinks name='neko-link' onChange={action('onChange')} value={29}>
        <NekoLink title="Issues" value={29} onClick={action('onClick')} />
        <NekoLink title="Ignored" value={5} onClick={action('onClick')} />
        <NekoLink title="Trash" value={12} onClick={action('onClick')} />
      </NekoQuickLinks>

      <NekoSpacer />

      <NekoTypo h3>Variant</NekoTypo>
      <NekoQuickLinks name='neko-link-variant' onChange={action('onChange')} value={29}>
        <NekoLink title="Issues" value={29} onClick={action('onClick')} />
        <NekoLink title="Ignored" value={5} onClick={action('onClick')} variant="danger" />
        <NekoLink title="Trash" value={12} onClick={action('onClick')} />
      </NekoQuickLinks>
    </>
  );
}
