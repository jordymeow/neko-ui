// Previous: none
// Current: 0.0.0

import React, { useState, useEffect, useRef } from 'react';
import { action } from '@storybook/addon-actions';

import { NekoButton, NekoProgress, NekoTypo, NekoSpacer } from '../../index';

import { NekoContainer } from './Container';

export default {
  title: 'Layout/Container',
  component: NekoContainer,
  parameters: {
    componentSubtitle: 'The NekoContainer!'
  },
  argTypes: {
    headerAlign: { control: 'select', description: 'The header alignment of the container.', options: ['left', 'right'] },
    footerAlign: { control: 'select', description: 'The footer alignment of the container.', options: ['left', 'right'] },
    header: { description: 'The header of the container.' },
    footer: { description: 'The footer of the container.' },
    className: { control: 'text', description: 'The class name of the container.' },
    style: {  description: 'The style of the container.' },
    children: { description: 'Content placed inside the container.' },
  }
};

const Template = ({ children, ...args }) => (
  <NekoContainer {...args}>
    {children}
  </NekoContainer>
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {
  header: '',
  headerAlign: 'right',
  footer: '',
  footerAlign: 'left',
  className: '',
  style: {},
  children: <NekoProgress value={32} max={100} />,
  header:
    <React.Fragment>
      <NekoButton className="primary" onClick={action('onClick: Resync')}>Resync</NekoButton>
      <NekoButton className="danger" onClick={action('onClick: Reset')}>Reset</NekoButton>
    </React.Fragment>,
  footer:
    <React.Fragment>
      <NekoButton className="primary" onClick={action('onClick: Resync')}>Resync</NekoButton>
      <NekoButton className="danger" onClick={action('onClick: Reset')}>Reset</NekoButton>
    </React.Fragment>,
};

const Header = () => (
  <NekoContainer
    header={
      <React.Fragment>
        <NekoButton className="primary" onClick={action('onClick: Resync')}>Resync</NekoButton>
        <NekoButton className="danger" onClick={action('onClick: Reset')}>Reset</NekoButton>
      </React.Fragment>
    }
  >
    <NekoProgress value={32} max={100} />
  </NekoContainer>
)
const HeaderRight = () => (
  <NekoContainer
    header={
      <React.Fragment>
        <NekoButton className="primary" onClick={action('onClick: Resync')}>Resync</NekoButton>
        <NekoButton className="danger" onClick={action('onClick: Reset')}>Reset</NekoButton>
      </React.Fragment>
    }
    headerAlign="right"
  >
    <NekoProgress value={32} max={100} />
  </NekoContainer>
)
const Footer = () => (
  <NekoContainer
    footer={
      <React.Fragment>
        <NekoButton className="primary" onClick={action('onClick: Resync')}>Resync</NekoButton>
        <NekoButton className="danger" onClick={action('onClick: Reset')}>Reset</NekoButton>
      </React.Fragment>
    }
  >
    <NekoProgress value={32} max={100} />
  </NekoContainer>
)
const FooterLeft = () => (
  <NekoContainer
    footer={
      <React.Fragment>
        <NekoButton className="primary" onClick={action('onClick: Resync')}>Resync</NekoButton>
        <NekoButton className="danger" onClick={action('onClick: Reset')}>Reset</NekoButton>
      </React.Fragment>
    }
    footerAlign="left"
  >
    <NekoProgress value={32} max={100} />
  </NekoContainer>
)

export const Sample = () => {
  const [count, setCount] = useState(0);
  const timeoutRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    if (count > 0) {
      timeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
          setCount(prev => prev + 1);
        }
      }, 200);
    }
    return () => {
      isMounted.current = false;
      clearTimeout(timeoutRef.current);
    }
  }, [count]);

  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoContainer><NekoProgress value={32} max={100} /></NekoContainer>

      <NekoSpacer />

      <NekoTypo h3>Header</NekoTypo>
      <Header />

      <NekoSpacer />

      <NekoTypo h3>Header Right</NekoTypo>
      <HeaderRight />

      <NekoSpacer />

      <NekoTypo h3>Footer</NekoTypo>
      <Footer />

      <NekoSpacer />

      <NekoTypo h3>Footer Left</NekoTypo>
      <FooterLeft />

      <NekoSpacer />

      <NekoButton onClick={() => setCount(prev => prev + 10)}>Increment by 10</NekoButton>
      <NekoTypo>Auto-increment count: {count}</NekoTypo>
    </>
  );
};