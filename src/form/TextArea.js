import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';
import { NekoIcon } from '../misc/Icon';

/**
 * @param {string} name
 * @param {string} value
 * @param {string} description
 * @param {string} placeholder
 */
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
    copyable = false,
    action,
    ...rest
  } = props;
  const [ newValue, setNewValue ] = useState(value);
  const [ count, setCount ] = useState(0);
  const [ pressShift, setPressShift ] = useState(false);
  const [ copied, setCopied ] = useState(false);
  const isControlled = !!props.onChange;
  const textareaRef = useRef(null);

  const keydownFunction = useCallback((e) => {
    if (tabToSpaces && e.key === 'Tab') {
      e.preventDefault();
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const value = textareaRef.current.value;
      textareaRef.current.value = value.substring(0, start) + '  ' + value.substring(end);
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
    const el = textareaRef.current;
    if (!el) return;
    el.addEventListener("keydown", keydownFunction, false);
    el.addEventListener("keyup", keyupFunction, false);

    return () => {
      el.removeEventListener("keydown", keydownFunction, false);
      el.removeEventListener("keyup", keyupFunction, false);
    }
  }, [keydownFunction, keyupFunction]);

  useEffect(() => {
    if (!isControlled) {
      setNewValue(value);
    }
    // Words
    if (countable === "words") {
      // Count the number of words in value
      const words = value.split(' ');
      const count = words.filter(word => word !== '').length;
      setCount(count);
    }
    // Characters
    else if (countable) {
      setCount(value.length);
    }
  }, [value, countable, isControlled]);

  const onChange = useCallback((e) => {
    const newValue = maxLength ? e.target.value.substr(0, maxLength): e.target.value;
    e.stopPropagation();
    if (isControlled) { 
      props.onChange(newValue, name);
    }
    else {
      setNewValue(newValue, name);
    }
  }, [maxLength, isControlled, props, name]);

  const onKeyPress = (e) => {
    if (onEnter && !e.shiftKey && e.key === 'Enter') {
      if (avoidOnEnterWithShift && pressShift) return;

      e.preventDefault();
      props.onEnter(e.target.value, name);
    }
  };

  const onBlur = (e) => {
    if (onBlurForce || props.onBlur && value !== e.target.value) {
      props.onBlur(e.target.value, name);
    }
  };

  const handleCopy = useCallback(async () => {
    const textToCopy = isControlled ? value : newValue;
    if (!textToCopy) return;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value, newValue, isControlled]);

  const classes = useClasses(className, { disabled });

  return (
    <div className={classes} style={style}>
      <div className="neko-textarea-container">
        <div className="neko-textarea-field">
          <textarea ref={textareaRef} className="neko-textarea" rows={rows} disabled={disabled} {...rest} name={name}
            spellCheck="false" placeholder={placeholder}
            onChange={onChange} onKeyPress={onKeyPress} onBlur={onBlur}
            readOnly={readOnly}
            style={{ ...textAreaStyle, height: fullHeight ? '100%' : textAreaStyle.height ?? undefined }}
            value={isControlled ? value : newValue} />
          {copyable && (readOnly || disabled) && (
            <button
              className="neko-textarea-copy-button"
              onClick={handleCopy}
              type="button"
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              <NekoIcon icon={copied ? "check" : "duplicate"} />
            </button>
          )}
          {/* Embedded action — floats over the bottom-right of the textarea
              (e.g. an AI "Suggest" button). See PATTERNS.md "Embedded field action". */}
          {action && (
            <div className="neko-textarea-action">
              {action}
            </div>
          )}
        </div>
        <div className="neko-text-area-extra">
          {description ? (
            typeof description === 'string'
              ? <div className="neko-input-description" dangerouslySetInnerHTML={{ __html: description }} />
              : <div className="neko-input-description">{description}</div>
          ) : countable ? (
            <div></div>
          ) : null}
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

  .neko-textarea-field {
    position: relative;
    height: ${props => props.fullHeight ? '100%' : undefined}
  }

  /* Embedded action — floats over the bottom-right corner of the textarea. Any
     NekoButton dropped in here auto-shrinks (label or icon-only). See PATTERNS.md
     "Embedded field action". */
  .neko-textarea-action {
    position: absolute;
    right: 8px;
    bottom: 8px;
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

    .neko-button.has-icon:not(:has(.button-text)) {
      width: calc(var(--neko-control-height) - 8px);
      padding: 0;
    }
  }

  .neko-textarea-copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: white;
    border: 1px solid var(--neko-gray-80);
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 12px;
    color: var(--neko-gray-50);
    z-index: 1;

    &:hover {
      background: var(--neko-gray-98);
      color: var(--neko-main-color);
      border-color: var(--neko-main-color);
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }

  .neko-textarea {
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size);
    border: 1.5px solid var(--neko-input-border);
    box-sizing: border-box;
    background: var(--neko-input-background);
    color: var(--neko-font-color);
    padding: 5px 10px;
    width: 100%;
    /* Removes the inline descender gap so an embedded bottom action sits flush. */
    display: block;
    transition: opacity 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;

    &::placeholder {
      color: rgba(0, 0, 0, 0.25);
    }

    &:focus {
      background-color: white;
      outline: none !important;
      box-shadow: none !important;
      border-color: var(--neko-input-border) !important;
    }
    
    &:focus-visible {
      outline: none !important;
      box-shadow: none !important;
      border-color: var(--neko-input-border) !important;
    }

    &:focus-within {
      outline: none !important;
      box-shadow: none !important;
      border-color: var(--neko-input-border) !important;
    }

    &:read-only {
      background: repeating-linear-gradient(
        -45deg,
        var(--neko-gray-98),
        var(--neko-gray-98) 10px,
        var(--neko-gray-95) 10px,
        var(--neko-gray-95) 20px
      );
      border: 1.5px solid var(--neko-gray-80);
      color: var(--neko-gray-30);
      cursor: default;
      
      &:focus {
        background: repeating-linear-gradient(
          -45deg,
          var(--neko-gray-98),
          var(--neko-gray-98) 10px,
          var(--neko-gray-95) 10px,
          var(--neko-gray-95) 20px
        );
        border-color: var(--neko-gray-80) !important;
      }
    }
    
    &:disabled {
      color: var(--neko-gray-60);
      background: var(--neko-gray-98);
      border-color: var(--neko-input-border);
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .neko-text-area-extra {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    color: var(--neko-gray-60);
    font-size: var(--neko-small-font-size);
    line-height: 14px;

    .neko-textarea-count {
      margin: 0 0 0 10px;
      text-align: right;
      min-width: 130px;
      display: block;
      flex-shrink: 0;
    }

    .neko-input-description {
      margin-top: 5px;
      margin-bottom: 0;
      flex: 1;
      font-size: var(--neko-small-font-size);

      code {
        font-size: 9px;
        background: #016fba14;
        border-radius: 5px;
        padding: 2px 4px;
      }
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
  fullHeight: PropTypes.bool,
  copyable: PropTypes.bool,
  action: PropTypes.node
};

export { NekoTextArea };
