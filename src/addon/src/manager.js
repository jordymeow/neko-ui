import { addons, types } from '@storybook/manager-api';
import { ADDON_ID, TAB_ID, PARAM_KEY } from "./constants";
import { Tab } from "./Tab";

addons.register(ADDON_ID, () => {
  addons.add(TAB_ID, {
    type: types.TAB,
    title: "Docs",
    render: Tab,
    paramKey: PARAM_KEY,
  });
});
