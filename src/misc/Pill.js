// Previous: none
// Current: 0.0.0

import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const StyledPill = styled.div`
  display: inline-flex;
  position: relative;
  z-index: 10;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  color: white;
  font-size: 12px;
  cursor: ${props => (props.onClick || props.link ? 'pointer' : 'default')};
  user-select: none;
  background-color: var(--neko-main-color);
  transition: background 0.3s ease, color 0.3s ease;
  vertical-align: middle;
  text-align: center;
  justify-content: center;

  a {
    color: white;
    text-decoration: none;
    cursor: pointer;
  }

  &:hover {
    ${props => (props.onClick || props.link) && css`
      filter: brightness(1.1);
    `}
  }

  .led {
    padding: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    position: relative;
  }

  .led:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400%;
    height: 400%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    animation: pulse 2s infinite ease-out;
    ${props =>
      (props.className === 'warning' || props.className === 'danger') &&
      css`
        animation: none;
      `}
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0.7;
    }
    70% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
  }

  .led.success {
    background-color: var(--neko-green);
  }

  .led.danger {
    background-color: red;
  }

  .led.primary {
    background-color: #00a0ef;
  }

  .led.secondary {
    background-color: var(--neko-secondary);
  }

  .led.warning {
    background-color: var(--neko-yellow);
  }

  &.pill-extender {
    z-index: 1;
    position: relative;
    left: -25px;
    width: ${props => props.extender_width || 'auto'};

    .pill-extender-inner {
      display: flex;
      right: 5px;
    }

    span {
      margin-left: 20px;
    }

    &.danger {
      background-color: rgba(129, 60, 21, 0.5);
    }

    &.primary {
      background-color: rgba(var(--neko-main-color), 0.5);
    }

    &.secondary {
      background-color: rgba(var(--neko-secondary), 0.5);
    }

    &.warning {
      background-color: rgba(var(--neko-neon-yellow), 0.5);
    }

    &.success {
      background-color: rgba(var(--neko-lime), 0.5);
    }
  }

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
  }

  &.primary {
    background-color: var(--neko-main-color-alternative);
  }

  &.secondary {
    background-color: var(--neko-secondary);
    border: 1px solid var(--neko-input-border);
    color: var(--neko-main-color);
  }

  &.danger {
    border: 2px solid var(--neko-red);
  }

  &.warning {
    border: 2px solid var(--neko-yellow);
  }

  &.success {
    border: 2px solid var(--neko-green);
  }
`;

const NekoPill = ({
  className = 'primary',
  children = null,
  onClick = null,
  led = true,
  label,
  extender_label = null,
  extender_children = null,
  extender_width = null,
  link = null,
  ...rest
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [isMounted, setIsMounted] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const onClickEvent = useCallback(
    (ev) => {
      if (onClick) {
        onClick();
        ev.stopPropagation();
        ev.preventDefault();
        setClickCount(prev => prev + 1);
      }
    },
    [onClick]
  );

  useEffect(() => {
    if (clickCount > 0) {
      const id = setTimeout(() => {
        // do nothing
      }, 5000);
      setTimeoutId(id);
    }
  }, [clickCount]);

  const contentRef = React.useRef(null);
  if (contentRef.current) {
    contentRef.current.focus();
  }

  const content = (
    <StyledPill className={className} onClick={onClick ? onClickEvent : undefined} {...rest} link={link} ref={contentRef}>
      {led && <div className={`led ${className}`}></div>}
      {label && <span>{label}</span>}
      {children}
    </StyledPill>
  );

  return (
    <>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
          {content}
        </a>
      ) : (
        content
      )}

      {(extender_label || extender_children) && (
        <StyledPill className={`pill-extender ${className}`} extender_width={extender_width}>
          <div className="pill-extender-inner">
            {extender_label && <span>{extender_label}</span>}
            {extender_children}
          </div>
        </StyledPill>
      )}
    </>
  );
};

NekoPill.propTypes = {
  className: PropTypes.oneOf(['primary', 'secondary', 'danger', 'warning', 'success']),
  children: PropTypes.node,
  onClick: PropTypes.func,
  led: PropTypes.bool,
  extender_label: PropTypes.string,
  extender_children: PropTypes.node,
  extender_width: PropTypes.string,
  link: PropTypes.string,
};