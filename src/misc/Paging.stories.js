// Previous: none
// Current: 0.0.0

import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { NekoPaging } from './Paging';

import { NekoSpacer, NekoTypo } from '../../index';

export default {
  title: 'Components/Paging',
  component: NekoPaging,
  parameters: {
    componentSubtitle: 'The NekoPaging!'
  },
  argTypes: {
    currentPage: { control: 'number', description: 'The current page.' },
    limit: { control: 'number', description: 'The limit of the page.' },
    total: { control: 'number', description: 'The total of the page.' },
    onClick: { control: 'function', description: 'The function to be called when a page is clicked.' },
    lastPage: { control: 'number', description: 'The last page.' },
    infinite: { control: 'boolean', description: 'Set the paging to be infinite.' },
    maxInfinite: { control: 'boolean', description: 'Set the paging to be max infinite.' },
    controllerText: { control: 'object', description: 'The controller text.' },
  },
};

const Template = (args) => <NekoPaging {...args} />

export const Default = Template.bind({});
Default.args = {
  currentPage: 12,
  limit: 10,
  total: 272,
  onClick: action('onClick'),
  lastPage: 28,
  infinite: false,
  maxInfinite: false,
};

export const Sample = () => {
  const [currentPage, setCurrentPage] = useState(12);
  const [currentInfinitePage, setCurrentInfinitePage] = useState(1);

  const limit = 10;
  const total = 272;

  const onClickInfinite = (page) => {
    setCurrentInfinitePage(page);
  }
  const onCurrentPageChanged = (page) => {
    setCurrentPage(page);
  }
  const onClick = (page) => {
    setCurrentPage(page);
  }

  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoPaging currentPage={12} limit={10} total={272} onClick={action('onClick')} />

      <NekoSpacer />

      <NekoTypo h3>Current Change</NekoTypo>
      <NekoPaging currentPage={currentPage} limit={limit} total={total} onClick={onClick} onCurrentPageChanged={onCurrentPageChanged} />

      <NekoSpacer />

      <NekoTypo h3>Infinite</NekoTypo>
      <NekoPaging currentPage={currentInfinitePage} onClick={onClickInfinite} controllerText={<>Infinite Page {currentInfinitePage}</>} infinite />
    </>
  );
}
