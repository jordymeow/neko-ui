import React, { useState, useEffect, useRef, useLayoutEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoIcon } from '../misc/Icon';
import { useClasses } from '../hooks';

const arrayToString = (array) => {
  if (!Array.isArray(array)) {
    console.warn('The provided value is not an array. Falling back to an empty array.');
    array = [];
  }
  return array.join(', ');
};

const stringToArray = (str) => str.split(',').map(item => item.trim()).filter(item => item.length > 0);

const arraysAreEqual = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

/**
 * @param {string} id
 * @param {string} name
 * @param {string} value
 * @param {string} description
 * @param {string} placeholder
 */
const ForwardedNekoInput = (props, ref) => {
  const {
    type = 'text',
    name,
    value = '',
    description,
    placeholder = '',
    onChange: onCustomChange,
    onEnter,
    onBlur: onCustomBlur,
    onFinalChange,
    readOnly = false,
    step = 1,
    min = 0,
    max = null,
    maxLength : defaultMaxLength,
    natural = false,
    onReset,
    isCommaSeparatedArray = false,
    iconEmpty = '',
    iconFilled = '',
    onEmptyIconClick,
    onFilledIconClick,
    action,
    className,
    style,
    inputStyle,
    ...rest
  } = props;

  const [ newValue, setNewValue ] = useState(value || value === 0 ? value : '');
  const [ revealed, setRevealed ] = useState(false);
  const isControlled = !!onCustomChange;

  // Embedded action slot (e.g. an AI "Suggest" button living inside the field).
  // We measure its width so the input text never runs underneath it, whether the
  // button shows a label or just an icon.
  const actionRef = useRef(null);
  const [ actionWidth, setActionWidth ] = useState(0);
  useLayoutEffect(() => {
    if (!action || !actionRef.current) { setActionWidth(0); return; }
    const el = actionRef.current;
    const measure = () => setActionWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [action]);

  // Password fields render masked with a built-in eye toggle to reveal the value.
  // Skipped when the caller supplies its own icon, to avoid clobbering it.
  const isPassword = type === 'password';
  const showPasswordToggle = isPassword && !iconEmpty && !iconFilled;
  const effectiveType = isPassword && revealed ? 'text' : type;
  const maxLength = defaultMaxLength ? defaultMaxLength : (type === 'number' ? 3 : undefined);

  useEffect(() => {
    if (onFinalChange && (onEnter || onCustomBlur)) {
      console.warn('NekoInput: Since onFinalChange is used, onEnter and onBlur are redundant.');
    }
  }, [onFinalChange, onEnter, onCustomBlur]);

  useEffect(() => {
    if (!isControlled) {
      setNewValue(isCommaSeparatedArray ? arrayToString(value) : value);
    }
  }, [value]);

  const onChange = (e) => {
    const targetValue = e.target.value;
    const newValue = isCommaSeparatedArray ? stringToArray(targetValue) : targetValue;

    e.stopPropagation();
    e.preventDefault();
    
    if (isControlled) {
      onCustomChange(newValue, name);
    }
    else {
      setNewValue(targetValue);
    }
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const targetValue = e.target.value;
      const newValue = isCommaSeparatedArray ? stringToArray(targetValue) : targetValue;
      
      if (onFinalChange) {
        onFinalChange(newValue, name);
      }
      else if (onEnter) {
        onEnter(newValue, name);
      }
    }
  };  

  const onBlur = (e) => {
    const targetValue = e.target.value;
    const newValue = isCommaSeparatedArray ? stringToArray(targetValue) : targetValue;
  
    const valuesAreEqual = isCommaSeparatedArray
      ? arraysAreEqual(value, newValue)
      : value === newValue;
  
    if (!valuesAreEqual) {
      if (onFinalChange) {
        onFinalChange(newValue, name);
      }
      else if (onCustomBlur) {
        onCustomBlur(newValue, name);
      }
    }
  };  

  const classNames = useClasses('neko-input', { natural });

  const validateInputNumberType = (e) => {
    const numValue = Number(e.target.value);
    if (min && numValue < Number(min)) {
      e.target.value = min;
    } else if (max && numValue > Number(max)) {
      e.target.value = max;
    }
  };

  // Helper to determine if input has content
  const hasContent = () => {
    const currentValue = isControlled ? value : newValue;
    if (isCommaSeparatedArray) {
      return Array.isArray(currentValue) ? currentValue.length > 0 : false;
    }
    return currentValue && currentValue !== '' && currentValue !== 0;
  };

  // Determine which icon to show
  const showReset = !!onReset && hasContent();
  const shouldShowIcon = iconEmpty || iconFilled || showPasswordToggle || showReset;
  const showFilledIcon = Boolean( hasContent() && iconFilled);
  const showEmptyIcon  = Boolean(!hasContent() && iconEmpty );

  return (
    <div className={className} style={style}>
      <div style={{ position: 'relative' }}>
        {type === 'number' ? <input ref={ref} className={classNames} name={name}
            value={isControlled ? value : newValue} type={type}
            disabled={readOnly}
            step={step} min={min} max={max}
            maxLength={maxLength}
            autoComplete="off" data-form-type="other"
            placeholder={placeholder}
            style={{
              ...inputStyle,
              paddingRight: action ? `${actionWidth + 10}px` : (shouldShowIcon ? '30px' : undefined)
            }}
            onChange={onChange} onKeyPress={onKeyPress}
            onBlur={(e) => { validateInputNumberType(e); onBlur(e); } }
            readOnly={readOnly} {...rest}
          /> : <input ref={ref} className={classNames} {...rest} name={name}
            value={isControlled ? value : newValue} type={effectiveType}
            disabled={readOnly}
            spellCheck="false"
            autoComplete="off" data-form-type="other"
            placeholder={placeholder}
            style={{
              ...inputStyle,
              paddingRight: action ? `${actionWidth + 10}px` : (shouldShowIcon ? '30px' : undefined)
            }}
            maxLength={maxLength}
            onChange={onChange} onKeyPress={onKeyPress} onBlur={onBlur}
            readOnly={readOnly} {...rest}
          />
        }
        {action && (
          <div className="neko-input-action" ref={actionRef}>
            {action}
          </div>
        )}
        {showReset && (
          <NekoIcon
            icon='close'
            width={15}
            style={{
              position: 'absolute',
              top: '50%',
              right: '8px',
              transform: 'translateY(-50%)',
              cursor: 'pointer'
            }}
            color='var(--neko-gray-60)'
            onClick={() => onReset()}
          />
        )}
        
        {/* Icon for empty/filled states */}
        {showEmptyIcon && (
          <NekoIcon 
            icon={iconEmpty} 
            width={15}
            style={{ 
              position: 'absolute', 
              top: '50%', 
              right: '8px', 
              transform: 'translateY(-50%)',
              pointerEvents: onEmptyIconClick ? 'auto' : 'none',
              cursor: onEmptyIconClick ? 'pointer' : 'default'
            }}
            color='#5a5a5a82'
            onClick={onEmptyIconClick}
          />
        )}

        {showFilledIcon && (
          <NekoIcon
            icon={iconFilled}
            width={15}
            style={{
              position: 'absolute',
              top: '50%',
              right: '8px',
              transform: 'translateY(-50%)',
              pointerEvents: onFilledIconClick ? 'auto' : 'none',
              cursor: onFilledIconClick ? 'pointer' : 'default'
            }}
            color='var(--neko-blue)'
            onClick={onFilledIconClick}
          />
        )}

        {showPasswordToggle && (
          <NekoIcon
            icon={revealed ? 'eye-off' : 'eye'}
            width={15}
            style={{
              position: 'absolute',
              top: '50%',
              right: '8px',
              transform: 'translateY(-50%)',
              cursor: 'pointer'
            }}
            color='#5a5a5a82'
            onClick={() => setRevealed(r => !r)}
          />
        )}
      </div>
      {description && (
        typeof description === 'string' 
          ? <p className="neko-input-description" dangerouslySetInnerHTML={{ __html: description }} />
          : <p className="neko-input-description">{description}</p>
      )}
    </div>
  );
};

const StyledNekoInput = Styled(forwardRef(ForwardedNekoInput))`
  .neko-input {
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size);
    border: 1.5px solid var(--neko-input-border);
    box-sizing: border-box;
    height: var(--neko-control-height);
    /* WP 7 admin CSS sets min-height: 40px on bare input[type="text"] etc.,
       which overrides our height. Explicitly reset it so Neko's height wins. */
    min-height: 0;
    background: var(--neko-input-background);
    color: var(--neko-font-color);
    padding: 0 10px;
    width: 100%;
    border-radius: var(--neko-radius-md);
    transition: background 0.3s ease, box-shadow 0.2s ease, opacity 0.3s ease, border-color 0.3s ease;

    &.natural {
      border-color: gray;
      border-width: 1px;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.25);
    }

    &:focus {
      background-color: white;
      outline: none;
    }

    /* Keyboard-only focus ring — the global --neko-focus-ring shadow + a
       brand-tinted border so tabbing through a form is always visible.
       Mouse clicks won't trigger this (browser distinguishes :focus from
       :focus-visible). */
    &:focus-visible {
      outline: none;
      border-color: color-mix(in oklab, var(--neko-main-color) 60%, transparent);
      box-shadow: var(--neko-focus-ring);
    }

    &:read-only {
      color: var(--neko-gray-60);
    }

    &:disabled {
      color: var(--neko-gray-60);
      background: var(--neko-gray-98);
      border-color: var(--neko-input-border);
      box-shadow: none;
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  /* Embedded action — sits flush inside the field on the right. Any NekoButton
     dropped in here auto-shrinks to fit the control height (label or icon-only),
     so callers just pass a normal <NekoButton>. See PATTERNS.md "Embedded field
     action". */
  .neko-input-action {
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;

    .neko-button {
      height: calc(var(--neko-control-height) - 8px);
      min-height: calc(var(--neko-control-height) - 8px);
      min-width: 0;
      padding: 0 10px;
      border-radius: 6px;
      /* Compact "micro-action" label — uppercase + tiny + bold reads as an
         affordance inside the field rather than a full button. */
      text-transform: uppercase;
      font-size: 10px;
      font-weight: bold;
    }

    /* Icon-only embedded button → square, no side padding. */
    .neko-button.has-icon:not(:has(.button-text)) {
      width: calc(var(--neko-control-height) - 8px);
      padding: 0;
    }
  }

  .neko-input-description {
    font-size: var(--neko-small-font-size);
    color: var(--neko-gray-60);
    line-height: 14px;
    margin-top: 5px;
    margin-bottom: 0;

    code {
      font-size: 9px;
      background: #016fba14;
      border-radius: 5px;
      padding: 2px 4px;
    }
  }
`;

const NekoInput = React.forwardRef((props, ref) => {
  return (<StyledNekoInput ref={ref} {...props} />);
});

NekoInput.propTypes = {
  type: PropTypes.oneOf(['number', 'text', 'password']),
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  description: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onBlur: PropTypes.func,
  onFinalChange: PropTypes.func,
  readOnly: PropTypes.bool,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  maxLength: PropTypes.number,
  natural: PropTypes.bool,
  onReset: PropTypes.func,
  isCommaSeparatedArray: PropTypes.bool,
  iconEmpty: PropTypes.string,
  iconFilled: PropTypes.string,
  onEmptyIconClick: PropTypes.func,
  onFilledIconClick: PropTypes.func,
  action: PropTypes.node
};

export { NekoInput };
