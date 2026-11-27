import React, { useRef, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

import { NekoButton } from '../button/Button';
import { NekoIcon } from './Icon';
import { NekoContextMenu } from './ContextMenu';

// The popover is rendered through NekoContextMenu, which already handles the
// portal, outside-click, scroll/resize dismissal, smart vertical flip and
// iframe-aware positioning. NekoMoreMenu only owns the trigger and the styled
// list of rows.
const Menu = Styled.div`
  min-width: 210px;
  background: var(--neko-input-background);
  border: 1px solid var(--neko-input-border);
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(20, 30, 50, 0.18);
  padding: 6px;
  animation: nekoMoreMenuIn 0.12s ease-out;
  @keyframes nekoMoreMenuIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: none; }
  }
`;

const Item = Styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: transparent;
  border-radius: 7px;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  color: ${p => (p.$danger ? 'var(--neko-red)' : 'var(--neko-gray-30)')};
  transition: background 0.12s ease;

  &:hover { background: ${p => (p.$danger ? 'var(--neko-lighten-red)' : 'var(--neko-gray-95)')}; }

  &:disabled {
    opacity: 0.4;
    cursor: default;
    pointer-events: none;
  }
`;

const Sep = Styled.div`
  height: 1px;
  background: var(--neko-gray-90);
  margin: 6px 4px;
`;

const NekoMoreMenu = ({ items = [], disabled = false, label = '⋯', title = 'More',
  size = 'small', variant = 'secondary', buttonStyle, children }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  // NekoButton sizes through boolean small/large props, not a size string;
  // 'normal' maps to neither (the default 30px height).
  const sizeProps = { small: size === 'small', large: size === 'large' };

  const visible = items.filter(it => it && !it.hidden);

  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);

  // Run the row handler after the menu has closed, so any modal/confirm it
  // opens is not immediately dismissed by this menu's own outside-click.
  const handleItem = (it) => {
    close();
    it.onClick && it.onClick();
  };

  return (
    <>
      {/* Toggle on the capture phase: a button-like child (e.g. NekoButton)
          calls stopPropagation, so a bubbling onClick here would never fire
          and the menu would never open from a custom trigger. */}
      <span ref={triggerRef} style={{ display: 'inline-block' }}
        onClickCapture={disabled ? undefined : toggle}>
        {children || (
          <NekoButton {...sizeProps} variant={variant} disabled={disabled} title={title}
            style={{ fontWeight: 800, letterSpacing: '1px', ...buttonStyle }}>
            {label}
          </NekoButton>
        )}
      </span>
      <NekoContextMenu visible={open} targetRef={triggerRef} onClose={close} matchWidth={false}>
        <Menu role="menu">
          {visible.map((it, i) => (
            <Fragment key={i}>
              {it.separatorBefore && i > 0 && <Sep />}
              <Item type="button" role="menuitem" $danger={it.danger} disabled={it.disabled}
                onClick={() => handleItem(it)}>
                {it.icon && <NekoIcon icon={it.icon} width={15} height={15} />}
                <span>{it.label}</span>
              </Item>
            </Fragment>
          ))}
        </Menu>
      </NekoContextMenu>
    </>
  );
};

NekoMoreMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.node,
    icon: PropTypes.string,
    onClick: PropTypes.func,
    danger: PropTypes.bool,
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    separatorBefore: PropTypes.bool,
  })),
  disabled: PropTypes.bool,
  label: PropTypes.node,
  title: PropTypes.string,
  size: PropTypes.oneOf(['small', 'normal', 'large']),
  variant: PropTypes.string,
  buttonStyle: PropTypes.object,
  children: PropTypes.node,
};

export { NekoMoreMenu };
