import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ProOnly } from '../label/ProOnly';
import { NekoSpinner } from '../misc/Spinner';
import { useClasses, useDeprecatedIsBusy } from '../hooks';

// Styled component
const StyledNekoCheckboxWrapper = styled.div`
  user-select: none;
  transition: color 0.3s ease, opacity 0.3s ease;
  
  ${({ color, variant }) => {
    if (variant === 'danger') {
      return `
        --checkbox-color: var(--neko-danger);
      `;
    }
    if (!color) return '';
    return `
      --checkbox-color: var(--neko-${color});
    `;
  }}

  &.disabled {
    color: var(--neko-disabled-color);
    cursor: not-allowed;

    .neko-content {
      cursor: not-allowed;
    }

    .neko-checkbox-check-container, .neko-label, .description {
      opacity: 0.35;
      transition: opacity 0.3s ease;
    }
  }

  input {
    display: none;
  }

  /* The small box is 20px but the label row keeps the 30px control height, so center the box on it. */
  &.small .neko-checkbox-check-container {
    height: var(--neko-control-height);
    align-items: center;
  }

  .neko-content {
    cursor: pointer;
    display: flex;
    align-items: flex-start;

    /* The checkbox is a div, so nothing draws a focus ring for it. Without this a keyboard
       user can tab onto it and have no idea where they are. */
    &:focus-visible {
      outline: 2px solid var(--neko-main-color, #2271b1);
      outline-offset: 2px;
      border-radius: 3px;
    }
  }

  .neko-checkbox-check-container {
    display: flex;

    .neko-checkbox-busy-container {
      position: relative;
    }
  }

  .neko-checkbox-inner-container {
    margin-left: 8px;

    .neko-label-container {
      display: flex;
      align-items: center;
      /* Label height matches the checkbox control height so the label text
         sits vertically centered with the box — both fit a single visual row. */
      min-height: var(--neko-control-height);
      line-height: 17px;

      .neko-label {
        display: block;
        transition: color 0.18s var(--neko-ease-out);
        ${({ checked, disabled, color, variant }) => {
          if (disabled) return '';
          if (checked) {
            const colorVar = (variant === 'danger' || color)
              ? 'var(--checkbox-color, var(--neko-accent-color))'
              : 'var(--neko-accent-color)';
            return `color: ${colorVar}; font-weight: 600;`;
          }
          return '';
        }}
      }
    }

    .neko-content {
      display: block;
      font-size: var(--neko-font-size);
      line-height: var(--neko-control-height);
    }

    .description {
      display: block;
      font-size: var(--neko-small-font-size);
      /* Pull closer to the label text, which is vertically centered inside the control-height line-box */
      margin-top: -4px;
      line-height: 14px;
      color: var(--neko-gray-60);

      code {
        font-size: 9px;
        background: #016fba14;
        border-radius: 5px;
        padding: 2px 4px;
      }

      * {
        font-size: var(--neko-small-font-size);
        line-height: inherit;
        margin: 0;
      }
    }
  }

  .neko-checkbox {
    width: var(--neko-control-height);
    height: var(--neko-control-height);
    box-sizing: border-box;
    border: 1.5px solid var(--neko-gray-80);
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition:
      box-shadow 0.22s var(--neko-ease-out),
      background 0.22s var(--neko-ease-out),
      border-color 0.22s var(--neko-ease-out),
      transform 0.32s var(--neko-ease-spring);
    background: white;
    box-shadow: var(--neko-shadow-xs);

    .neko-checked-mark {
      position: absolute;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      transform: rotate(45deg);
      transform-origin: center;
      margin-top: -8%;
      height: 42%;
      width: 17%;
      border-bottom: 2.5px solid white;
      border-right: 2.5px solid white;
    }

    &.small {
      width: 20px;
      height: 20px;
      border: 1.5px solid var(--neko-gray-80);
      border-radius: 5px;

      .neko-checked-mark {
        border-bottom-width: 1.5px;
        border-right-width: 1.5px;
      }
    }

    &:hover:not(.disabled):not(.neko-checked):not(.neko-indeterminate) {
      border-color: color-mix(in oklab, var(--checkbox-color, var(--neko-accent-color)) 55%, var(--neko-gray-80));
      background: color-mix(in oklab, var(--checkbox-color, var(--neko-accent-color)) 6%, white);
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
    &.neko-checkbox {
      border: 1.5px solid var(--checkbox-color, var(--neko-accent-color));
      background: var(--checkbox-color, var(--neko-accent-color));
      box-shadow:
        0 2px 6px color-mix(in oklab, var(--checkbox-color, var(--neko-accent-color)) 30%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);
      animation: nekoCheckPop 0.4s var(--neko-ease-spring);

      .neko-checked-mark {
        opacity: 1;
      }
    }
  }

  @keyframes nekoCheckPop {
    0%   { transform: scale(1); }
    45%  { transform: scale(1.14); }
    100% { transform: scale(1); }
  }

  .neko-indeterminate {
    &.neko-checkbox {
      border: 1.5px solid var(--checkbox-color, var(--neko-accent-color));
      background: var(--checkbox-color, var(--neko-accent-color));
      box-shadow:
        0 2px 6px color-mix(in oklab, var(--checkbox-color, var(--neko-accent-color)) 30%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);

      .neko-indeterminate-mark {
        opacity: 1;
      }
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
    busy = false,
    small = false,
    color,
    variant,
    ...rest
  } = props;
  
  // Handle both busy and isBusy props - prefer busy over isBusy
  const busyState = busy || isBusy;
  
  useDeprecatedIsBusy(isBusy, 'NekoCheckbox');

  const showUpProOnly = requirePro && !isPro;
  const isDisabled = disabled || showUpProOnly;
  const classNames = useClasses('neko-checkbox', props.className, { disabled: isDisabled }, { small });
  const checkboxClassNames = useClasses('neko-checkbox', { 
    disabled: isDisabled,
    'neko-checked': checked,
    'neko-indeterminate': indeterminate,
    small
  });
  const checkboxMarkClassNames = useClasses('neko-checked-mark');
  const checkboxIndeterminateClassNames = useClasses('neko-indeterminate-mark');

  const onClick = (e) => {
    if (isDisabled) {
      return;
    }
    if (!onChange) {
      console.log(`The onChange handler is not set for the NekoCheckbox.`, props);
      return;
    }
    onChange(!checked, name, e);
  };

  // Space and Enter are what people expect on a checkbox. Space scrolls the page by default,
  // so it has to be stopped.
  const onKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <StyledNekoCheckboxWrapper 
      className={classNames} 
      checked={checked} 
      disabled={isDisabled}
      color={color}
      variant={variant}
      onClick={(e) => e.stopPropagation()} 
      {...rest}
    >
      <div className="neko-checkbox-container">
        {/* Announced and reachable like a real checkbox, which a plain div is not. The label
            sits inside, so it already provides the accessible name. */}
        <div className="neko-content" onClick={onClick} onKeyDown={onKeyDown}
          role="checkbox"
          aria-checked={indeterminate ? 'mixed' : !!checked}
          aria-disabled={isDisabled ? true : undefined}
          tabIndex={isDisabled ? -1 : 0}>
          <div className="neko-checkbox-check-container">

            {busyState && <div className='neko-checkbox-busy-container'>
              <div className={checkboxClassNames}>
                <NekoSpinner type="circle" size="16px" />
              </div>
            </div>}

            {!busyState && <>
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
            {description ? (
              typeof description === 'string'
                ? <small className="description" dangerouslySetInnerHTML={{ __html: description }} />
                : <small className="description">{description}</small>
            ) : null}
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
  busy: PropTypes.bool,
  isBusy: PropTypes.bool,
  small: PropTypes.bool,
  color: PropTypes.oneOf(['blue', 'purple', 'green', 'red', 'orange', 'yellow', 'gray']),
  variant: PropTypes.oneOf(['danger']),
};

export { StyledNekoCheckbox as NekoCheckbox };
