// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from "../hooks";
import { NekoContainer } from '../layout/Container';

const NotificationContainer = Styled(NekoContainer)`
  &.neko-info {
    border-left: 4px solid #007bba;
  }

  &.neko-warning {
    border-left: 4px solid #f1ad31;
  }

  &.neko-error {
    border-left: 4px solid #d85960;
  }
`;

const StyledNekoNotification = (props) => {
  const { variant, children } = props;
  const className = useClasses( 'neko-notification',
    { 'neko-info': variant === 'info' },
    { 'neko-warning': variant === 'warning' },
    { 'neko-error': variant === 'error' }
  );

  return <NotificationContainer className={className}>
    { children }
  </NotificationContainer>
}

const NekoNotification = (props) => {
  return <StyledNekoNotification {...props} />;
};

NekoNotification.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
};

export { NekoNotification };
