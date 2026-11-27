import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';
import { NekoErrorBoundary } from '../helpers';

const Wrapper = Styled.div`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    width: max-content;
    overflow-x: auto;
    padding: 0 350px 0 0;

   .neko-tab-content {
      max-width: 1200px;
    }

    .neko-tabs.inversed {
      max-width: 500px;

      .neko-accordion {
        max-width: 450px;
        overflow-x: hidden;
      }
    }

    .neko-block {
       max-width: 500px;

       .neko-block-content {
         overflow-x: scroll;

         table {
          width: max-content;
          }
        }
    }
`;

const Column = Styled.div`
  flex: ${props => props.$flex || 1};
  min-width: 0;
  padding: 32px 30px;

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

  /* Minimal columns sit flush — give them a clean gap when adjacent on the same row.
     Exclude .full (full-width) columns which wrap to their own line. */
  &.minimal:not(.full) + .minimal:not(.full) {
    margin-left: 20px;
  }
`;

/**
 * @param {string} className
 */
const StyledNekoWrapper = props => {
  const { children, ...rest } = props;
  return (
    <Wrapper className='neko-wrapper' {...rest}>
      { children }
    </Wrapper>
  );
};

const StyledNekoColumn = props => {
  const { fullWidth, minimal, size, ...rest } = props;
  const className = useClasses('neko-column' , { 'full': fullWidth }, { minimal });
  
  // Convert size prop to flex value
  const sizeMap = {
    '1/2': 1,
    '1/3': 1,
    '2/3': 2,
    '1/4': 1,
    '3/4': 3,
    '1/5': 1,
    '2/5': 2,
    '3/5': 3,
    '4/5': 4,
    '1/6': 1,
    '5/6': 5,
  };
  
  const flex = size ? (sizeMap[size] || parseFloat(size)) : undefined;
  
  return (
    <Column className={className} $flex={flex} {...rest}>{props.children}</Column>
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
  fullWidth: PropTypes.any,
  minimal: PropTypes.bool,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['1/2', '1/3', '2/3', '1/4', '3/4', '1/5', '2/5', '3/5', '4/5', '1/6', '5/6']),
    PropTypes.number,
    PropTypes.string
  ])
};

export { NekoWrapper, NekoColumn };
