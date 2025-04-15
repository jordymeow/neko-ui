// Previous: none
// Current: 0.0.0

import React, { useRef } from "react";
import { action } from '@storybook/addon-actions';

import { NekoButton, NekoTypo, NekoSpacer } from "../../index";

import { NekoUploadDropArea } from "./UploadDropArea";

export default {
  title: "Components/UploadDropArea",
  component: NekoUploadDropArea,
  parameters: {
    componentSubtitle: "The NekoUploadDropArea!",
  },
  argTypes: {
    onSuccess: { control: 'function', description: 'The callback when upload is successful.' },
    onFailure: { control: 'function', description: 'The callback when upload is failed.' },
    apiUrl: { control: 'text', description: 'The api url to upload.' },
    disabled: { control: 'boolean', description: 'Set the upload to be disabled.' },
  },
};

const Template = (args) => {
  const ref = useRef(null)
  return (
    <NekoUploadDropArea ref={ref} {...args}>
      <NekoButton onClick={() => ref.current.click() }>Button</NekoButton>
    </NekoUploadDropArea>
  );
}

export const Default = Template.bind({});
Default.args = {
  onSuccess: action('onSuccess'),
  onFailure: action('onFailure'),
  apiUrl: 'path/to/upload',
  disabled: false,
};


export const Sample = () => {
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoUploadDropArea ref={ref1} onSuccess={action('onSuccess')} onFailure={action('onFailure')} apiUrl="path/to/upload">
        <NekoButton onClick={() => ref1.current.click() }>Button</NekoButton>
      </NekoUploadDropArea>

      <NekoSpacer />

      <NekoTypo h3>Multiple</NekoTypo>
      <NekoUploadDropArea ref={ref2} onSuccess={action('onSuccess')} onFailure={action('onFailure')} apiUrl="path/to/upload" multiple>
        <NekoButton onClick={() => ref2.current.click() }>Button</NekoButton>
      </NekoUploadDropArea>

      <NekoSpacer />

      <NekoTypo h3>Disabled</NekoTypo>
      <NekoUploadDropArea ref={ref3} disabled onSuccess={action('onSuccess')} onFailure={action('onFailure')} apiUrl="path/to/upload">
        <NekoButton onClick={() => ref3.current.click() }>Button</NekoButton>
      </NekoUploadDropArea>
    </>
  );
};
