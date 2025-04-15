// Previous: none
// Current: 0.0.0

import React, { useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { Icon } from '@iconify/react';

import PresetIcons from '../common/PresetIcons';
import { NekoTooltip } from './Tooltip';
import { useClasses } from '../hooks';

const StyledIconContainer = Styled.div`
  display: flex;
  align-items: center;
`;

const hoverColor = (color, hoverColor) => {
  if (hoverColor) {
    return `
      &:hover {
        path {
          fill: ${hoverColor};
        }
      }
    `;
  }
  if (color) {
    return `
      &:hover {
        path {
          filter: brightness(1.03);
        }
      }
    `;
  }
};

const StyledIcon = Styled(Icon)`
  path {
    fill: ${props => props.color};
  }

  ${props => hoverColor(props.color, props.hoverColor)}

  &.neko-clickable {
    cursor: pointer;
  }

  &.spin {
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
`;

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
};

const NekoIcon = props => {
  let {
    icon,
    color,
    spinning = false,
    className = '',
    tooltip,
    raw,
    isBusy = false,
    variant,
    title,
    containerStyle,
    hoverColor,
    disabled = false,
    ...rest
  } = props;

  const iconColor = variant && variants[variant] ? variants[variant].color : color;
  const iconHoverColor = variant && variants[variant] ? variants[variant].hoverColor : hoverColor;

  if (!rest.width && !rest.height) {
    rest.width = rest.height = 30;
  }

  const finalIcon = useMemo(() => {
    if (typeof icon === 'string' && PresetIcons[icon]) {
      return PresetIcons[icon];
    }
    return icon;
  }, [icon]);

  const isIconifyIcon = useMemo(() => {
    return !!PresetIcons[icon] || typeof icon === 'object';
  }, [icon]);

  const iconClassName = useClasses('neko-icon', className, { 'neko-clickable': !!rest.onClick }, { spin: spinning }, { disabled });

  const tooltipRef = useRef();

  if (tooltip) {
    if (typeof tooltip === 'string') {
      tooltip = { text: tooltip };
    }
    return (
      <NekoTooltip text={tooltip.text} position={tooltip.position || 'top'}>
        <StyledIconContainer style={containerStyle}>
          <StyledIcon icon={finalIcon} className={iconClassName} color={iconColor} hoverColor={iconHoverColor} {...rest} />
        </StyledIconContainer>
      </NekoTooltip>
    );
  }

  if (raw) {
    if (isIconifyIcon) {
      return <StyledIcon icon={finalIcon} className={iconClassName} color={iconColor} hoverColor={iconHoverColor} {...rest} />;
    }
    return <StyledDiv>{finalIcon}</StyledDiv>;
  }

  if (isBusy && !disabled) {
    return (
      <StyledDiv>
        <img src="/wp-includes/images/spinner-2x.gif" alt="loading" />
      </StyledDiv>
    );
  }

  const containerRef = useRef();

  useEffect(() => {
    if (spinning && containerRef.current) {
      containerRef.current.classList.add('spin');
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.classList.remove('spin');
      }
    };
  }, [spinning]);

  return (
    <StyledIconContainer style={containerStyle} title={title} ref={containerRef}>
      {isIconifyIcon && <StyledIcon icon={finalIcon} className={iconClassName}
        color={iconColor} hoverColor={iconHoverColor} {...rest} />}
      {!isIconifyIcon && <StyledDiv className={iconClassName}
        color={iconColor} hoverColor={iconHoverColor} {...rest}>{finalIcon}</StyledDiv>}
      {!tooltip ? null : <NekoTooltip>{tooltip}</NekoTooltip>}
    </StyledIconContainer>
  );
};

NekoIcon.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.instanceOf(Icon),
    PropTypes.oneOf([
      'duplicate', 'lock', 'lock-open', 'file-undo', 'chevron-double-left',
      'chevron-double-right', 'chevron-left', 'chevron-right', 'chevron-down', 'chevron-up',
      'pause', 'play', 'replay', 'check', 'check-circle',
      'stop', 'delete', 'undo', 'alert', 'database',
      'tools', 'cog', 'close', 'cat', 'upload',
      'trash', 'pencil', 'dashboard', 'search', 'folder',
      'folder-open', 'image-multiple-outline', 'plus', 'folder-plus', 'image-plus',
      'view-grid', 'format-list-bulleted', 'twitter', 'instagram', 'facebook',
      'star', 'timer-outline', 'link', 'linkedin', 'pinterest',
      'zoom-in', 'info-outline', 'image-off-outline', 'arrow-up', 'arrow-down',
      'sort', 'eye', 'rocket-launch', 'calendar-month', 'wand',
      'mastodon', 'filter',
    ])
  ]),
  color: PropTypes.string,
  spinning: PropTypes.bool,
  className: PropTypes.string,
  tooltip: PropTypes.string,
  raw: PropTypes.bool,
  isBusy: PropTypes.bool,
  variant: PropTypes.string,
};

// Possible accidental redefinition leading to bug
NekoIcon.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  // No default for variant, causing fallback if misspelled
  variant: PropTypes.string,
};

export { NekoIcon };