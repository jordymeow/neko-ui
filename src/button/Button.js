import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoIcon } from '../misc/Icon';
import { ProOnly } from '../label/ProOnly';
import { getProUrl } from '../common/proUrl';
import { useInterval, useClasses, useDeprecatedIsBusy } from '../hooks';

const StyledButton = Styled(props => {

  // Props
  let {
    className = 'primary',
    variant,
    disabled = false,
    icon = null,
    color = null,
    onClick = () => {},
    onStopClick = null,
    rounded,
    isBusy = false,
    busy = false,
    spinning = false,
    disabledColor = null,
    busyText,
    hideBusyIcon = false,
    busyIconSize,
    requirePro = false,
    isPro = false,
    small,
    large,
    width,
    height,
    fullWidth,
    startTime = null,
    progress = null,
    ai = false,
    active = false,
    children,
    ...rest
  } = props;
  
  // Handle both busy and isBusy props - prefer busy over isBusy
  const busyState = busy || isBusy;
  
  useDeprecatedIsBusy(isBusy, 'NekoButton');
  
  // Store button width
  const buttonRef = React.useRef(null);
  const initialWidth = React.useRef(null);
  const [fixedWidth, setFixedWidth] = React.useState(null);
  
  // Capture initial width on mount
  React.useLayoutEffect(() => {
    if (buttonRef.current && !initialWidth.current) {
      initialWidth.current = buttonRef.current.offsetWidth;
    }
  });
  
  // For regular buttons, clear fixed width after transitions
  React.useEffect(() => {
    if (!busyState && !onStopClick) {
      const timer = setTimeout(() => {
        setFixedWidth(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [busyState, onStopClick]);

  // Handle deprecation warning for className used as variant
  React.useEffect(() => {
    if (className && ['primary', 'primary-block', 'secondary', 'danger', 'success', 'warning', 'header'].includes(className) && !variant) {
      console.warn(`NekoButton: Using 'className' prop for button variants is deprecated. Please use 'variant' prop instead. Found className="${className}"`);
    }
  }, [className, variant]);

  // Use variant if provided, otherwise fall back to className for backward compatibility
  const buttonVariant = variant || ((['primary', 'primary-block', 'secondary', 'danger', 'success', 'warning', 'header'].includes(className)) ? className : 'primary');
  const additionalClasses = (className && !['primary', 'primary-block', 'secondary', 'danger', 'success', 'warning', 'header'].includes(className)) ? className : '';

  // Warn if ai attribute is used with variant
  React.useEffect(() => {
    if (ai && (variant || ['secondary', 'danger', 'success', 'warning', 'header'].includes(buttonVariant))) {
      console.warn('NekoButton: The "ai" property doesn\'t need a variant. The ai styling will override the variant styling.');
    }
  }, [ai, variant, buttonVariant]);

  // Variables
  const isDisabled = disabled || (requirePro && !isPro);
  const hasIcon = !!icon;
  const needsProUser = requirePro && !isPro;
  // Locked only because it needs Pro: it looks disabled but stays clickable and opens the Pro page.
  // A natively disabled button swallowed every click, including on its own "Pro" pill.
  const proLocked = needsProUser && !disabled;
  const hasStopClick = !!onStopClick && busyState;
  const iconWidth = useMemo(() => {
    // Only use width for icon sizing if it's a number, not a CSS string
    let base = (typeof width === 'number' ? width : 30);

    if ( small ) {
      base = base * .8;
    }

    if ( large ) {
      base = base * 1.3;
    }

    // Header buttons get larger icons (20px)
    if (buttonVariant === 'header' || (className && className.includes('header'))) {
      return 20;
    }

    return rounded ? base - 12 : base - 14;
  }, [width, rounded, small, large, buttonVariant, className]);

  // Handle startTime 
  const [now, setNow] = useState(null);
  useInterval(() => setNow(new Date()), startTime ? 1000 : null);
  useEffect(() => {
    if (!startTime) {
      setNow(null);
    }
  }, [startTime]);
  const chronoTime = useMemo(() => {
    if (!startTime || !now) { return null };
    const diff = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [now, startTime]);

  const onClickEvent = (ev) => {
    // Capture width right before button becomes busy
    if (!busyState && buttonRef.current) {
      // For buttons with stop, use initial width to avoid capturing wrong width
      const width = onStopClick && initialWidth.current ? initialWidth.current : buttonRef.current.offsetWidth;
      setFixedWidth(width);
    }
    
    if (proLocked) {
      window.open(getProUrl(null, 'pro-button'), '_blank', 'noopener,noreferrer');
    }
    else if (!isDisabled && !hasStopClick) {
      onClick();
    }
    ev.stopPropagation();
    ev.preventDefault();
  }

  // Classes
  const classNames = useClasses('neko-button', buttonVariant, additionalClasses, { 'has-icon': hasIcon },
    { 'custom-color': color }, { small }, { large }, { rounded }, { busy: busyState },
    { 'is-pro': needsProUser }, { 'pro-locked': proLocked }, { 'full': fullWidth }, { 'has-stop': hasStopClick }, { 'ai': ai }, { active });

  return (
    <button 
      ref={buttonRef}
      type="button" 
      className={classNames} 
      onClick={onClickEvent} 
      disabled={isDisabled && !proLocked && !(busyState && hasStopClick)}
      aria-disabled={proLocked || undefined}
      aria-current={active ? 'page' : undefined}
      style={busyState && fixedWidth ? { minWidth: `${fixedWidth}px`, width: `${fixedWidth}px` } : undefined}
      {...rest}>
      {/* Progress bar overlay */}
      {busyState && progress !== null && progress > 0 && (
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      )}
      
      {/* Traditional busy state without onStopClick */}
      {busyState && !hasStopClick && !hideBusyIcon && (
        <div className="busy-wrapper">
          <div className="busy-icon">
            <NekoIcon raw icon="sync" width={16} height={16} />
          </div>
          {progress !== null && progress >= 0 && (
            <span className="progress-percentage">
              {Math.round(progress)}%
            </span>
          )}
          {chronoTime && (
            <span className="chrono-time">
              {chronoTime}
            </span>
          )}
        </div>
      )}

      {/* Regular content when not busy or hidden when busy */}
      {!busyState && !hasStopClick && (
        <div className="normal-content">
          {hasIcon && !rounded && !!children && (
            <div className="icon-section">
              <NekoIcon raw icon={icon} width={iconWidth} height={iconWidth} spinning={spinning}
                strokeWidth={(rounded && small) ? 3 : undefined}
              />
            </div>
          )}
          {hasIcon && !rounded && !children &&
            <NekoIcon raw icon={icon} width={iconWidth} height={iconWidth} spinning={spinning}
              style={{ margin: '0 auto' }}
              strokeWidth={(rounded && small) ? 3 : undefined}
            />
          }
          {hasIcon && rounded &&
            <NekoIcon raw icon={icon} width={iconWidth} height={iconWidth} spinning={spinning}
              style={{ margin: '0 auto' }}
              strokeWidth={(rounded && small) ? 3 : undefined}
            />
          }
          {!!children &&
            <span className={hasIcon && !rounded ? "button-text" : ""}>
              {children}
            </span>
          }
        </div>
      )}

      {/* Content area for onStopClick mode */}
      {hasStopClick && (
        <>
          <div className="busy-icon">
            <NekoIcon raw icon="sync" width={16} height={16} />
          </div>
          <div className="stop-section" onClick={(e) => {
            e.stopPropagation();
            onStopClick();
          }}>
            <NekoIcon raw icon="stop" width="14" height="14" />
          </div>
        </>
      )}
      
      {needsProUser && <ProOnly style={{ marginLeft: '8px' }} />}
    </button>
  );
})`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: var(--neko-control-height);
  min-height: var(--neko-control-height);
  min-width: 36px;
  border: none;
  border-radius: 7px;
  text-align: center;
  padding: 0 14px;
  vertical-align: middle;
  font-family: inherit;
  font-size: var(--neko-font-size);
  font-weight: 500;
  letter-spacing: 0;
  /* A subtle vertical gradient + inner top highlight gives the primary fill
     a touch of dimensionality without being glossy. Feels considered, not stock. */
  background:
    linear-gradient(180deg,
      color-mix(in oklab, var(--neko-main-color) 94%, white) 0%,
      var(--neko-main-color) 55%,
      color-mix(in oklab, var(--neko-main-color) 94%, black) 100%);
  color: white;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 1px 2px rgba(15, 23, 42, 0.15);
  transition:
    background 0.2s var(--neko-ease-out),
    box-shadow 0.2s var(--neko-ease-out),
    transform 0.22s var(--neko-ease-spring),
    filter 0.2s var(--neko-ease-out),
    opacity 0.2s ease;
  will-change: transform, box-shadow, filter;
  overflow: hidden;
  
  /* Progress bar styling */
  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: var(--neko-green);
    transition: width 0.3s ease;
    z-index: 0;
    opacity: 0.5;
    mix-blend-mode: overlay;
  }
  
  /* Ensure content appears above progress bar */
  .busy-wrapper,
  .normal-content,
  .busy-icon,
  .stop-section,
  .chrono-time,
  .progress-percentage {
    position: relative;
    z-index: 1;
  }

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
  }

  .chrono-time {
    font-size: 11px;
  }

  .progress-percentage {
    font-size: 11px;
    font-weight: 600;
  }

  &:not([disabled]):hover {
    cursor: pointer;
    filter: brightness(1.04);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.22),
      0 4px 12px color-mix(in oklab, var(--neko-main-color) 28%, transparent),
      0 1px 2px rgba(15, 23, 42, 0.15);
    transform: translateY(-1px);
  }

  &:disabled, &.pro-locked {
    opacity: 0.4;
    cursor: not-allowed;
    filter: saturate(0.7);
  }

  &.pro-locked {
    cursor: pointer;
    transform: none;
    box-shadow: none;
  }

  &:focus { outline: none; }
  &:focus-visible {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 1px 2px rgba(15, 23, 42, 0.15),
      var(--neko-focus-ring);
  }

  &:active:not([disabled]) {
    transform: translateY(0) scale(0.985);
    box-shadow:
      inset 0 2px 3px rgba(0, 0, 0, 0.15),
      0 1px 1px rgba(15, 23, 42, 0.1);
    transition-duration: 80ms;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:not([disabled]):hover { transform: none; box-shadow: var(--neko-shadow-xs); }
  }


  &.is-pro {
    background-image: none;
    background-color: var(--neko-main-color-disabled);
    color: color-mix(in oklab, var(--neko-white) 92%, transparent);
    align-items: center;
    opacity: 1;
  }

  &.has-icon {
    align-items: center;
    position: relative;

    svg {
      color: white;
    }
  }

  /* Secondary — quiet off-white chip that pairs with the bold primary.
     Flat fill (no gradient) keeps it calm; the border does the work. */
  &.secondary {
    background: color-mix(in oklab, var(--neko-main-color) 3%, white);
    color: var(--neko-main-color);
    border: 1px solid color-mix(in oklab, var(--neko-main-color) 18%, transparent);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      0 1px 1px rgba(15, 23, 42, 0.04);

    svg {
      color: var(--neko-main-color);
    }

    &:not([disabled]):hover {
      background: color-mix(in oklab, var(--neko-main-color) 7%, white);
      border-color: color-mix(in oklab, var(--neko-main-color) 32%, transparent);
      filter: none;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        0 2px 6px rgba(15, 23, 42, 0.06);
      transform: translateY(-1px);
    }

    &:focus-visible {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        var(--neko-focus-ring);
    }

    .icon-section {
      border-right-color: color-mix(in oklab, var(--neko-main-color) 18%, transparent);
    }
  }

  /* Semantic variants — flat fill, tinted hover glow that matches each color. */
  &.danger {
    background:
      linear-gradient(180deg,
        color-mix(in oklab, var(--neko-danger) 94%, white) 0%,
        var(--neko-danger) 55%,
        color-mix(in oklab, var(--neko-danger) 94%, black) 100%);
    border-color: var(--neko-danger);

    &:not([disabled]):hover {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 4px 12px color-mix(in oklab, var(--neko-danger) 30%, transparent),
        0 1px 2px rgba(15, 23, 42, 0.15);
    }
  }

  &.success {
    background:
      linear-gradient(180deg,
        color-mix(in oklab, var(--neko-accent-color) 94%, white) 0%,
        var(--neko-accent-color) 55%,
        color-mix(in oklab, var(--neko-accent-color) 94%, black) 100%);
    border-color: var(--neko-accent-color);

    &:not([disabled]):hover {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 4px 12px color-mix(in oklab, var(--neko-accent-color) 30%, transparent),
        0 1px 2px rgba(15, 23, 42, 0.15);
    }
  }

  &.warning {
    background:
      linear-gradient(180deg,
        color-mix(in oklab, var(--neko-warning) 94%, white) 0%,
        var(--neko-warning) 55%,
        color-mix(in oklab, var(--neko-warning) 94%, black) 100%);
    border-color: var(--neko-warning);

    &:not([disabled]):hover {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 4px 12px color-mix(in oklab, var(--neko-warning) 30%, transparent),
        0 1px 2px rgba(15, 23, 42, 0.15);
    }
  }

  /* Safety-net spacing for sibling buttons — preferred practice is parent
     flex gap, but many existing plugin layouts render buttons as plain
     inline-block siblings. 5px keeps those from touching; with a gap-based
     parent, the effective spacing becomes parent-gap + 5px. */
  & + button.neko-button {
    margin-left: 5px;
  }

  &.small {
    font-size: var(--neko-small-font-size);
    height: var(--neko-control-height-small);
    min-height: var(--neko-control-height-small);
    border-radius: 6px;
    padding: 0 10px;
  }

  &.large {
    height: var(--neko-control-height-large);
    min-height: var(--neko-control-height-large);
    font-size: 15px;
    padding: 0 20px;
    border-radius: 9px;
  }

  /* Header variant — ghost glass button for use on the branded NekoHeader.
     Stays glassy throughout; hover just brightens the glass + lifts softly. */
  &.header {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.26);
    height: 38px;
    padding: 0 16px;
    font-weight: 500;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
    transition:
      background 0.3s var(--neko-ease-out),
      border-color 0.3s var(--neko-ease-out),
      box-shadow 0.3s var(--neko-ease-out),
      transform 0.3s var(--neko-ease-spring);

    svg { color: white; }

    &:hover {
      background: rgba(255, 255, 255, 0.22);
      border-color: rgba(255, 255, 255, 0.5);
      filter: none;
      box-shadow:
        0 6px 18px rgba(0, 0, 0, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
      transform: translateY(-1px);
    }

    &:active:not([disabled]) {
      transform: translateY(0);
      background: rgba(255, 255, 255, 0.16);
    }

    /* Kill the shimmer sweep from the base primary — ghost doesn't need it */
    &::after { display: none; }

    .icon-section {
      border-right: none;
    }

    /* Current page: the silver of the header's Free tile, flat (no glow), so it reads as
       "you are here" and not as a call to action. In a Pro header, NekoHeader turns it gold
       like the Pro tile, so the tile and the button always tell the same tier. Dark text,
       as white on silver or gold is unreadable. No hover lift, since there is nowhere to go. */
    &.active,
    &.active:hover {
      background: linear-gradient(145deg, #f1f3f7, #c3c9d4 60%, #9aa3b2);
      border-color: rgba(255, 255, 255, 0.85);
      color: #1f2a3d;
      cursor: default;
      box-shadow: none;
      transform: none;

      svg { color: #1f2a3d; }
    }
  }

  /* Apply width/height if provided */
  ${props => props.width && typeof props.width === 'string' ? `width: ${props.width};` : ''}
  ${props => props.width && typeof props.width === 'number' ? `width: ${props.width}px;` : ''}
  ${props => props.height && typeof props.height === 'string' ? `height: ${props.height};` : ''}
  ${props => props.height && typeof props.height === 'number' ? `height: ${props.height}px;` : ''}

  &.rounded {
    border-radius: 50%;
    padding: 0;
    /* Explicit size with matching min-height overrides the base 30px min-height,
       otherwise rounded buttons end up 30×30 (oval). */
    --neko-rounded-size: ${props => props.width ?? (props.large ? 50 : 30)}px;
    width: var(--neko-rounded-size);
    height: ${props => props.height ?? 'var(--neko-rounded-size)'};
    min-width: var(--neko-rounded-size);
    min-height: var(--neko-rounded-size);
    /* Rounded elevation — a real dark drop shadow (works on any background,
       including the brand-blue tab bar) stacked with a colored halo that
       blooms on light surfaces. The inset highlight sells the "lifted" feel. */
    box-shadow:
      0 6px 14px rgba(15, 23, 42, 0.22),
      0 2px 4px rgba(15, 23, 42, 0.12),
      0 0 0 1px rgba(15, 23, 42, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.28);

    &.small {
      --neko-rounded-size: 24px;
      box-shadow:
        0 3px 8px rgba(15, 23, 42, 0.2),
        0 1px 2px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }

    &.success {
      box-shadow:
        0 6px 14px rgba(15, 23, 42, 0.22),
        0 2px 4px rgba(15, 23, 42, 0.12),
        0 0 0 1px color-mix(in oklab, var(--neko-accent-color) 40%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    &.danger {
      box-shadow:
        0 6px 14px rgba(15, 23, 42, 0.22),
        0 2px 4px rgba(15, 23, 42, 0.12),
        0 0 0 1px color-mix(in oklab, var(--neko-danger) 40%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    /* Hover lifts harder — shadow spreads further, inset highlights brighten.
       No translateY — rounded buttons stay put; the icon rotation + deeper
       shadow is the feedback. */
    &:not([disabled]):hover {
      transform: none;
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.28),
        0 3px 6px rgba(15, 23, 42, 0.14),
        0 0 0 1px rgba(15, 23, 42, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.34);
    }
    &.success:not([disabled]):hover {
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.28),
        0 3px 6px rgba(15, 23, 42, 0.14),
        0 0 0 1px color-mix(in oklab, var(--neko-accent-color) 50%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.36);
    }
    &.danger:not([disabled]):hover {
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.28),
        0 3px 6px rgba(15, 23, 42, 0.14),
        0 0 0 1px color-mix(in oklab, var(--neko-danger) 50%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.36);
    }

    /* Icon micro-animations on hover — each variant gets its own character */
    svg {
      transition: transform 0.35s var(--neko-ease-spring);
    }
    /* Success + → rotates 90° (add intent) */
    &.success:not([disabled]):hover svg {
      transform: rotate(90deg);
    }
    /* Primary (edit, push, etc.) → gentle tilt + bump */
    &.primary:not([disabled]):hover svg {
      transform: rotate(-8deg) scale(1.08);
    }
    /* Danger (trash) → nervous shake-ish tilt */
    &.danger:not([disabled]):hover svg {
      transform: rotate(8deg) scale(1.08);
    }
  }

  /* Normal content animation */
  .normal-content {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.3s ease, transform 0.3s ease;
    width: 100%;
  }

  /* Icon section with separator */
  .icon-section {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    padding: 0 7px;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Button text styling when icon is present */
  .button-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    padding-left: 40px; /* Space for icon section */
  }

  /* Adjust padding for buttons with icons and text */
  &.has-icon:not(.rounded):has(.button-text) {
    padding-left: 0;
    text-align: center;
  }

  /* Busy state animations */
  &.busy:not(.has-stop) {
    pointer-events: none;
    overflow: hidden;
    
    .normal-content {
      opacity: 0;
      transform: scale(0.8);
      position: absolute;
      visibility: hidden;
    }
    
    .busy-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      width: 100%;
      animation: fadeIn 0.3s ease forwards;

      .busy-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        animation: slideInRotate 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

        svg {
          animation: rotate 1.5s linear infinite;
        }
      }
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideInRotate {
    from {
      transform: translateX(-20px) rotate(-180deg) scale(0);
      opacity: 0;
    }
    to {
      transform: translateX(0) rotate(0deg) scale(1);
      opacity: 1;
    }
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  &.has-stop {
    position: relative;
    pointer-events: none;
    padding-right: 35px; /* Space for stop section */
    padding-left: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .busy-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      animation: fadeIn 0.3s ease forwards;
      
      svg {
        animation: rotate 1.5s linear infinite;
        color: white;
      }
    }
    
    .stop-section {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      height: 100%;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      pointer-events: auto;
      transition: background-color 0.2s ease;
      
      svg {
        color: white;
        
        rect {
          transition: fill 0.2s ease;
        }
      }
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        
        svg {
          rect {
            fill: var(--neko-red);
          }
        }
      }
    }
  }

  &.full {
    width: 100%;
  }

  /* AI button — one gradient, one soft glow. No sparkles, no border halo.
     The slow hue drift already reads as "AI"; stacking more effects cheapens it. */
  &.ai {
    position: relative;
    background: linear-gradient(
      120deg,
      #6366f1 0%,
      #a855f7 50%,
      #ec4899 100%
    );
    background-size: 200% 100%;
    animation: aiFlow 10s ease-in-out infinite;
    color: white;
    border: none;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.22),
      0 1px 2px rgba(15, 23, 42, 0.15),
      0 4px 14px color-mix(in oklab, #a855f7 22%, transparent);

    @keyframes aiFlow {
      0%, 100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }

    &:disabled {
      animation: none;
    }

    &:not([disabled]):hover {
      animation-duration: 6s;
      transform: translateY(-1px);
      filter: brightness(1.04);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.26),
        0 1px 2px rgba(15, 23, 42, 0.15),
        0 6px 18px color-mix(in oklab, #a855f7 30%, transparent);
    }

    &:focus-visible {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 1px 2px rgba(15, 23, 42, 0.15),
        var(--neko-focus-ring);
    }
  }

  ${props => additionalColor(props.color)}
`;

const additionalColor = (color) => {
  if (color) {
    const isDirect = /^#|^rgb\(|^rgba\(|^hsl\(/.test(color);
    const bgColor = isDirect ? color : `var(--neko-${color})`;
    const borderColor = isDirect ? color : `var(--neko-${color})`;

    // Match the default primary's gradient + dimensionality so custom-color
    // buttons feel like first-class siblings of primary/danger/etc., not
    // outline-only ghosts. Without this the default `background: linear-gradient`
    // wins over `background-color` and the body stays blue while only the
    // border picks up the custom hue.
    return `
      &.custom-color {
        background:
          linear-gradient(180deg,
            color-mix(in oklab, ${bgColor} 94%, white) 0%,
            ${bgColor} 55%,
            color-mix(in oklab, ${bgColor} 94%, black) 100%);
        border: 1px solid ${borderColor};
        color: white;

        &:not([disabled]):hover {
          filter: brightness(1.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.22),
            0 4px 12px color-mix(in oklab, ${bgColor} 28%, transparent),
            0 1px 2px rgba(15, 23, 42, 0.15);
        }
      }
    `;
  }
};

/**
 * The NekoButton works out of the box without specific attributes.
 */
const NekoButton = (props) => {
  return (<StyledButton {...props} />);
};

NekoButton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'primary-block', 'secondary', 'danger', 'success', 'warning', 'header']),
  disabled: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType, PropTypes.object]),
  color: PropTypes.string,
  onClick: PropTypes.func,
  onStopClick: PropTypes.func,
  rounded: PropTypes.bool,
  busy: PropTypes.bool,
  isBusy: PropTypes.bool,
  spinning: PropTypes.bool,
  busyText: PropTypes.string,
  hideBusyIcon: PropTypes.bool,
  busyIconSize: PropTypes.string,
  requirePro: PropTypes.bool,
  isPro: PropTypes.bool,
  disabledColor: PropTypes.string,
  small: PropTypes.bool,
  large: PropTypes.bool,
  progress: PropTypes.number,
  ai: PropTypes.bool,
  active: PropTypes.bool,
};

export { NekoButton };
