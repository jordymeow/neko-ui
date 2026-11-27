import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PanelRightOpen, PanelRightClose, PanelLeftOpen, PanelLeftClose } from 'lucide-react';

const SplitButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${props => props.$isPrimary ? 'white' : 'var(--neko-font-color, #666)'};
  padding-left: ${props => props.border === 'left' ? '8px' : '0'};
  padding-right: ${props => props.border === 'right' ? '8px' : '0'};
  margin-left: ${props => props.border === 'left' ? '5px' : '0'};
  margin-right: ${props => props.border === 'right' ? '5px' : '0'};
  border-left: ${props => {
    if (props.border === 'left') {
      return props.$isPrimary 
        ? '1px solid rgba(255, 255, 255, 0.26)' 
        : '1px solid var(--neko-border-color, #e0e0e0)';
    }
    return 'none';
  }};
  border-right: ${props => {
    if (props.border === 'right') {
      return props.$isPrimary 
        ? '1px solid rgba(255, 255, 255, 0.26)' 
        : '1px solid var(--neko-border-color, #e0e0e0)';
    }
    return 'none';
  }};
  transition: opacity 0.2s ease;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

const NekoSplitButton = ({ 
  isCollapsed, 
  onClick, 
  border = 'left', 
  direction = 'right',
  size = 20,
  color, // Optional override
  borderColor, // Optional override
  title,
  className,
  style,
  ...props 
}) => {
  const ref = useRef(null);
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    // Check if any parent has the 'primary' class
    if (ref.current) {
      const hasPrimaryParent = ref.current.closest('.primary') !== null;
      setIsPrimary(hasPrimaryParent);
    }
  }, []);

  // Determine which icon to use based on direction and collapsed state
  const getIcon = () => {
    if (direction === 'right') {
      return isCollapsed ? <PanelRightOpen size={size} /> : <PanelRightClose size={size} />;
    } else if (direction === 'left') {
      return isCollapsed ? <PanelLeftOpen size={size} /> : <PanelLeftClose size={size} />;
    }
    return null;
  };

  // Default titles
  const defaultTitle = direction === 'right' 
    ? (isCollapsed ? 'Show Right Panel' : 'Hide Right Panel')
    : (isCollapsed ? 'Show Left Panel' : 'Hide Left Panel');

  return (
    <SplitButtonWrapper
      ref={ref}
      onClick={onClick}
      border={border}
      $isPrimary={isPrimary}
      title={title || defaultTitle}
      className={className}
      style={{
        color: color || undefined, // Allow manual override
        ...style
      }}
      {...props}
    >
      {getIcon()}
    </SplitButtonWrapper>
  );
};

export default NekoSplitButton;