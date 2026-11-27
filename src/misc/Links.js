import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoIcon } from '../misc/Icon';
import { useClasses } from '../hooks';

const LinkContainer = Styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 4px;
`;

const Link = Styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--neko-gray-50);
  cursor: pointer;
  font-family: var(--neko-font-family);
  font-weight: 500;
  font-size: 13px;
  line-height: 1.2;
  letter-spacing: 0;
  padding: 5px 10px;
  border-radius: 999px;
  transition:
    color var(--neko-duration-base) var(--neko-ease-out),
    background var(--neko-duration-base) var(--neko-ease-out);

  &:hover:not(.active) {
    color: var(--neko-font-color);
    background: color-mix(in oklab, var(--neko-main-color) 6%, transparent);
  }

  &.active {
    cursor: default;
    color: var(--neko-main-color);
    font-weight: 600;
    background: color-mix(in oklab, var(--neko-main-color) 10%, transparent);
  }

  &:focus-visible {
    outline: 2px solid var(--neko-main-color);
    outline-offset: 2px;
  }

  /* Inversed, for use on dark or branded surfaces like TabContent (blue) */
  &.inversed {
    color: rgba(255, 255, 255, 0.7);

    &:hover:not(.active) {
      color: white;
      background: rgba(255, 255, 255, 0.12);
    }

    &.active {
      color: white;
      background: rgba(255, 255, 255, 0.18);
    }

    &:focus-visible {
      outline-color: white;
    }
  }

  span {
    color: inherit;
    opacity: 0.7;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }
`;

const StyledNekoQuickLinks = props => {
  const { name, value, onChange, busy = false, className, inversed } = props;
  const classNames = useClasses('neko-quick-links', className, { inversed });

  const children = React.Children.toArray(props.children).filter(v => !!v).map(child => {
    return React.cloneElement(child, {
      busy: busy,
      inversed,
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
  const { title, value = 0, count, onClick, busy, isActive = false, className, inversed } = props;
  const classNames = useClasses('neko-link', className, { 'active': isActive, inversed });

  // These are spans, so without this they are invisible to the keyboard: the whole Settings
  // sub-navigation was reachable by mouse only. Kept as role="button" rather than the ARIA tab
  // pattern because NekoQuickLinks is also used for filters and counters, not only for tabs.
  const activate = () => onClick(value);

  return (
    <Link onClick={activate} className={classNames}
      role="button" tabIndex={0} aria-current={isActive ? 'true' : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          activate();
        }
      }}>
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
  onChange: PropTypes.func,
  inversed: PropTypes.bool
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
  inversed: PropTypes.bool,
};

export { NekoQuickLinks, NekoLink };
