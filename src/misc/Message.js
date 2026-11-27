import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from "../hooks";
import { AlertCircle, CheckCircle, Info, AlertTriangle, Star, X } from 'lucide-react';

const MessageContainer = Styled.div`
  padding: ${props => props.small ? '6px 10px' : '14px 16px'};
  color: white;
  border-radius: ${props => props.small ? '6px' : '8px'};
  display: flex;
  align-items: center;
  gap: ${props => props.small ? '8px' : '12px'};
  position: relative;
  overflow: hidden;
  border-left: ${props => props.small ? '3px' : '4px'} solid rgba(0, 0, 0, 0.18);
  font-size: ${props => props.small ? '12px' : 'inherit'};
  line-height: 1.5;
  /* A subtle vertical brightness gradient replaces the old diagonal-stripe
     pattern — reads as dimensional but never dated. */
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08),
    rgba(0, 0, 0, 0.04)
  );
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);

  &.danger {
    background-color: var(--neko-red, #dc2626);
  }

  &.success {
    background-color: var(--neko-green);
  }

  &.special {
    background-color: var(--neko-purple);
  }

  &.warning {
    background-color: var(--neko-orange);
  }

  &.info {
    background-color: var(--neko-blue);
  }

  &.disabled {
    background-color: #808080;
    opacity: 0.8;
  }

  a {
    color: white;
    font-weight: bold;
  }

  code {
    font-size: 9px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    padding: 2px 4px;
  }

  .neko-message-icon {
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  .neko-message-content {
    flex: 1;
    position: relative;
    z-index: 1;
  }

  .neko-message-close {
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 1;
    }
  }
`;

const StyledNekoMessage = (props) => {
  let { variant, children, onClose, small, ...rest } = props;
  if (!variant) {
    variant = 'info';
  }
  const className = useClasses(
    'neko-message',
    {'danger': variant === 'danger'},
    {'success': variant === 'success'},
    {'info': variant === 'info'},
    {'warning': variant === 'warning'},
    {'special': variant === 'special'},
    {'disabled': variant === 'disabled'},
    {'small': small}
  );

  const getIcon = () => {
    switch(variant) {
      case 'danger':
        return AlertCircle;
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'special':
        return Star;
      case 'disabled':
        return Info;  // Using same icon as info but with grayed styling
      case 'info':
      default:
        return Info;
    }
  };

  const iconSize = small ? 14 : 20;

  return <MessageContainer className={className} small={small} {...rest}>
    {React.createElement(getIcon(), { size: iconSize, className: "neko-message-icon" })}
    <div className="neko-message-content">
      { children }
    </div>
    {onClose && (
      <X 
        size={iconSize} 
        className="neko-message-close" 
        onClick={onClose}
      />
    )}
  </MessageContainer>
}

const NekoMessage = (props) => {
  return <StyledNekoMessage {...props} />;
};

NekoMessage.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  small: PropTypes.bool,
};

export { NekoMessage };
