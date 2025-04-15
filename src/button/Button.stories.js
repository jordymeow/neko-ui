// Previous: none
// Current: 0.0.0

import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import catIcon from '@iconify/icons-mdi/cat';

import { NekoSpacer, NekoTypo } from './../../index';

import { NekoButton } from './Button';

export default {
  title: 'Components/Button',
  component: NekoButton,
  parameters: {
    componentSubtitle: 'The NekoButton!',
  },
  argTypes: {
    children: { control: 'text', description: 'The text of the button.' },
    onClick: { action: 'clicked', description: 'The action to perform when the button is clicked.' },
    className: {
      options: ['primary', 'secondary', 'danger', 'success', 'header'],
      control: { type: 'select' },
      description: 'The style of the button.'
    },
    icon: {
      options: ['trash', 'play'],
      control: { type: 'select' },
      description: 'The icon to display on the button.'
    },
    color: { control: 'color', description: 'Set a custom color for the button.' },
    small: { control: 'boolean', description: 'Set the button to be small.' },
    disabled: { control: 'boolean', description: 'Set the button to be disabled.' },
    isBusy: { control: 'boolean', description: 'Set the button to be busy.' },
    busyText: { control: 'text', description: 'Set the text to display when the button is busy.' },
    startTime: { control: 'date', description: 'Set the start time of the button.' },
    rounded: { control: 'boolean', description: 'Set the button to be rounded.' },
    isPro: { control: 'boolean', description: 'Set the button to be pro.' },
    requirePro: { control: 'boolean', description: 'Set the button to require pro.' },
    fullWidth: { control: 'boolean', description: 'Set the button to be full width.' },
  },
};

const Template = (args) => <NekoButton {...args} />;
export const Default = Template.bind({});
Default.args = {
  children: 'Button Text',
  onClick: action('onClick'),
  className: 'primary',
  icon: '',
  color: '',
  small: false,
  disabled: false,
  isBusy: false,
  busyText: '',
  startTime: null,
  rounded: false,
  isPro: false,
  requirePro: false,
  fullWidth: false,
};

export const Sample = () => {
  const [startTime, setStartTime] = useState();

  const onClick = () => {
    if (startTime) {
      setStartTime(null);
      return;
    }
    setStartTime(new Date());
  };

  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const elapsedSeconds = startTime ? Math.floor((currentTime - startTime.getTime()) / 1000) : 0;

  return (
    <>
      <NekoButton onClick={action('onClick')}>Primary</NekoButton>
      <NekoButton className="secondary">Secondary</NekoButton>
      <NekoButton className="danger">Danger</NekoButton>
      <NekoButton className="success">Success</NekoButton>
      <NekoButton className="header">Header</NekoButton>
      <NekoButton small>Small</NekoButton>
      <NekoButton onClick={action('onClick')} disabled>Disabled</NekoButton>
      <NekoButton color="#BA7000">Custom Color</NekoButton>
      <NekoButton onClick={action('onClick')} icon={catIcon}>Primary</NekoButton>
      <NekoButton onClick={action('onClick')} icon="trash" className="danger">Danger</NekoButton>
      <NekoButton icon="trash" isBusy={true}>is busy</NekoButton>
      <NekoButton icon="play" rounded></NekoButton>
      <NekoButton className="primary" isPro={false} requirePro={true}>Pro Feature</NekoButton>
      <NekoButton className="primary" isPro={true} requirePro={true}>Pro Feature</NekoButton>
      <NekoSpacer />
      <NekoButton className="primary" fullWidth>Full Width</NekoButton>
      <NekoSpacer />
      <NekoButton className="primary" fullWidth isBusy={true}>Full Width</NekoButton>

      <NekoSpacer line />

      <NekoTypo p>A busy button can also have a startTime. This will display the time elapsed since that startTime.</NekoTypo>
      <NekoButton isBusy={true} startTime={startTime}></NekoButton>
      <NekoTypo p>This button, when clicked, will set the start time om this button.</NekoTypo>
      <NekoButton onClick={onClick}>{startTime ? "Stop" : "Start"}</NekoButton>

      <NekoSpacer line />

      <NekoTypo p>This one is set an icon:</NekoTypo>
      <NekoButton icon="trash" isBusy={true} busyText='20%'></NekoButton>
      <NekoTypo p>This one is set without an icon:</NekoTypo>
      <NekoButton isBusy={true} busyText='20%'></NekoButton>
    </>
  );
}