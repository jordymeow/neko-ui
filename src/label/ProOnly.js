// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';

const Tag = Styled.a`
  background-color: var(--neko-yellow);
  position: relative;
  border-radius: 10px;
  color: white !important;
  font-size: 9px;
  line-height: 10px;
  padding: 5px 8px;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.1);
  }

  &.inline {
    display: inline;
    margin-left: 5px;
    vertical-align: middle;
  }
`;

/**
 * @param {string} className
 * @param {string|object} icon
 * @param {bool} disabled
 * @param {function} onClick
 */
const StyledProOnly = (props) => {

  const { show = true, className, ...rest } = props;
  const classNames = useClasses('neko-pro-only', className);

  if (!show) {
    return null;
  }

  return (
    <Tag href='https://meowapps.com' target='_blank' className={classNames} {...rest}>
      Pro Only
    </Tag>
  );
};

const ProOnly = (props) => {
  return (<StyledProOnly {...props} />);
}

ProOnly.propTypes = {
  show: PropTypes.bool,
  className: PropTypes.string
};

export { ProOnly };
