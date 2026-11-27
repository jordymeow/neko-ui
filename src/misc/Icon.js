import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

import PresetIcons, { iconDefaultFills } from '../common/PresetIcons';
import { Loader2, HelpCircle } from 'lucide-react';
import { NekoTooltip } from './Tooltip';
import { useClasses, useDeprecatedIsBusy } from '../hooks';

// Styled container for the icon to ensure alignment and styling
const StyledIconContainer = Styled.div`
  display: flex;
  align-items: center;

  &.neko-clickable {
    cursor: pointer;
  }

  &.spin svg {
    animation-name: spin;
    animation-duration: 700ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.35;
    cursor: default;
  }

  svg {
    color: ${props => props.$color};
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: ${props => props.$hoverColor || props.$color};
    filter: ${props => !props.$hoverColor && props.$color ? 'brightness(1.1)' : 'none'};
  }
`;

// Styled div for non-icon content
const StyledDiv = Styled.div`
  width: 25px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: auto !important;
    height: 25px !important;
  }
`;

// Color variants for different icon states
const variants = {
  primary: {
    color: 'var(--neko-blue)',
  },
  success: {
    color: 'var(--neko-green)',
  },
  warning: {
    color: 'var(--neko-yellow)',
  },
  danger: {
    color: 'var(--neko-red)',
  }
}

// Main NekoIcon component
const NekoIcon = props => {
  let {
    icon,
    color,
    spinning = false,
    className = '',
    tooltip,
    raw,
    isBusy = false,
    busy = false,
    variant,
    title,
    containerStyle,
    hoverColor,
    disabled = false,
    width,
    height,
    strokeWidth,
    ...rest
  } = props;
  
  // Handle both busy and isBusy props - prefer busy over isBusy
  const busyState = busy || isBusy;
  
  useDeprecatedIsBusy(isBusy, 'NekoIcon');

  const iconColor = variant && variants[variant] ? variants[variant].color : color;
  const iconHoverColor = variant && variants[variant] ? variants[variant].hoverColor : hoverColor;
  
  // Apply default fill for specific icons
  const defaultFill = typeof icon === 'string' && iconDefaultFills[icon] ? iconDefaultFills[icon] : undefined;

  // Default sizing if not provided
  const size = width || height || 30;

  // Determine final icon based on input type. When a string name is unknown,
  // fall back to a neutral HelpCircle so we never render the raw string as
  // text in the UI (which used to leak out as "alert-triangle" etc.).
  const finalIcon = useMemo(() => {
    if (typeof icon === 'string') {
      if (PresetIcons[icon]) return PresetIcons[icon];
      console.warn(`NekoIcon: Icon "${icon}" does not exist. Falling back to placeholder.`);
      return HelpCircle;
    }
    return icon;
  }, [icon]);

  // Always treat string names as Lucide (resolved or fallen-back) and keep
  // object/function icons as Lucide-compatible too.
  const isLucideIcon = useMemo(() => {
    return typeof icon === 'string'
      || typeof finalIcon === 'function'
      || typeof finalIcon === 'object';
  }, [icon, finalIcon]);

  // Compile classes for icon
  const iconClassName = useClasses('neko-icon', className, { 'neko-clickable': !!rest.onClick }, { spin: spinning || busyState }, { disabled });

  // Render the icon element
  const renderIcon = () => {
    if (busyState && !disabled) {
      return React.createElement(Loader2, { 
        size,
        className: 'spin',
        strokeWidth: strokeWidth
      });
    }

    if (isLucideIcon) {
      const IconComponent = finalIcon;
      // Don't pass width/height to Lucide components, they only use size
      const { width: _, height: __, fill: userFill, ...lucideProps } = rest;
      return React.createElement(IconComponent, {
        size,
        fill: userFill || defaultFill || 'none',
        strokeWidth: strokeWidth,
        ...lucideProps
      });
    }

    return <StyledDiv>{finalIcon}</StyledDiv>;
  };

  // Render based on different props conditions
  if (tooltip) {
    if (typeof tooltip === 'string') {
      tooltip = { text: tooltip };
    }
    return (
      <NekoTooltip text={tooltip.text} position={tooltip.position || 'top'}>
        <StyledIconContainer 
          style={containerStyle} 
          className={iconClassName} 
          $color={iconColor} 
          $hoverColor={iconHoverColor}
          title={title}
        >
          {renderIcon()}
        </StyledIconContainer>
      </NekoTooltip>
    );
  }

  if (raw) {
    if (isLucideIcon) {
      const IconComponent = finalIcon;
      // Don't pass width/height to Lucide components, they only use size
      const { width: _, height: __, fill: userFill, ...lucideProps } = rest;
      return React.createElement(IconComponent, {
        size,
        color: iconColor,
        fill: userFill || defaultFill || 'none',
        className: iconClassName,
        strokeWidth: strokeWidth,
        ...lucideProps
      });
    }
    return <StyledDiv>{finalIcon}</StyledDiv>;
  }

  return (
    <StyledIconContainer 
      style={containerStyle} 
      title={title}
      className={iconClassName}
      $color={iconColor}
      $hoverColor={iconHoverColor}
    >
      {renderIcon()}
    </StyledIconContainer>
  );
};

// Proptypes for NekoIcon
NekoIcon.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.oneOf([
      'duplicate', 'lock', 'lock-open', 'file-undo', 'chevron-double-left',
      'chevron-double-right', 'chevron-left', 'chevron-right', 'chevron-down', 'chevron-up',
      'pause', 'play', 'replay', 'check', 'check-circle',
      'stop', 'checkbox-blank', 'checkbox-marked', 'delete', 'undo', 'alert', 'database',
      'tools', 'cog', 'close', 'cat', 'upload',
      'trash', 'pencil', 'dashboard', 'search', 'folder',
      'folder-open', 'image-multiple-outline', 'plus', 'folder-plus', 'image-plus',
      'view-grid', 'list', 'twitter', 'instagram', 'facebook',
      'star', 'timer-outline', 'link', 'linkedin', 'pinterest',
      'zoom-in', 'info-outline', 'image-off-outline', 'arrow-up', 'arrow-down',
      'sort', 'eye', 'rocket-launch', 'calendar-month', 'wand',
      'mastodon', 'filter', 'question', 'loading', 'new', 'save', 'reset', 'rename', 'edit', 'debug',
      'external-link', 'download', 'share', 'mail', 'phone', 'message', 'bell', 'home'
    ])
  ]),
  color: PropTypes.string,
  spinning: PropTypes.bool,
  className: PropTypes.string,
  tooltip: PropTypes.string,
  raw: PropTypes.bool,
  busy: PropTypes.bool,
  isBusy: PropTypes.bool,
  variant: PropTypes.string,
};

// Export NekoIcon
export { NekoIcon };