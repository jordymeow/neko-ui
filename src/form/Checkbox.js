// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ProOnly } from '../label/ProOnly';
import { NekoSpinner } from '../misc/Spinner';
import { useClasses } from '../hooks';

// Styled component
const StyledNekoCheckboxWrapper = styled.div`
  user-select: none;
  transition: color 0.3s ease;

  &.disabled {
    color: var(--neko-disabled-color);

    .neko-content {
      cursor: default;
    }

    .neko-checkbox-check-container, .neko-label, .description {
      opacity: 0.35;
    }
  }

  input {
    display: none;
  }

  .neko-content {
    cursor: pointer;
    display: flex;
  }

  .neko-checkbox-check-container {
    display: flex;
    padding-top: 2px;
    align-content: center;

    .neko-checkbox-busy-container {
      position: relative;
    }
  }

  .neko-checkbox-inner-container {
    margin-left: 6px;

    .neko-label-container {
      display: flex;
      margin-top: 5px;

      .neko-label {
        display: block;
        ${({ checked, disabled }) =>
          !disabled && checked ? 'color: var(--neko-main-color); font-weight: 600;' : ''}
      }
    }

    .neko-content {
      display: block;
      font-size: var(--neko-font-size);
      line-height: 28px;
    }

    .description {
      display: block;
      font-size: var(--neko-small-font-size);
      margin-top: 1px;
      line-height: 14px;
      color: var(--neko-gray-60);

      * {
        font-size: var(--neko-small-font-size);
        line-height: inherit;
        margin: 0;
      }
    }
  }

  .neko-checkbox {
    width: 22px;
    height: 22px;
    border: 2px solid var(--neko-input-border);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .neko-checked-mark {
      position: absolute;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      transform: rotate(45deg);
      transform-origin: center;
      margin-top: -8%;
      height: 45%;
      width: 18%;
      border-bottom: 2.5px solid white;
      border-right: 2.5px solid white;
    }

    &.small {
      width: 20px;
      height: 20px;
      border: 2px solid var(--neko-input-border);
      border-radius: 8px;

      .neko-checked-mark {
        border-bottom-width: 1.5px;
        border-right-width: 1.5px;
      }
    }

    .neko-indeterminate-mark {
      position: absolute;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      width: 50%;
      border-bottom: 1.5px solid white;
      border-right: 1.5px solid white;
    }

    &.disabled {
      border: 1.5px solid var(--neko-disabled-color);
      cursor: not-allowed;
      filter: grayscale(1);
    }
  }

  .neko-checked {
    border: 2px solid var(--neko-main-color);

    &.neko-checkbox {
      background-color: var(--neko-main-color);

      .neko-checked-mark {
        opacity: 1;
      }
    }
  }

  .neko-indeterminate {
    &.neko-checkbox {
      background-color: var(--neko-main-color);

      .neko-indeterminate-mark {
        opacity: 1;
      }
    }
  }

  &:hover {
    .neko-checkbox {
      ${({ checked, disabled }) =>
        !disabled && checked ? 'filter: brightness(1.1);' : ''}
    }

    ${({ checked, disabled }) =>
      !disabled && !checked ? 'border-color: var(--neko-main-color);' : ''}
    }
  }
`;

const StyledNekoCheckbox = (props) => {
  const {
    name,
    checked = false,
    indeterminate = false,
    onChange,
    label,
    description,
    isPro = false,
    disabled,
    requirePro = false,
    isBusy = false,
    small = false,
    ...rest
  } = props;

  const showUpProOnly = requirePro && !isPro;
  const isDisabled = disabled || showUpProOnly;
  const classNames = useClasses('neko-checkbox', props.className, { disabled: isDisabled, small });
  const checkboxClassNames = useClasses('neko-checkbox', { 
    disabled: isDisabled,
    'neko-checked': checked,
    'neko-indeterminate': indeterminate,
    small
  });
  const checkboxMarkClassNames = useClasses('neko-checked-mark', { 'extra-class': true });
  const checkboxIndeterminateClassNames = useClasses('neko-indeterminate-mark');

  const onClick = (e) => {
    if (isDisabled) {
      return;
    }
    if (!onChange) {
      console.log(`The onChange handler is not set for the NekoCheckbox.`, props);
      return;
    }
    onChange(checked, name, e);
  };

  return (
    <StyledNekoCheckboxWrapper 
      className={classNames} 
      checked={checked} 
      disabled={isDisabled} 
      onClick={(e) => e.stopPropagation()} 
      {...rest}
    >
      <div className="neko-checkbox-container">
        <div className="neko-content" onClick={onClick}>
          <div className="neko-checkbox-check-container">

            {isBusy && <div className='neko-checkbox-busy-container'>
              <div className={checkboxClassNames}>
                <NekoSpinner type="circle" size="16px" />
              </div>
            </div>}

            {!isBusy && <>
              <div className={checkboxClassNames}>
                <div className={checkboxMarkClassNames} />
                <div className={checkboxIndeterminateClassNames} />
              </div>
            </>}

          </div>

          {(label || showUpProOnly || description) && <div className="neko-checkbox-inner-container">
            <span className="neko-label-container">
              <span className="neko-label">{label}</span>
              <ProOnly className="inline" show={showUpProOnly} style={{ position: 'relative', top: -1 }} />
            </span>
            {description ? <small className="description">{description}</small> : null}
          </div>}

        </div>
      </div>
    </StyledNekoCheckboxWrapper>
  );
};

StyledNekoCheckbox.propTypes = {
  name: PropTypes.string,
  checked: PropTypes.bool,
  label: PropTypes.string,
  description: PropTypes.string,
  isPro: PropTypes.bool,
  requirePro: PropTypes.bool,
  isBusy: PropTypes.bool,
  small: PropTypes.bool,
};