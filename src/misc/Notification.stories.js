// Previous: none
// Current: 0.0.0

import React from "react";

import { NekoNotification } from "./Notification";

export default {
  title: "Components/Notification",
  component: NekoNotification,
  parameters: {
    componentSubtitle: "The NekoNotification!",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "error"],
      description: "The variant of the notification.",
    },
    children: {
      description: "Content placed inside the notification.",
    },
  },
};

const Template = ({ children, ...args }) => <NekoNotification {...args}>{children}</NekoNotification>;

export const Default = Template.bind({});
Default.args = {
  variant: "info",
  children: "Notification message",
};

export const Sample = () => {
  return (
    <>
      <NekoNotification>Notification message (Default)</NekoNotification>
      <NekoNotification variant="info">Info Notification message</NekoNotification>
      <NekoNotification variant="warning">Warning Notification message</NekoNotification>
      <NekoNotification variant="error">Error Notification message</NekoNotification>
    </>
  );
};
