// Previous: none
// Current: 0.0.0

import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { NekoSpacer, NekoTypo } from '../../index';

import { NekoSelect, NekoOption } from './Select';

export default {
  title: 'Components/Select',
  component: NekoSelect,
  parameters: {
    componentSubtitle: 'The NekoSelect!'
  },
  subcomponents: {
    NekoOption: {
      argTypes: {
        id: { control: 'text', description: 'The id of the option.' },
        value: { control: 'text', description: 'The value of the option.' },
        label: { control: 'text', description: 'The label of the option.' },
        description: { control: 'text', description: 'The description of the option.' },
        checked: { control: 'boolean', description: 'Set the option to be checked.' },
        requirePro: { control: 'boolean', description: 'Set the option to require pro.' },
        disabled: { control: 'boolean', description: 'Set the option to be disabled.' },
        isPro: { control: 'boolean', description: 'Set the option to be pro.' },
        fullWidth: { control: 'boolean', description: 'Set the option to be full width.' },
        icon: { control: 'text', description: 'The icon of the option.' },
      }
    }
  },
  argTypes: {
    scrolldown: { control: 'boolean', description: 'Set the select to be scrolldown.' },
    name: { control: 'text', description: 'The name of the select.' },
    value: { control: 'text', description: 'The value of the select.' },
    disabled: { control: 'boolean', description: 'Set the select to be disabled.' },
    isPro: { control: 'boolean', description: 'Set the select to be pro.' },
    onChange: { action: 'onChange', description: 'The action to perform when the select is changed.' },
  },
};

const Template = ({ options, ...args }) => (
  <NekoSelect {...args}>
    {options.map((option) => (
      <NekoOption key={option.id} {...option} />
    ))}
  </NekoSelect>
);

export const Default = Template.bind({});
Default.args = {
  name: 'neko-select',
  onChange: action('onChange'),
  scrolldown: false,
  options: [
    { id: 'a', value: 'a', label: 'Option1' },
    { id: 'b', value: 'b', label: 'Pro Option2', requirePro: true },
    { id: 'c', value: 'c', label: 'Option3', description: 'There is usually a little explanation about what it does.' },
  ],
};

export const Sample = () => {
  const [selected, setSelected] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelected('a');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoSelect name="neko-select" onChange={action('onChange')}>
        <NekoOption id="a" value="a" label="Option1" />
        <NekoOption id="b" value="b" label="Pro Option2" requirePro={true} />
      </NekoSelect>

      <NekoSpacer />

      <NekoTypo h3>Disabled</NekoTypo>
      <NekoSelect name="neko-select" onChange={action('onChange')} disabled={true}>
        <NekoOption id="a" value="a" label="Option1" />
        <NekoOption id="b" value="b" label="Pro Option2" requirePro={true} />
      </NekoSelect>

      <NekoSpacer />

      <NekoTypo h3>Pro User</NekoTypo>
      <NekoSelect name="neko-select-pro" isPro={true} onChange={action('onChange')}>
        <NekoOption id="i" value="i" label="Option1" />
        <NekoOption id="ii" value="ii" label="Pro Option2" requirePro={true} />
        <NekoOption checked id="iii" value="iii" label="Option3" description="There is usually a little explanation about what it does." />
        <NekoOption id="iv" value="iv" label="OPro ption4" requirePro={true} description="There is usually a little explanation about what it does." />
      </NekoSelect>

      <NekoSpacer />

      <NekoTypo h3>Scrolldown</NekoTypo>
      <NekoSelect name="neko-select-scrolldown" value={selected} scrolldown={true} onChange={(v) => setSelected(v)}>
        <NekoOption id="f" value="f" label="Option1" />
        <NekoOption id="g" value="g" label="Pro Option2" requirePro={true} />
        <NekoOption id="i" value="i" label="Option3" />
      </NekoSelect>

      <NekoSpacer />

      <NekoTypo h3>Scrolldown Disabled</NekoTypo>
      <NekoSelect name="neko-select-scrolldown-disabled" scrolldown={true} onChange={action('onChange')} description="This is the description of the Select." disabled={true}>
        <NekoOption id="a" value="a" label="Option1" />
        <NekoOption id="b" value="b" label="Pro Option2" requirePro={true} />
      </NekoSelect>

      <NekoSpacer />

      <NekoTypo h3>Scrolldown Description</NekoTypo>
      <NekoSelect name="neko-select-scrolldown-description" scrolldown={true} onChange={action('onChange')} description="This is the description of the Select.">
        <NekoOption id="a" value="a" label="Option1" />
        <NekoOption id="b" value="b" label="Pro Option2" requirePro={true} />
      </NekoSelect>

      <NekoSpacer />

      <NekoTypo h3>Scrolldown Description for Pro User</NekoTypo>
      <NekoSelect name="neko-select-scrolldown-pro" scrolldown={true} isPro={true} onChange={action('onChange')}>
        <NekoOption id="c" value="c" label="Option1" />
        <NekoOption id="d" value="d" label="Pro Option2" requirePro={true} />
        <NekoOption checked id="iii" value="iii" label="Option3" description="There is usually a little explanation about what it does." />
        <NekoOption id="e" value="e" label="Pro Option4" requirePro={true} description="There is usually a little explanation about what it does." />
      </NekoSelect>

      <NekoSpacer />

      <NekoTypo h3>Scrolldown with Icon Option</NekoTypo>
      <NekoSelect name="neko-select-scrolldown-with-icon-option" scrolldown={true} onChange={action('onChange')} description="This is the description of the Select.">
        <NekoOption id="a" icon="cat" value="a" label="Option1" />
        <NekoOption id="b" value="b" label="Pro Option2" requirePro={true} />
      </NekoSelect>

      <NekoSpacer />

      <NekoTypo h3>Busy</NekoTypo>
      <NekoSelect name="neko-select-busy" scrolldown={true} onChange={action('onChange')} description="This is the description of the Select." isBusy>
        <NekoOption id="a" icon="cat" value="a" label="Option1" />
        <NekoOption id="b" value="b" label="Pro Option2" requirePro={true} />
      </NekoSelect>

      <NekoSpacer />

      <NekoTypo h3>Text Filtering</NekoTypo>
      <NekoSelect name="neko-select-text-filtering" scrolldown={true} onChange={action('onChange')} description="This is the description of the Select." textFiltering>
        <NekoOption id="a" icon="cat" value="a" label="Option1" />
        <NekoOption id="b" value="b" label="Pro Option2" requirePro={true} />
      </NekoSelect>
    </>
  );
}