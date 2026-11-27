import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';
import { getProUrl } from '../common/proUrl';

const Tag = Styled.a`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg,
    var(--neko-orange, #f97316),
    color-mix(in oklab, var(--neko-orange, #f97316) 75%, var(--neko-red, #dc2626))
  );
  position: relative;
  border-radius: 4px;
  color: white !important;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.4px;
  line-height: 1;
  padding: 3px 5px;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transition: filter 0.2s var(--neko-ease-out), transform 0.2s var(--neko-ease-spring);

  &:hover {
    filter: brightness(1.06);
    transform: translateY(-0.5px);
  }

  &.inline {
    display: inline-flex;
    margin-left: 6px;
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

  const { show = true, className, href, ...rest } = props;
  const classNames = useClasses('neko-pro-only', className);

  if (!show) {
    return null;
  }

  return (
    <Tag href={getProUrl(href, 'pro-badge')} target='_blank' rel='noopener noreferrer'
      onClick={(e) => e.stopPropagation()} className={classNames} {...rest}>
      Pro
    </Tag>
  );
};

const ProOnly = (props) => {
  return (<StyledProOnly {...props} />);
}

ProOnly.propTypes = {
  show: PropTypes.bool,
  className: PropTypes.string,
  href: PropTypes.string
};

export { ProOnly };
