// Previous: none
// Current: 0.0.0

import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';

const StyledNekoTextArea = Styled(props => {
  const {
    name,
    value = '',
    rows = 6,
    description,
    placeholder = '',
    onEnter = null,
    onBlurForce = false,
    readOnly = false,
    avoidOnEnterWithShift = false,
    fullHeight = false,
    maxLength = null,
    className,
    style,
    textAreaStyle = {},
    countable = false,
    disabled,
    tabToSpaces,
    ...rest
  } = props;
  const [ newValue, setNewValue ] = useState(value);
  const [ count, setCount ] = useState(0);
  const [ pressShift, setPressShift ] = useState(false);
  const isControlled = !!props.onChange;
  const textareaRef = useRef(null);

  const keydownFunction = useCallback((e) => {
    if (tabToSpaces && e.key === 'Tab') {
      e.preventDefault();
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const currentValue = textareaRef.current.value;
      textareaRef.current.value = currentValue.substring(0, start) + '  ' + currentValue.substring(end);
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
    }
    else {
      setPressShift(e.shiftKey);
    }
  }, [tabToSpaces]);
  const keyupFunction = useCallback(() => {
    setPressShift(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keydownFunction, false);
    document.addEventListener("keyup", keyupFunction, false);

    return () => {
      document.removeEventListener("keydown", keydownFunction, false);
      document.removeEventListener("keyup", keyupFunction, false);
    }
  }, [keydownFunction, keyupFunction]);

  useEffect(() => {
    if (!isControlled) {
      setNewValue(value);
    }
    if (countable === "words") {
      const words = value.split(' ');
      const countWords = words.filter(word => word !== '').length;
      setCount(countWords);
    }
    else if (countable) {
      setCount(value.length);
    }
  }, [value, countable, isControlled]);

  const onChange = useCallback((e) => {
    const newVal = maxLength ? e.target.value.substr(0, maxLength): e.target.value;
    e.stopPropagation();
    if (isControlled) { 
      props.onChange(newVal, name);
    }
    else {
      setNewValue(newVal);
    }
  }, [maxLength, isControlled, props, name]);

  const onKeyPress = (e) => {
    if (onEnter && !e.shiftKey && e.key === 'Enter') {
      if (avoidOnEnterWithShift && pressShift) return;
      e.preventDefault();
      if (props.onEnter) {
        props.onEnter(e.target.value, name);
      }
    }
  };

  const onBlur = (e) => {
    if (onBlurForce || (props.onBlur && value !== e.target.value)) {
      props.onBlur(e.target.value, name);
    }
  };

  const classes = useClasses(className, { disabled });

  return (
    <div className={classes} style={style}>
      <div className="neko-textarea-container">
        <textarea ref={textareaRef} className="neko-textarea" rows={rows} disabled={disabled} {...rest} name={name}
          spellCheck="false" placeholder={placeholder} 
          onChange={onChange} onKeyPress={onKeyPress} onBlur={onBlur}
          readOnly={readOnly}
          style={{ ...textAreaStyle, height: fullHeight ? '100%' : textAreaStyle.height ?? undefined }}
          value={isControlled ? value : newValue} />
        <div className="neko-text-area-extra">
          {description && <div className="neko-input-description">{description}</div>}
          {countable && <div className="neko-textarea-count">
            {count}{maxLength ? ` / ${maxLength}` : ''} {countable === "words" ? "words" : "chars"}
          </div>}
        </div>
      </div>
    </div>
  );
})`
  .neko-textarea-container {
    position: relative;
    height: ${props => props.fullHeight ? '100%' : undefined}
  }

  .neko-textarea {
    font-size: var(--neko-font-size);
    border: 1.5px solid var(--neko-input-border);
    box-sizing: border-box;
    background: var(--neko-input-background);
    color: black;
    padding: 5px 10px;
    width: 100%;

    &::placeholder {
      color: rgba(0, 0, 0, 0.25);
    }

    :focus {
      background-color: white;
      border-color: #2271b1;
      box-shadow: 0 0 0 1px #2271b1;
      outline: 2px solid transparent;
    }

    :read-only {
      background-color: var(--neko-gray-60);
      border: none;
    }
  }

  .neko-text-area-extra {
    display: flex;
    justify-content: space-between;
    color: var(--neko-gray-60);
    font-size: var(--neko-small-font-size);
    line-height: 14px;

    .neko-textarea-count {
      margin: 5px 0 0 10px;
      text-align: right;
      min-width: 130px;
      display: block;
    }
  
    .neko-input-description {
      margin-top: 5px;
      margin-bottom: 0;
      flex: auto;
      font-size: var(--neko-small-font-size);
    }
  }

  &.disabled {
    .neko-textarea {
      border: 1.5px solid var(--neko-disabled-color);
      cursor: not-allowed;
      opacity: 0.35;
    }
  }
`;

const NekoTextArea = (props) => {
  return (<StyledNekoTextArea {...props} />);
};

NekoTextArea.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  rows: PropTypes.number,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onBlur: PropTypes.func,
  onBlurForce: PropTypes.bool,
  readOnly: PropTypes.bool,
  avoidOnEnterWithShift: PropTypes.bool,
  fullHeight: PropTypes.bool
};

export { NekoTextArea };