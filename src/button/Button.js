// Previous: none
// Current: 0.0.0

import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { Icon } from '@iconify/react';
import { NekoSpinner } from '../misc/Spinner';
import { NekoIcon } from '../misc/Icon';
import { ProOnly } from '../label/ProOnly';
import { useInterval, useClasses } from '../hooks';

const StyledButton = Styled(props => {

  let {
    className = 'primary',
    disabled = false,
    icon = null,
    color = null,
    onClick = () => {},
    rounded,
    isBusy = false,
    spinning = false,
    disabledColor = null,
    busyText,
    hideBusyIcon = false,
    busyIconSize,
    requirePro = false,
    isPro = false,
    small,
    width,
    height,
    fullWidth,
    startTime = null,
    children,
    ...rest
  } = props;

  disabled = disabled && !isBusy;

  const hasIcon = !!icon;
  const needsProUser = requirePro && !isPro;
  const iconWidth = useMemo(() => {
    let base = width ?? 30;

    if (small) {
      base = base * 0.8;
    }

    return rounded ? base - 10 : base - 6;
  }, [width, rounded, small]);
  const spinnerSize = useMemo(() => {
    if (busyIconSize) return busyIconSize;
    return '22px';
  }, [busyIconSize]);

  const [now, setNow] = useState(startTime ? new Date() : null);
  useInterval(() => {
    if (startTime) {
      setNow(new Date());
    }
  }, startTime ? 1000 : null);
  useEffect(() => {
    if (!startTime) {
      setNow(null);
    }
  }, [startTime]);

  const chronoTime = useMemo(() => {
    if (!startTime || !now) { return null; }
    const diff = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [now, startTime]);

  const onClickEvent = (ev) => {
    if (!disabled) {
      onClick();
    }
    ev.stopPropagation();
    ev.preventDefault();
  };

  const classNames = useClasses('neko-button', className, { 'has-icon': hasIcon },
    { 'custom-color': color }, { small }, { rounded }, { busy: isBusy },
    { 'is-pro': needsProUser }, { 'full': fullWidth });

  return (
    <button type="button" className={classNames} onClick={onClickEvent} disabled={disabled || needsProUser} {...rest}>
      {isBusy && !hideBusyIcon && <>
        <NekoSpinner type="circle" color="#fff" size={spinnerSize} />
      </>}
      {isBusy && chronoTime && <span className="chrono-time">
        {chronoTime}
      </span>}
      {isBusy && !!busyText && <span style={{ marginLeft: hideBusyIcon ? 0 : '4px', marginRight: '2px' }}>
        {busyText}
      </span>}
      {hasIcon && !isBusy && 
        <NekoIcon raw icon={icon} width={iconWidth} height={iconWidth} spinning={spinning} 
          style={ rounded ? { margin: '0 auto' } : {}}
        />
      }
      {!!children && !isBusy && 
        <span style={{ marginLeft: hasIcon ? '4px' : 0, marginRight: hasIcon ? '2px' : 0 }}>
          {children}
        </span>
      }
      {needsProUser && <ProOnly style={{ marginLeft: '8px' }} />}
    </button>
  );
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 30px;
  min-height: 30px;
  min-width: 40px;
  border: none;
  border-radius: 4px;
  text-align: center;
  padding: 0 15px;
  vertical-align: middle;
  background-color: var(--neko-main-color);
  color: white;

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
  }

  .chrono-time {
    font-size: 11px;
    margin-left: 5px;
  }

  &:not([disabled]):hover {
    cursor: pointer;
    background-image: none;
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.35;
  }

  &:focus {
    outline: none;
  }

  &.is-pro {
    background-image: none;
    background-color: var(--neko-main-color-disabled);
    rgb(255 255 255 / 65%);
    align-items: center;
    opacity: 1;
  }

  &.has-icon {
    align-items: center;
    padding: 2.5px 8px;

    svg {
      color: white;
    }
  }

  &.secondary {
    background-image: none;
    background-color: var(--neko-secondary);
    color: var(--neko-main-color);
    border: 1px solid var(--neko-input-border);

    svg {
      color: var(--neko-main-color);
    }

    &:hover {
      background-color: var(--neko-secondary);
      border: 1px solid var(--neko-input-border);
      filter: brightness(1.025);
    }
  }

  &.danger {
    background-image: none;
    background-color: var(--neko-danger);
    border-color: var(--neko-danger);
  }

  &.success {
    background-image: none;
    background-color: var(--neko-green);
    border-color: var(--neko-green);

    &:hover {
      background-color: var(--neko-lighten-green);
    }
  }

  & + button {
    margin-left: .25rem;
  }

  &.small {
    font-size: var(--neko-small-font-size);
    height: 24px;
    min-height: 24px;
  }

  &.header {
    background-image: none;
    filter: brightness(1.1);
    background-color: var(--neko-main-color);
    height: 40px;
    padding: 0 20px;

    &:hover {
      background-color: var(--neko-main-color);
      filter: brightness(1.2);
    }
  }

  &.rounded {
    border-radius: 100%;
    min-width: 30px;
    height: ${props => props.height ?? (props.width ?? 30)}px;
    width: ${props => props.width ?? 30}px;
    padding: 3px;
  }

  &.busy {
    pointer-events: none;
  }

  &.full {
    width: 100%;
  }

  ${props => additionalColor(props.color)}
`;

const additionalColor = (color) => {
  if (color) {
    const isDirect = /^#|^rgb\(|^rgba\(|^hsl\(/.test(color);
    const bgColor = isDirect ? color : `var(--neko-${color})`;
    const borderColor = isDirect ? color : `var(--neko-${color})`;

    return `
      &.custom-color {
        background-color: ${bgColor};
        border: 1px solid ${borderColor};

        &:hover {
          background-color: ${bgColor};
          filter: brightness(1.1);
        }
      }
    `;
  }
};

const NekoButton = (props) => {
  return (<StyledButton {...props} />);
};

NekoButton.propTypes = {
  className: PropTypes.oneOf(['primary', 'primary-block', 'secondary', 'danger', 'success', 'header']),
  disabled: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.instanceOf(Icon), PropTypes.oneOf(['setting', 'edit', 'trash'])]),
  color: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  rounded: PropTypes.bool,
  isBusy: PropTypes.bool,
  spinning: PropTypes.bool,
  busyText: PropTypes.string,
  hideBusyIcon: PropTypes.bool,
  busyIconSize: PropTypes.string,
  requirePro: PropTypes.bool,
  isPro: PropTypes.bool,
  disabledColor: PropTypes.string,
};

export { NekoButton };