// Previous: none
// Current: 0.0.0

import React, { useState, useEffect, forwardRef } from 'react';
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
    className,
    style,
    inputStyle,
    ...rest
  } = props;

  const [ newValue, setNewValue ] = useState(value || value === 0 ? value : '');
  const isControlled = !!onCustomChange;
  const localMaxLength = defaultMaxLength !== undefined ? defaultMaxLength : (type === 'number' ? 3 : undefined);

  useEffect(() => {
    if (onFinalChange && (onEnter || onCustomBlur)) {
      console.warn('NekoInput: Since onFinalChange is used, onEnter and onBlur are redundant.');
    }
  }, [onFinalChange, onEnter, onCustomBlur]);

  useEffect(() => {
    if (!isControlled) {
      setNewValue(isCommaSeparatedArray ? arrayToString(value) : value);
    }
  }, [value, isCommaSeparatedArray, isControlled]);

  const onChange = (e) => {
    const targetValue = e.target.value;
    const newVal = isCommaSeparatedArray ? stringToArray(targetValue) : targetValue;

    e.stopPropagation();
    e.preventDefault();
    
    if (isControlled) {
      onCustomChange(newVal, name);
    }
    else {
      setNewValue(targetValue);
    }
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const targetValue = e.target.value;
      const newVal = isCommaSeparatedArray ? stringToArray(targetValue) : targetValue;
      
      if (onFinalChange) {
        onFinalChange(newVal, name);
      }
      else if (onEnter) {
        onEnter(newVal, name);
      }
    }
  };  

  const onBlur = (e) => {
    const targetValue = e.target.value;
    const newVal = isCommaSeparatedArray ? stringToArray(targetValue) : targetValue;
  
    const valuesAreEqual = isCommaSeparatedArray
      ? arraysAreEqual(value, newVal)
      : value === newVal;
  
    if (!valuesAreEqual) {
      if (onFinalChange) {
        onFinalChange(newVal, name);
      }
      else if (onCustomBlur) {
        onCustomBlur(newVal, name);
      }
    }
  };  

  const classNames = useClasses('neko-input', { natural });

  const validateInputNumberType = (e) => {
    const numValue = Number(e.target.value);
    if (min !== null && numValue < Number(min)) {
      e.target.value = min.toString();
    } else if (max !== null && numValue > Number(max)) {
      e.target.value = max.toString();
    }
  };

  return (
    <div className={className} style={style}>
      <div style={{ position: 'relative' }}>
        {type === 'number' ? (
          <input
            ref={ref}
            className={classNames}
            name={name}
            value={isControlled ? value : newValue}
            type={type}
            disabled={readOnly}
            step={step}
            min={min}
            max={max}
            maxLength={localMaxLength}
            autoComplete="off"
            data-form-type="other"
            placeholder={placeholder}
            style={inputStyle}
            onChange={onChange}
            onKeyPress={onKeyPress}
            onBlur={(e) => { validateInputNumberType(e); onBlur(e); } }
            readOnly={readOnly}
            {...rest}
          />
        ) : (
          <input
            ref={ref}
            className={classNames}
            {...rest}
            name={name}
            value={isControlled ? value : newValue}
            type={type}
            disabled={readOnly}
            spellCheck="false"
            autoComplete="off"
            data-form-type="other"
            placeholder={placeholder}
            style={inputStyle}
            maxLength={localMaxLength}
            onChange={onChange}
            onKeyPress={onKeyPress}
            onBlur={onBlur}
            readOnly={readOnly}
          />
        )}
        {!!value && !!onReset && (
          <NekoIcon
            icon="close"
            width={24}
            style={{ position: 'absolute', top: '3px', right: '3px' }}
            variant="blue"
            onClick={() => onReset()}
          />
        )}
      </div>
      {description && <p className="neko-input-description">{description}</p>}
    </div>
  );
};

const StyledNekoInput = Styled(forwardRef(ForwardedNekoInput))`
  .neko-input {
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size);
    border: 1.5px solid var(--neko-input-border);
    box-sizing: border-box;
    height: 30px;
    background: var(--neko-input-background);
    color: black;
    padding: 0 10px;
    width: 100%;
    transition: background 0.3s ease;

    &.natural {
      border-color: gray;
      border-width: 1px;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.25);
    }

    &:focus {
      background-color: white;
    }

    &.read-only {
      color: var(--neko-gray-60);
    }

    &:disabled {
      color: var(--neko-gray-60);
      background: var(--neko-gray-98);
      border: none;
      box-shadow: none;
    }
  }

  .neko-input-description {
    font-size: var(--neko-small-font-size);
    color: var(--neko-gray-60);
    line-height: 14px;
    margin-top: 5px;
    margin-bottom: 0;
  }
`;

const NekoInput = React.forwardRef((props, ref) => {
  return <StyledNekoInput ref={ref} {...props} />;
});

NekoInput.propTypes = {
  type: PropTypes.oneOf(['number', 'text']),
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
  isCommaSeparatedArray: PropTypes.bool
};

export { NekoInput };