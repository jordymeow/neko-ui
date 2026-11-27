import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';

function sizeToStr(value) {
  if (typeof value === 'number') return `${value}px`;
  return value;
}

const StyledDiv = Styled.div`
  color: var(--neko-white);
  font-family: var(--neko-font-family);
  font-size: ${props => props.fontSize};
  position: relative;
  display: inline-block;
  width: ${props => sizeToStr(props.width)};
  height: ${props => sizeToStr(props.height)};

  transition: opacity 300ms ease;
  
  &[data-is-disabled=disabled] {
    opacity: 0.6;

    .neko-slider {
      cursor: not-allowed;
      box-shadow: var(--neko-shadow-xs);
    }
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
    border: 0;
  }

  .neko-slider {
    background:
      linear-gradient(
        to bottom,
        color-mix(in srgb, ${props => props.$offBackgroundColor || 'var(--neko-disabled-color)'} 90%, white),
        ${props => props.$offBackgroundColor || 'var(--neko-disabled-color)'}
      );
    border-radius: 35px;
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    position: absolute;
    top: 0;

    &:focus-visible {
      outline: 2px solid var(--neko-main-color);
      outline-offset: 2px;
    }
    left: 0;
    right: 0;
    bottom: 0;
    transition: background 260ms ease-in-out, box-shadow 160ms ease-in-out;
    will-change: background, box-shadow;
    margin-bottom: -2px;
  }

  .neko-slider:before {
    border-radius: 50%;
    position: absolute;
    content: "";
    height: ${props => `calc(${sizeToStr(props.height)} - 8px)`};
    width: ${props => `calc(${sizeToStr(props.height)} - 8px)`};
    left: 4px;
    top: 50%;
    background-color: white;
    transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 160ms ease-in-out;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.18);
    will-change: transform, box-shadow;
    transform: translate(0, -50%);
  }

  .neko-slider:after {
    content: "${props => props.$offLabel}";
    margin-left: auto;
    margin-right: ${props => `calc(${sizeToStr(props.height)} / 2)`};
  }

  &.neko-checked .neko-slider {
    background:
      linear-gradient(
        to bottom,
        color-mix(in srgb, ${props => props.$onBackgroundColor} 90%, white),
        ${props => props.$onBackgroundColor}
      );
  }

  &.neko-checked .neko-slider:before {
    transform: translate(${props => `calc(${sizeToStr(props.width)} - ${sizeToStr(props.height)})`}, -50%);
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.18), 0 2px 4px rgba(16, 24, 40, 0.12);
  }

  &.neko-checked .neko-slider:after {
    content: "${props => props.$onLabel}";
    margin-left: ${props => `calc(${sizeToStr(props.height)} / 2)`};
    margin-right: auto;
  }

  /* Hover feedback — the thumb "peeks" toward its next position, track
     brightens, and the thumb gains a slightly bigger shadow. Active state
     presses the thumb into the track. */
  &:not([data-is-disabled=disabled]) .neko-slider:hover {
    filter: brightness(1.06);
    box-shadow: var(--neko-shadow-sm);
  }
  &:not([data-is-disabled=disabled]) .neko-slider:hover:before {
    box-shadow:
      0 1px 2px rgba(16, 24, 40, 0.18),
      0 3px 8px rgba(16, 24, 40, 0.15);
    /* Off → nudge right, On → nudge left */
    transform: translate(3px, -50%);
  }
  &.neko-checked:not([data-is-disabled=disabled]) .neko-slider:hover:before {
    transform: translate(calc(${props => `${sizeToStr(props.width)} - ${sizeToStr(props.height)}`} - 3px), -50%);
  }

  &:not([data-is-disabled=disabled]) .neko-slider:active {
    filter: brightness(0.97);
  }

  @media (prefers-reduced-motion: reduce) {
    .neko-slider { transition: none; }
    .neko-slider:before { transition: none; }
  }
`;

/**
 * @param {string} id
 * @param {string} name
 * @param {bool} checked
 * @param {string} label
 * @param {string} description
 */
const NekoSwitch = (props) => {
  let {
    width,
    height = 24,
    fontSize = '13px',
    onLabel = 'Yes',
    offLabel = 'No',
    onBackgroundColor = 'var(--neko-accent-color)',
    offBackgroundColor = 'var(--neko-disabled-color)',
    onValue,
    offValue,
    small,
    checked = false,
    onChange,
    disabled = false,
    ...rest
  } = props;
  const classNames = useClasses('neko-switch', { small, 'neko-checked': checked } );

  const onToggle = useCallback((checkedValue) => {
    if (disabled) return;
    const on = onValue !== undefined ? onValue : true;
    const off = offValue !== undefined ? offValue : false;
    onChange(checkedValue ? on : off);
  }, [onValue, offValue, onChange, disabled]);

  if (small) {
    height = 20;
    fontSize = '11px';
  }

  // Auto-calculate width if not provided
  const hasText = (onLabel && onLabel !== '') || (offLabel && offLabel !== '');
  const calculatedWidth = width || (hasText ? 70 : 40);

  return (
    <StyledDiv className={classNames} width={calculatedWidth} height={height} fontSize={fontSize} {...rest}
      $offBackgroundColor={offBackgroundColor} $onBackgroundColor={onBackgroundColor}
      $onLabel={onLabel} $offLabel={offLabel}
      data-is-disabled={disabled ? 'disabled' : ''}>
      {/* This was a bare span with an onClick, so a switch could only be thrown with a mouse and
          announced itself as nothing at all. role="switch" with aria-checked tells a screen
          reader both what it is and which way it is set. Some switches label themselves from
          outside, so an empty onLabel/offLabel falls back to no aria-label at all: an empty one
          would wipe out the accessible name rather than add to it. */}
      <span className="neko-slider"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled ? 'true' : undefined}
        aria-label={rest['aria-label'] || (checked ? onLabel : offLabel) || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={() => onToggle(!checked)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            onToggle(!checked);
          }
        }}></span>
    </StyledDiv>
  );
};

NekoSwitch.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fontSize : PropTypes.string,
  onValue: PropTypes.string,
  offValue: PropTypes.string,
  checked: PropTypes.bool,
  onBackgroundColor: PropTypes.string,
  offBackgroundColor: PropTypes.string,
  onLabel: PropTypes.string,
  offLabel: PropTypes.string
};

export { NekoSwitch };
