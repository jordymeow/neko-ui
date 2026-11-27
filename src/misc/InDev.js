import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledNekoInDev = styled.div`
  position: relative;
  border: 2px dashed orange;
  padding: 5px;
  background: #fff5e2;
  
  &::before {
    content: 'IN DEVELOPMENT';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: clamp(20px, 5vw, 60px);
    font-weight: bold;
    color: rgba(255, 165, 0, 0.1);
    white-space: nowrap;
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
`;

const NekoInDev = ({ children, devMode = false, ...rest }) => {
  if (!devMode) {
    return null;
  }
  
  return (
    <StyledNekoInDev {...rest}>
      {children}
    </StyledNekoInDev>
  );
};

NekoInDev.propTypes = {
  children: PropTypes.node,
  devMode: PropTypes.bool,
};

export { NekoInDev };