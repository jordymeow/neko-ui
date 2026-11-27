import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoIcon } from './Icon';

/**
 * NekoStatus — a semantic status chip with a dot + optional icon + label.
 *
 * Usage:
 *   <NekoStatus status="ok">Connected</NekoStatus>
 *   <NekoStatus status="error" icon="alert-triangle">Auth Failed</NekoStatus>
 *   <NekoStatus status="paused" dot>Paused</NekoStatus>
 *
 * Variants map to the palette: ok/active → green, error/danger → red,
 * warning/pending → orange, paused/idle → gray, info → blue.
 */

const STATUS_COLORS = {
  ok:      'var(--neko-green)',
  active:  'var(--neko-green)',
  success: 'var(--neko-green)',
  error:   'var(--neko-red)',
  danger:  'var(--neko-red)',
  warning: 'var(--neko-orange)',
  pending: 'var(--neko-orange)',
  paused:  'var(--neko-gray-60)',
  idle:    'var(--neko-gray-60)',
  info:    'var(--neko-blue)',
};

const DEFAULT_ICONS = {
  ok:      'check-circle',
  active:  'check-circle',
  success: 'check-circle',
  error:   'alert-triangle',
  danger:  'alert-triangle',
  warning: 'alert-circle',
  pending: 'alert-circle',
  paused:  'pause-circle',
  idle:    'pause-circle',
  info:    'info-outline',
};

const StyledStatus = Styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.$color};
  font-weight: 600;
  font-size: 12px;
  line-height: 1;

  .neko-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$color};
    flex: 0 0 8px;
  }
`;

const NekoStatus = ({ status = 'info', icon, dot = false, children, iconSize = 16, style, className }) => {
  const color = STATUS_COLORS[status] || STATUS_COLORS.info;
  const resolvedIcon = icon === false ? null : (icon || DEFAULT_ICONS[status]);
  return (
    <StyledStatus $color={color} style={style} className={className}>
      {dot && <span className="neko-status-dot" />}
      {!dot && resolvedIcon && <NekoIcon icon={resolvedIcon} width={iconSize} color={color} />}
      {children}
    </StyledStatus>
  );
};

NekoStatus.propTypes = {
  status: PropTypes.oneOf(Object.keys(STATUS_COLORS)),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  dot: PropTypes.bool,
  iconSize: PropTypes.number,
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

export { NekoStatus };
