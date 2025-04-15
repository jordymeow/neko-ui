// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SpacerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${({height}) => `${height}px`};
`;

const EmptyWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  hr {
    width: 100%;
    border: none;
    border-top: 1px solid var(--neko-secondary);
  }
`;

const TextWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  text-align: center;

  &::before,
  &::after {
    content: '';
    flex-grow: 1;
    border-top: ${({line}) => line ? '1px solid var(--neko-secondary)' : 'none'};
    height: 0;
  }

  &::before {
    margin-right: 0.5em;
  }

  &::after {
    margin-left: 0.5em;
  }
`;

const NekoSpacer = props => {
  let {
    height = null,
    tiny = false,
    small = true,
    medium = false,
    large = false,
    line = false,
    style,
    children,
    ...rest
  } = props;

  if (!height) {
    if (children || medium) {
      height = 30;
    }
    else if (tiny) {
      height = 5;
    }
    else if (large) {
      height = 45;
    }
    else if (small) {
      height = 15;
    }
  }

  return (
    <SpacerContainer height={height} style={style} {...rest}>
      {children && <TextWrapper line={line}>{children}</TextWrapper>}
      {!children && <EmptyWrapper>{line && <hr />}</EmptyWrapper>}
    </SpacerContainer>
  );
};

NekoSpacer.propTypes = {
  height: PropTypes.number,
  line: PropTypes.bool,
  tiny: PropTypes.bool,
  small: PropTypes.bool,
  medium: PropTypes.bool,
  large: PropTypes.bool,
  style: PropTypes.object,
};

export { NekoSpacer };
