// Previous: none
// Current: 0.0.0

import React from "react";

import { NekoSpacer } from "../../index";

import { NekoMessage } from "./Message";

export default {
  title: "Components/Message",
  component: { NekoMessage },
  parameters: {
    componentSubtitle: "The NekoMessage!",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "danger", "info", "warning", "special"],
      description: "The variant of the message.",
    },
    children: {
      description: "Content placed inside the message.",
    },
  },
};

const Template = ({ children, ...args }) => <NekoMessage {...args}>{children}</NekoMessage>;

export const Default = Template.bind({});
Default.args = {
  variant: "success",
  children: "Neko Message",
};

export const Sample = () => {

  return (
    <>
      <NekoMessage>Neko Message (Default)</NekoMessage>

      <NekoSpacer />

      <NekoMessage variant="success">Success Neko Message</NekoMessage>

      <NekoSpacer />

      <NekoMessage variant="danger">Danger Neko Message</NekoMessage>

      <NekoSpacer />

      <NekoMessage variant="info">Info Neko Message</NekoMessage>

      <NekoSpacer />

      <NekoMessage variant="warning">Warning Neko Message</NekoMessage>

      <NekoSpacer />

      <NekoMessage variant="special">Special Neko Message</NekoMessage>
    </>
  )
}
