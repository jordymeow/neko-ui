// Previous: none
// Current: 0.0.0

import React from 'react';
import { action } from '@storybook/addon-actions';

import { NekoButton, NekoTypo, NekoSpacer } from "../../index";

import { NekoModal } from './Modal';

export default {
  title: 'Components/Modal',
  component: NekoModal,
  parameters: {
    componentSubtitle: 'The NekoModal!'
  },
  argTypes: {
    className: { control: 'text', description: 'The class name of the modal.' },
    style: {  description: 'The style of the modal.' },
    isOpen: { control: 'boolean', description: 'Set the modal to be open.' },
    title: { control: 'text', description: 'The title of the modal.' },
    content: { control: 'text', description: 'The content of the modal.' },
    contentWidth: { control: 'text', description: 'The content width of the modal.' },
    customButtons: { control: 'object', description: 'The custom buttons of the modal.' },
    okOnEnter: { control: 'boolean', description: 'Set the modal to be ok on enter.' },
    thumbnail: { control: 'object', description: 'The thumbnail of the modal.' },
    okButton: { control: 'object', description: 'The ok button of the modal.' },
    cancelButton: { control: 'object', description: 'The cancel button of the modal.' },
  },
};

const Template = (args) => {
  const [showModal, setShowModal] = React.useState(false);
  React.useEffect(() => {
    if (args.isOpen) {
      setShowModal(true);
    }
  }, [args.isOpen]);

  return (
    <>
      <NekoButton onClick={() => setShowModal(!showModal)}>Open Modal</NekoButton>
      <NekoModal {...args} isOpen={showModal} onRequestClose={() => setShowModal(false)} />
    </>
  );
}

export const Default = Template.bind({});
Default.args = {
  className: '',
  style: {},
  title: 'Title',
  content: 'Content',
  isOpen: false,
  contentWidth: '600px',
  customButtons: null,
  okOnEnter: false,
  thumbnail: null,
  okButton: {
    onClick: action('onClick: okButton'),
    disabled: false,
  },
  cancelButton: {
    onClick: action('onClick: cancelButton'),
    disabled: false,
  },
};

const NoChildren = Template.bind({});
NoChildren.args = {
  id: "text2",
  ariaHideApp: false,
  contentLabel: "NoChildren Content Label",
  title: "NoChildren Title",
  content: "This is the NoChildren modal content.",
  okButton: {
    onClick: action('onClick: okButton'),
    disabled: false,
  },
  cancelButton: {
    onClick: action('onClick: cancelButton'),
    disabled: false,
  },
};

const WithCustomButton = Template.bind({});
WithCustomButton.args = {
  id: "text3",
  ariaHideApp: false,
  contentLabel: "WithCustomButton content label",
  title: "WithCustomButton Title",
  content: "This is the WithCustomButton modal content.",
  customButtons: <NekoButton onClick={action('onClick')}>Custom</NekoButton>,
  okButton: {
    onClick: action('onClick: okButton'),
    disabled: false,
  },
  cancelButton: {
    onClick: action('onClick: cancelButton'),
    disabled: false,
  },
};

const WithCustomButtonOnLeft = Template.bind({});
WithCustomButtonOnLeft.args = {
  id: "text4",
  ariaHideApp: false,
  contentLabel: "WithCustomButtonOnLeft content label",
  title: "WithCustomButtonOnLeft Title",
  content: "This is the WithCustomButtonOnLeft modal content.",
  customButtons: <NekoButton onClick={action('onClick')}>Custom</NekoButton>,
  customButtonsPosition: "left",
  okButton: {
    onClick: action('onClick: okButton'),
    disabled: false,
  },
  cancelButton: {
    onClick: action('onClick: cancelButton'),
    disabled: false,
  },
};

const OkOnEnter = Template.bind({});
OkOnEnter.args = {
  id: "text5",
  ariaHideApp: false,
  contentLabel: "OkOnEnter content label",
  title: "OkOnEnter Title",
  content: "This is the OkOnEnter modal content.",
  okOnEnter: true,
  okButton: {
    onClick: action('onClick: okButton'),
    disabled: false,
  },
  cancelButton: {
    onClick: action('onClick: cancelButton'),
    disabled: false,
  },
};

const WithThumbnail = Template.bind({});
WithThumbnail.args = {
  id: "text6",
  ariaHideApp: false,
  contentLabel: "WithThumbnail content label",
  title: "WithThumbnail Title",
  content: "This is the WithThumbnail modal content.",
  okOnEnter: true,
  thumbnail: <img src="https://source.unsplash.com/random" />,
  okButton: {
    onClick: action('onClick: okButton'),
    disabled: false,
  },
  cancelButton: {
    onClick: action('onClick: cancelButton'),
    disabled: false,
  },
};

const CustomContentWidth = Template.bind({});
CustomContentWidth.args = {
  id: "text7",
  ariaHideApp: false,
  contentLabel: "CustomContentWidth content label",
  contentWidth: "800px",
  content: "This is the CustomContentWidth modal content.",
  okButton: {
    onClick: action('onClick: okButton'),
    disabled: false,
  },
  cancelButton: {
    onClick: action('onClick: cancelButton'),
    disabled: false,
  },
};

const DisabledOnlyOkButton = Template.bind({});
DisabledOnlyOkButton.args = {
  id: "text8",
  ariaHideApp: false,
  contentLabel: "DisabledOnlyOkButton content label",
  content: "This is the DisabledOnlyOkButton modal content.",
  okButton: {
    onClick: action('onClick: okButton'),
    disabled: true,
  },
  cancelButton: {
    onClick: action('onClick: cancelButton'),
    disabled: false,
  },
}

const DisabledOnlyCancelButton = Template.bind({});
DisabledOnlyCancelButton.args = {
  id: "text9",
  ariaHideApp: false,
  contentLabel: "DisabledOnlyCancelButton content label",
  content: "This is the DisabledOnlyCancelButton modal content.",
  okButton: {
    onClick: action('onClick: okButton'),
    disabled: false,
  },
  cancelButton: {
    onClick: action('onClick: cancelButton'),
    disabled: true,
  },
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <Default {...Default.args} />

      <NekoSpacer />

      <NekoTypo h3>No Children</NekoTypo>
      <NoChildren {...NoChildren.args} />

      <NekoSpacer />

      <NekoTypo h3>Custom Button</NekoTypo>
      <WithCustomButton {...WithCustomButton.args} />

      <NekoSpacer />

      <NekoTypo h3>Custom Button On Left</NekoTypo>
      <WithCustomButtonOnLeft {...WithCustomButtonOnLeft.args} />

      <NekoSpacer />

      <NekoTypo h3>Ok On Enter</NekoTypo>
      <OkOnEnter {...OkOnEnter.args} />

      <NekoSpacer />

      <NekoTypo h3>Thumbnail</NekoTypo>
      <WithThumbnail {...WithThumbnail.args} />

      <NekoSpacer />

      <NekoTypo h3>Custom Content Width</NekoTypo>
      <CustomContentWidth {...CustomContentWidth.args} />

      <NekoSpacer />

      <NekoTypo h3>Disabled Only Ok Button</NekoTypo>
      <DisabledOnlyOkButton {...DisabledOnlyOkButton.args} />

      <NekoSpacer />

      <NekoTypo h3>Disabled Only Cancel Button</NekoTypo>
      <DisabledOnlyCancelButton {...DisabledOnlyCancelButton.args} />
    </>
  );
}