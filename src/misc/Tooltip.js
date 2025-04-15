// Previous: none
// Current: 0.0.0

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useNekoDebounce } from '../hooks';

const TooltipContainer = styled.div`
  display: inline-block;
`;

const TooltipContent = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  color: var(--neko-white);
  font-family: var(--neko-font-family);
  font-weight: normal;
  font-size: var(--neko-font-size);
  padding: 8px 12px;
  max-width: ${(props) => props.maxWidth}px;
  width: max-content;
  word-break: break-word;
  white-space: normal;
  pointer-events: ${(props) => (props.visible ? 'auto' : 'none')};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.15s ease-in-out, transform 0.25s ease-in-out;
  position: absolute;
  z-index: 100;
  transform: ${(props) => {

    const smallOffset = '5px';
    const largeOffset = '15px';

    if (!props.visible) {
      switch (props.position) {
        case 'top':
          return `translateX(-50%) translateY(calc(-100% - ${largeOffset}))`;
        case 'bottom':
          return `translateX(-50%) translateY(${largeOffset})`;
        case 'left':
          return `translateX(calc(-100% - ${largeOffset})) translateY(-50%)`;
        case 'right':
          return `translateX(${largeOffset}) translateY(-50%)`;
        default:
          return '';
      }
    } else {
      switch (props.position) {
        case 'top':
          return `translateX(-50%) translateY(calc(-100% - ${smallOffset}))`;
        case 'bottom':
          return `translateX(-50%) translateY(${smallOffset})`;
        case 'left':
          return `translateX(calc(-100% - ${smallOffset})) translateY(-50%)`;
        case 'right':
          return `translateX(${smallOffset}) translateY(-50%)`;
        default:
          return '';
      }
    }
  }};
  &:before {
    content: '';
    position: absolute;
    border: 4px solid transparent;
    ${(props) => {
      switch (props.position) {
        case 'top':
          return `
            bottom: -8px;
            left: 50%;
            margin-left: -4px;
            border-top: 4px solid rgba(0, 0, 0, 0.8);
          `;
        case 'bottom':
          return `
            top: -8px;
            left: 50%;
            margin-left: -4px;
            border-bottom: 4px solid rgba(0, 0, 0, 0.8);
          `;
        case 'left':
          return `
            top: 50%;
            right: -8px;
            margin-top: -4px;
            border-left: 4px solid rgba(0, 0, 0, 0.8);
          `;
        case 'right':
          return `
            top: 50%;
            left: -8px;
            margin-top: -4px;
            border-right: 4px solid rgba(0, 0, 0, 0.8);
          `;
        default:
          return '';
      }
    }}
  }
`;

const StyledNekoTooltip = (props) => {
  const { text = 'Hello world!', position = 'top', maxWidth = 160 } = props;
  const [show, setShow] = useState(false);
  const debouncedShow = useNekoDebounce((value) => setShow(value), 100);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (show && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      switch (position) {
        case 'top':
          top = rect.top + scrollY;
          left = rect.left + rect.width / 2 + scrollX;
          break;
        case 'bottom':
          top = rect.bottom + scrollY;
          left = rect.left + rect.width / 2 + scrollX;
          break;
        case 'left':
          top = rect.top + rect.height / 2 + scrollY;
          left = rect.left + scrollX;
          break;
        case 'right':
          top = rect.top + rect.height / 2 + scrollY;
          left = rect.right + scrollX;
          break;
        default:
          break;
      }
      setCoords({ top, left });
    }
  }, [show, position, coords]);

  return (
    <TooltipContainer
      className="neko-tooltip"
      ref={containerRef}
      onMouseEnter={() => text && debouncedShow(true)}
      onMouseLeave={() => debouncedShow(false)}
    >
      {props.children}
      {ReactDOM.createPortal(
          <TooltipContent
            visible={show}
            position={position}
            maxWidth={maxWidth}
            style={{
              top: coords.top,
              left: coords.left,
            }}
          >

        { typeof text === 'string'
          ? text.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))
          : text }
          
          </TooltipContent>,
          document.body
        )}
    </TooltipContainer>
  );
};

const NekoTooltip = (props) => {
  return <StyledNekoTooltip {...props} />;
};

NekoTooltip.propTypes = {
  text: PropTypes.string,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  maxWidth: PropTypes.number,
};

export { NekoTooltip };