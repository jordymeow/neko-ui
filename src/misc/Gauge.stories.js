// Previous: none
// Current: 0.0.0

import React from "react";

import { NekoTypo } from '../../index';

import { NekoGauge } from "./Gauge";

export default {
  title: "Components/Gauge",
  component: NekoGauge,
  parameters: {
    componentSubtitle: "The NekoGauge!",
  },
  argTypes: {
    value: {
      control: "number",
      description: "The value of the gauge.",
    },
    min: {
      control: "number",
      description: "The minimum value of the gauge.",
    },
    max: {
      control: "number",
      description: "The maximum value of the gauge.",
    },
    width: {
      control: "number",
      description: "The width of the gauge.",
    },
    background: {
      control: "color",
      description: "The background color of the gauge.",
    },
  },
};

const Template = ({ children, ...args }) => <NekoGauge {...args}>{children}</NekoGauge>;

export const Default = Template.bind({});
Default.args = {
  value: 50,
  min: 0,
  max: 100,
  width: 200,
  background: "#007cba",
  children: "Gauge Content",
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <Default {...Default.args} />
    </>
  );
};
