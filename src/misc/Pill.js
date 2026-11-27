import React, { useCallback } from 'react';
import { NekoTooltip } from '../misc/Tooltip';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const StyledPill = styled.div`
  /* Soft "tinted" pill: coloured text on a light tint of the same colour, with a hairline
     border. Each variant only sets --pill-color; the tints are mixed with white (not
     transparent) so the pill stays readable on any background, including the blue header. */
  --pill-color: var(--neko-main-color);
  display: inline-flex;
  position: relative;
  z-index: 10;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 22px;
  box-sizing: border-box;
  padding: 0 9px;
  border-radius: 999px;
  font-family: var(--neko-font-family);
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  color: color-mix(in srgb, var(--pill-color) 78%, black);
  background: color-mix(in srgb, var(--pill-color) 11%, white);
  border: 1px solid color-mix(in srgb, var(--pill-color) 24%, white);
  cursor: ${props => (props.onClick || props.link ? 'pointer' : 'default')};
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;

  a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  ${props => (props.onClick || props.link) && css`
    &:hover {
      background: color-mix(in srgb, var(--pill-color) 18%, white);
      border-color: color-mix(in srgb, var(--pill-color) 40%, white);
      box-shadow: 0 1px 2px color-mix(in srgb, var(--pill-color) 20%, transparent);
    }
  `}

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
  }

  .led {
    flex: 0 0 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--pill-color);
    animation: nekoPillPulse 2s ease-out infinite;
  }

  @keyframes nekoPillPulse {
    0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--pill-color) 55%, transparent); }
    70%  { box-shadow: 0 0 0 5px transparent; }
    100% { box-shadow: 0 0 0 0 transparent; }
  }

  @media (prefers-reduced-motion: reduce) {
    .led { animation: none; }
  }

  &.primary   { --pill-color: var(--neko-main-color); }
  &.success   { --pill-color: var(--neko-green); }
  &.danger    { --pill-color: var(--neko-red); }
  &.warning   { --pill-color: var(--neko-orange); }

  /* Neutral: gray text, no colour cast. */
  &.secondary {
    --pill-color: var(--neko-gray-40);
    color: var(--neko-gray-30);
    background: var(--neko-gray-98);
    border-color: var(--neko-gray-90);
  }

  &.warning .led, &.danger .led { animation: none; }

  /* AI: the one solid pill, a slow-moving gradient so it stays recognisable. */
  &.ai {
    --pill-color: #a855f7;
    color: white;
    border-color: transparent;
    background: linear-gradient(120deg, #818cf8, #a855f7, #ec4899, #818cf8);
    background-size: 300% 300%;
    animation: aiPillFlow 6s ease infinite;
    box-shadow: 0 1px 3px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25);

    .led {
      background: white;
      --pill-color: white;
    }

    @keyframes aiPillFlow {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  &.pill-extender {
    z-index: 1;
    left: -25px;
    width: ${props => props.extender_width || 'auto'};
    background: color-mix(in srgb, var(--pill-color) 6%, white);

    .pill-extender-inner {
      display: flex;
      right: 5px;
    }

    span {
      margin-left: 20px;
    }
  }
`;

/**
 * NekoPill Component
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.children] - Children nodes
 * @param {Function} [props.onClick] - Click event handler
 * @param {boolean} [props.led] - Display LED indicator
 * @param {string} [props.extender_label] - Label for the extender
 * @param {React.ReactNode} [props.extender_children] - Children for the extender
 * @param {string} [props.extender_width] - Width for the extender
 * @param {string} [props.link] - URL to open when the pill is clicked
 */
const NekoPill = ({
  className = 'primary',
  variant,
  children = null,
  onClick = null,
  led = true,
  tooltip = '',
  label,
  extender_label = null,
  extender_children = null,
  extender_width = null,
  link = null,
  ...rest
}) => {
  // Handle deprecation warning for className used as variant
  React.useEffect(() => {
    if (className && ['primary', 'secondary', 'danger', 'warning', 'success', 'ai'].includes(className) && !variant) {
      console.warn(`NekoPill: Using 'className' prop for pill variants is deprecated. Please use 'variant' prop instead. Found className="${className}"`);
    }
  }, [className, variant]);

  // Use variant if provided, otherwise fall back to className for backward compatibility
  const pillVariant = variant || ((['primary', 'secondary', 'danger', 'warning', 'success', 'ai'].includes(className)) ? className : 'primary');
  const additionalClasses = (className && !['primary', 'secondary', 'danger', 'warning', 'success', 'ai'].includes(className)) ? className : '';
  const onClickEvent = useCallback(
    (ev) => {
      if (onClick) {
        onClick();
        ev.stopPropagation();
        ev.preventDefault();
      }
    },
    [onClick]
  );

  const content = (
    <NekoTooltip text={tooltip} position="top">
      <StyledPill className={`neko-pill ${pillVariant} ${additionalClasses}`.trim()} onClick={onClick ? onClickEvent : undefined} {...rest} link={link}>
        {led && <div className={`led ${pillVariant}`}></div>}
        {label && <span>{label}</span>}
        {children}
      </StyledPill>
    </NekoTooltip>
  );

  return (
    <>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', boxShadow: 'none' }}>
          {content}
        </a>
      ) : (
        content
      )}

      {(extender_label || extender_children) && (
        <StyledPill className={`pill-extender ${pillVariant}`} extender_width={extender_width}>
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
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'warning', 'success', 'ai']),
  children: PropTypes.node,
  onClick: PropTypes.func,
  led: PropTypes.bool,
  extender_label: PropTypes.string,
  extender_children: PropTypes.node,
  extender_width: PropTypes.string,
  link: PropTypes.string,
};

export { NekoPill };
