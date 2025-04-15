// Previous: none
// Current: 0.0.0

import React from 'react';
import { action } from '@storybook/addon-actions';

import { NekoProgress } from './Progress';

import { NekoSpacer, NekoTypo } from '../../index';

export default {
  title: 'Components/Progress',
  component: NekoProgress,
  parameters: {
    componentSubtitle: 'The NekoProgress!'
  },
  argTypes: {
    value: { control: 'number', description: 'The value of the progress.' },
    max: { control: 'number', description: 'The max value of the progress.' },
    busy: { control: 'boolean', description: 'Set the progress to be busy.' },
    paused: { control: 'boolean', description: 'Set the progress to be paused.' },
    onPauseClick: { control: 'function', description: 'The callback when pause button is clicked.' },
    onStopClick: { control: 'function', description: 'The callback when stop button is clicked.' },
    status: { control: 'text', description: 'The status of the progress.' },
  },
};


const Template = (args) => <NekoProgress {...args} />

export const Default = Template.bind({});
Default.args = {
  value: 32,
  max: 100,
  busy: false,
  paused: false,
  onPauseClick: action('onPauseClick'),
  onStopClick: action('onStopClick'),
  status: '32%',
};


export const Sample = () => {

  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoProgress value={32} busy={true} />

      <NekoSpacer />

      <NekoTypo h3>Running With Actions</NekoTypo>
      <NekoProgress value={5} busy={true} onPauseClick={() => action('onPauseClick')} onStopClick={() => action('onStopClick')} />

      <NekoSpacer />

      <NekoTypo h3>Status String</NekoTypo>
      <NekoProgress value={32} busy={true} status="Uploading" />

      <NekoSpacer />

      <NekoTypo h3>Status Func</NekoTypo>
      <NekoProgress value={32} busy={true} status={(percent) => `${percent}% uploaded..`} />
    </>
  );
}
