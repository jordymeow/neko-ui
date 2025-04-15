// Previous: none
// Current: 0.0.0

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoIcon } from '../misc/Icon';
import { useClasses } from '../hooks';

const LinkContainer = Styled.div`
  display: flex;
  align-items: center;
`;

const Link = Styled.span`
  color: var(--neko-main-color);
  cursor: pointer;
  font-family: var(--neko-font-family);
  font-style: normal;
  font-weight: normal;
  line-height: 17px;

  &:hover:not(.active) {
    filter: brightness(1.2);
  }

  &.active {
    cursor: default;
    color: var(--neko-gray-30);
    font-weight: bold;
  }

  &::after {
    content: "|";
    color: var(--neko-disabled-color);
    font-weight: normal;
    padding: 0 4px;
  }

  &:last-child::after {
    content: none;
  }

  span {
    color: var(--neko-disabled-color);
    font-weight: normal;
    margin-left: 4px;
  }
`;

const StyledNekoQuickLinks = props => {
  const { name, value, onChange, busy = false, className } = props;
  const classNames = useClasses('neko-quick-links', className);

  const children = React.Children.toArray(props.children).filter(v => !!v).map(child => {
    return React.cloneElement(child, {
      busy: busy,
      isActive: child.props.value === value,
      onClick: (newValue) => {
        if (newValue !== value) {
          onChange(newValue, name);
        }
      }
    });
  });

  return (
    <LinkContainer className={classNames}>{children}</LinkContainer>
  );
};

const StyledNekoLink = props => {
  const { title, value = 0, count, onClick, busy, isActive = false, className } = props;
  const classNames = useClasses('neko-link', className, { 'active': isActive });

  return (
    <Link onClick={() => onClick(value)} className={classNames}>
      {title}
      {count === undefined ? null :
        <span>(
          {busy ? 
            <NekoIcon icon="replay" spinning={true} width={12} containerStyle={{ display: 'inline' }} /> : 
            count
          })
        </span>
      }
    </Link>
  );
};

const NekoQuickLinks = (props) => {
  return (<StyledNekoQuickLinks {...props} />);
};

NekoQuickLinks.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const NekoLink = (props) => {
  return (<StyledNekoLink {...props} />);
};

NekoLink.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  count: PropTypes.number,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

export { NekoQuickLinks, NekoLink };

