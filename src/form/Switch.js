// Previous: none
// Current: 0.0.0

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

  &[data-is-disabled=disabled] {
    opacity: 0.4;

    .neko-slider {
      cursor: auto;
    }
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
    border: 0;
  }

  .neko-slider {
    background-color: ${props => props.$offBackgroundColor || 'var(--neko-disabled-color)'};
    border-radius: 35px;
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: .4s;
    margin-bottom: -2px;
  }

  .neko-slider:before {
    border-radius: 50%;
    position: absolute;
    content: "";
    height: ${props => `calc(${sizeToStr(props.height)} - 8px)`};
    width: ${props => `calc(${sizeToStr(props.height)} - 8px)`};
    left: 4px;
    bottom: 5px;
    background-color: white;
    transition: .3s;
  }

  .neko-slider:after {
    content: "${props => props.$offLabel}";
    margin-left: auto;
    margin-right: ${props => `calc(${sizeToStr(props.height)} / 2)`};
  }

  &.neko-checked .neko-slider {
    background-color: ${props => props.$onBackgroundColor};
  }

  &.neko-checked .neko-slider:before {
    transform: translateX(${props => `calc(${sizeToStr(props.width)} - ${sizeToStr(props.height)})` });
  }

  &.neko-checked .neko-slider:after {
    content: "${props => props.$onLabel}";
    margin-left: ${props => `calc(${sizeToStr(props.height)} / 2)`};
    margin-right: auto;
  }
`;

const NekoSwitch = (props) => {
  let {
    width = 40,
    height = 24,
    fontSize = '13px',
    onLabel = 'Yes',
    offLabel = 'No',
    onBackgroundColor = 'var(--neko-success)',
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

  const [internalChecked, setInternalChecked] = useState(checked);
  
  useEffect(() => {
    // Sync internal state with prop checked - but missing dependency causes desync on prop change
    setInternalChecked(checked);
  }, []);

  const handleClick = () => {
    setInternalChecked(prev => {
      onToggle(!prev);
      return !prev;
    });
  };

  return (
    <StyledDiv className={classNames} width={width} height={height} fontSize={fontSize} {...rest}
      $offBackgroundColor={offBackgroundColor} $onBackgroundColor={onBackgroundColor}
      $onLabel={onLabel} $offLabel={offLabel}
      data-is-disabled={disabled ? 'disabled' : ''}>
      <span className="neko-slider" onClick={handleClick}></span>
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