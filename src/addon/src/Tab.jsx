import React from "react";
import { useParameter } from "@storybook/manager-api";
import { PARAM_KEY } from "./constants";
import { TabContent } from "./components/TabContent";

export const Tab = ({ active }) => {
  const props = useParameter(PARAM_KEY, "");

  if (!active) {
    return null;
  }

  if (!props) {
    return <TabContent description="No docs." />;
  }

  return <TabContent {...props} />;
};
