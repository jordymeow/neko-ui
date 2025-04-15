// Previous: none
// Current: 0.0.0

import React from "react";
import { action } from '@storybook/addon-actions';

import { NekoSpacer, NekoTypo } from "../../index";

import { NekoUpload } from "./Upload";

export default {
  title: "Components/Upload",
  component: NekoUpload,
  parameters: {
    componentSubtitle: "The NekoUpload!",
  },
  argTypes: {
    height: { control: 'text', description: 'The height of the upload.' },
    onSuccess: { control: 'function', description: 'The callback when upload is successful.' },
    onFailure: { control: 'function', description: 'The callback when upload is failed.' },
    apiUrl: { control: 'text', description: 'The api url to upload.' },
    multiple: { control: 'boolean', description: 'Set the upload to be multiple.' },
    disabled: { control: 'boolean', description: 'Set the upload to be disabled.' },
  },
};

const Template = (args) => <NekoUpload {...args} />;

export const Default = Template.bind({});
Default.args = {
  height: '100px',
  onSuccess: action('onSuccess'),
  onFailure: action('onFailure'),
  apiUrl: 'path/to/upload',
  multiple: false,
  disabled: false,
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoUpload height="100px" onSuccess={action('onSuccess')} onFailure={action('onFailure')} apiUrl="path/to/upload" />

      <NekoSpacer />

      <NekoTypo h3>Multiple</NekoTypo>
      <NekoUpload height="100px" onSuccess={action('onSuccess')} onFailure={action('onFailure')} apiUrl="path/to/upload" multiple />

      <NekoSpacer />

      <NekoTypo h3>Disabled</NekoTypo>
      <NekoUpload height="100px" onSuccess={action('onSuccess')} onFailure={action('onFailure')} apiUrl="path/to/upload" disabled={true} />
    </>
  );
};
