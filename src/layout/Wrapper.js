// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';
import { NekoErrorBoundary } from '../helpers';

const Wrapper = Styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Column = Styled.div`
  flex: 1;
  padding: 32px 30px;

  .neko-block:not(:first-child) {
    margin-top: -20px;
  }

  .neko-block:last-child {
    margin-bottom: 0px;
  }

  &.minimal {
    padding: 0;
  }

  &.full {
    flex-basis: 100%;
    padding-bottom: 0;
  }

  & + .full {
    padding-bottom: 32px;
    padding-top: 0;
  }

  &:not(.full) + div:not(.full) {
    padding-left: 0;
  }
`;

/**
 * @param {string} className
 */
const StyledNekoWrapper = props => {
  return (
    <Wrapper className='neko-wrapper'>
      { props.children }
    </Wrapper>
  );
};

const StyledNekoColumn = props => {
  const { fullWidth, minimal, ...rest } = props;
  const className = useClasses('neko-column' , { 'full': fullWidth }, { minimal });
  return (
    <Column className={className} {...rest}>{props.children}</Column>
  );
};

const NekoWrapper = (props) => {
  return (<NekoErrorBoundary><StyledNekoWrapper {...props} /></NekoErrorBoundary>);
};

const NekoColumn = (props) => {
  return (<NekoErrorBoundary><StyledNekoColumn {...props} /></NekoErrorBoundary>);
};

NekoWrapper.propTypes = {
};

NekoColumn.propTypes = {
  fullWidth: PropTypes.any
};

export { NekoWrapper, NekoColumn };
