// Previous: none
// Current: 0.0.0

import React, { useState } from "react";
import { action } from '@storybook/addon-actions';

import { NekoSpacer, NekoTypo } from "../../index";

import { NekoTextArea } from "./TextArea";

export default {
  title: "Components/TextArea",
  component: NekoTextArea,
  parameters: {
    componentSubtitle: "The NekoTextArea!",
  },
  argTypes: {
    name: { control: "text", description: "The name of the text area." },
    value: { control: "text", description: "The value of the text area." },
    placeholder: { control: "text", description: "The placeholder of the text area." },
    description: { control: "text", description: "The description of the text area." },
    readOnly: { control: "boolean", description: "Set the text area to be read only." },
    disabled: { control: "boolean", description: "Set the text area to be disabled." },
    onBlur: { action: "onBlur", description: "The action to perform when the text area is blurred." },
    onChange: { action: "onChange", description: "The action to perform when the text area is changed." },
    onEnter: { action: "onEnter", description: "The action to perform when the text area is entered." },
    onBlurForce: { control: "boolean", description: "Set the text area to be blurred when enter is pressed." },
  },
};

const Template = (args) => <NekoTextArea {...args} />;
export const Default = Template.bind({});
Default.args = {
  name: "neko-text-area",
  value: "",
  placeholder: "Type your text here...",
  description: "There is usually a little explanation about what it does.",
  onBlur: action("onBlur"),
  onEnter: action("onEnter"),
  readOnly: false,
  disabled: false,
  onBlurForce: false,
};

export const Sample = () => {
  const [value, setValue] = useState('');
  const setValueWithLogName = (v, name, eventType) => {
    console.log({name, eventType});
    setValue(v);
  }
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoTextArea name="neko-text-area" value={value} onBlurForce
        onChange={(v, name) => setValueWithLogName(v, name, 'onChange')}
        onEnter={(v, name) => setValueWithLogName(v, name, 'onEnter')}
        onBlur={(v, name) => setValueWithLogName(v, name, 'onBlur')}
      >Neko Gauge</NekoTextArea>

      <NekoSpacer />

      <NekoTypo h3>Description</NekoTypo>
      <NekoTextArea name="neko-text-area" description="This is the NekoTextArea" />

      <NekoSpacer />

      <NekoTypo h3>Default Value</NekoTypo>
      <NekoTextArea name="neko-text-area" value="default value" />

      <NekoSpacer />

      <NekoTypo h3>Read Only</NekoTypo>
      <NekoTextArea name="neko-text-area" value="default value (readonly)" readOnly />

      <NekoSpacer />

      <NekoTypo h3>Enter Key Event</NekoTypo>
      <NekoTextArea name="neko-text-area" value="event fired when entered" onEnter={action('onEnter')} />
    </>
  );
};
