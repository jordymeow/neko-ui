// Previous: none
// Current: 0.0.0

import React, { useState } from 'react';

import { NekoTypo, NekoSpacer } from "../../index";

import { NekoCollapsableCategory, NekoCollapsableCategories } from './CollapsableCategory';

export default {
  title: 'Layout/CollapsableCategory',
  component: NekoCollapsableCategories,
  parameters: {
    componentSubtitle: 'The NekoNekoCollapsableCategories!'
  },
  subcomponents: { NekoCollapsableCategory },
  argTypes: {
    keepState: { control: 'text', description: 'The name of the state to keep.' },
    className: { control: 'text', description: 'The class name of the categories.' },
    isCollapsed: { control: 'boolean', description: 'Set the categories to be collapsed.' },
    children: { description: 'The children of the categories.' },
  },
};

const Template = ({isCollapsed, children, ...args}) => <NekoCollapsableCategories {...args}>
  <NekoCollapsableCategory title="One"></NekoCollapsableCategory>
  <NekoCollapsableCategory title="Two" isCollapsed={isCollapsed}>
    {children}
  </NekoCollapsableCategory>
</NekoCollapsableCategories>

export const Default = Template.bind({});
Default.args = {
  keepState: '',
  className: '',
  isCollapsed: false,
  children: <ul keepState="Two">
  <li>child 1</li>
  <li>child 2</li>
  <li>child 3</li>
  <li>child 4</li>
  <li>child 5</li>
</ul>
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <Default {...Default.args} />

      <NekoSpacer />

      <NekoTypo h3>Keep State (Open Two and reload page, the Two keeps open state)</NekoTypo>
      <UseKeepState />

      <NekoSpacer />

      <NekoTypo h3>Category Only</NekoTypo>
      <UseCategoryOnly />
    </>
  );
};

const UseKeepState = () => (
  <NekoCollapsableCategories keepState="stateName">
    <NekoCollapsableCategory title="One">
      <p>One Sub Category: 1</p>
      <p>One Sub Category: 2</p>
    </NekoCollapsableCategory>
    <NekoCollapsableCategory title="Two">
      <ul keepState="Two">
        <li>child 1</li>
        <li>child 2</li>
        <li>child 3</li>
        <li>child 4</li>
        <li>child 5</li>
      </ul>
    </NekoCollapsableCategory>
  </NekoCollapsableCategories>
);

const UseCategoryOnly = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <NekoCollapsableCategory title="My Category"
      isCollapsed={isCollapsed}
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <p>Sub Category: 1</p>
      <p>Sub Category: 2</p>
    </NekoCollapsableCategory>
  );
};
