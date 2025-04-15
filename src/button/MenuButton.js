// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { ProOnly } from '../label/ProOnly';
import { Icon } from '@iconify/react';
import chevronDown from '@iconify/icons-mdi/chevron-down';
import { useOutsideClick, useComponentSize, useClasses } from '../hooks';

const MenuButtonWrapper = Styled.div`
  display: inline-block;
`;

const MenuButton = Styled.button`
  align-items: center;
  background-color: var(--neko-main-color);
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
  color: white;
  display: inline-flex;
  justify-content: space-between;
  height: 30px;
  min-width: 6em;
  padding: 0px 10px;
  text-align: center;
  transition: background-color .10s, opacity .25s;

  :not([disabled]):hover {
    cursor: pointer;
    background-color: var(--neko-lighten-blue);
  }

  :disabled {
    opacity: 0.35;
  }

  :focus {
    outline: none;
  }

  & + button {
    margin-left: .25rem;
  }
`;

const MenuItemContainer = Styled.div`
  position: relative;
  display: block;
  margin-top: 18px;
  background-color: var(--neko-main-color);
  position: absolute;
  z-index: 10;

  &:before {
    content: "";
    position: absolute;
    top: -18px;
    left: 50%;
    margin-left: -8px;
    border: 8px solid transparent;
    border-bottom: 10px solid var(--neko-main-color);
  }
`;

const StyledMenuButton = props => {

  const { title, disabled = false, isPro = false, style = {}, hideChevron, titleStyle = {} } = props;
  const [ isOpen, setIsOpen ] = React.useState(false);
  const wrapperRef = useOutsideClick(() => { setIsOpen(false) });
  const { ref: buttonRef, width: buttonWidth } = useComponentSize();

  const onClick = () => {
    setIsOpen(!isOpen);
  }

  const children = React.Children.toArray(props.children).filter(v => !!v).map(child => {
    return React.cloneElement(child, {
      isPro,
      disabled: child.props.disabled || disabled,
      onClick: () => {
        if (child.props.onClick) {
          child.props.onClick();
        }
        onClick();
      }
    });
  });

  return (
    <MenuButtonWrapper ref={wrapperRef} className="neko-menu-button-wrapper">
      <MenuButton ref={buttonRef} type="button" className="neko-menu-button" disabled={disabled} onClick={onClick} style={style}>
        <span style={titleStyle}>{title}</span>
        {!hideChevron && <Icon icon={chevronDown} width="24" height="24" style={{ marginLeft: '4px' }} />}
      </MenuButton>
      {isOpen &&
        <MenuItemContainer className="neko-menu-item-container" style={{ transform: `translateX(calc(-50% + ${buttonWidth / 2}px))` }}>
          {children}
        </MenuItemContainer>
      }
    </MenuButtonWrapper>
  );
};

const MenuItem = Styled.button`
  align-items: center;
  background-color: var(--neko-main-color);
  border: none;
  box-sizing: border-box;
  color: white;
  display: flex;
  width: 100%;
  padding: 8px 15px 8px 15px;
  text-align: center;
  transition: background-color .10s, opacity .25s;

  :not([disabled]):hover {
    cursor: pointer;
    background-color: var(--neko-lighten-blue);
  }

  :disabled:not(.is-pro) {
    opacity: 0.35;
  }

  :focus {
    outline: none;
  }

  &.is-pro {
    background-color: var(--neko-pro-gray);
    justify-content: space-between;
  }

  &.separator {
    border-top: 1px solid var(--neko-white);
    font-size: 10px;
    padding: 5px;
  }
`;

const StyledNekoMenuItem = props => {

  const { onClick = () => {}, children, isPro, requirePro = false, disabled, separator } = props;
  const needsProUser = requirePro && !isPro;
  const classNames = useClasses('neko-menu-item', { 'is-pro': needsProUser }, { separator });

  return (
    <MenuItem type="button" className={classNames} onClick={onClick} disabled={disabled || needsProUser}>
      <span>{children}</span>
      {needsProUser && !isPro && <ProOnly />}
    </MenuItem>
  );
};

/**
 * The NekoMenuButton works out of the box without specific attributes.
 */
const NekoMenuButton = (props) => {
  return (<StyledMenuButton {...props} />);
}
const NekoMenuItem = (props) => {
  return (<StyledNekoMenuItem {...props} />);
}

NekoMenuButton.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  isPro: PropTypes.bool,
  hideChevron: PropTypes.bool,
  style: PropTypes.object,
  titleStyle: PropTypes.object,
};

NekoMenuItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  requirePro: PropTypes.bool,
  separator: PropTypes.bool,
};

export { NekoMenuButton, NekoMenuItem };