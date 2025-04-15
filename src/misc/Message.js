// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from "../hooks";

const MessageContainer = Styled.div`
  padding: 20px;
  color: white;
  border-radius: 5px;

  &.danger {
    background: #ba341e;
  }

  &.success {
    background: var(--neko-green);
  }

  &.special {
    background: var(--neko-purple);
  }

  &.warning {
    background: var(--neko-orange);
  }

  &.info {
    background: var(--neko-blue);
  }

  a {
    color: white;
    font-weight: bold;
  }
`;

const StyledNekoMessage = (props) => {
  let { variant, children, ...rest } = props;
  if (!variant) {
    variant = 'info';
  }
  const className = useClasses(
    'neko-message',
    {'danger': variant === 'danger'},
    {'success': variant === 'success'},
    {'info': variant === 'info'},
    {'warning': variant === 'warning'},
    {'special': variant === 'special'}
  );

  return <MessageContainer className={className} {...rest}>
    { children }
  </MessageContainer>
}

const NekoMessage = (props) => {
  return <StyledNekoMessage {...props} />;
};

NekoMessage.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
};

export { NekoMessage };
