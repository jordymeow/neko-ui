// Previous: none
// Current: 0.0.0

import { NekoLogo } from './Logo';

import { NekoTypo } from '../../index';

export default {
  title: 'Components/Logo',
  component: NekoLogo,
  parameters: {
    componentSubtitle: 'The NekoLogo!'
  },
};

export const Default = {};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoLogo />
    </>
  );
};
