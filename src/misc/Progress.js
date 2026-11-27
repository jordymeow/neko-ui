import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

import { useClasses, useDeprecatedIsBusy } from '../hooks';
import { NekoButton } from '../button/Button';

/**
 * NekoProgress — a single-height pill progress bar.
 *
 * The bar fills the full 30px form-control baseline so it lines up with
 * buttons, inputs, and selects in the same row. Percentage and label (when
 * enabled) render *inside* the fill — the component is always exactly one
 * row tall.
 *
 *   <NekoProgress value={62} max={100} busy
 *     label="Scanning your library…" onStopClick={…} />
 *
 *   <NekoProgress value={62} startLabel="2025" endLabel="2026" />
 *
 * - Track is a fully rounded pill with a brand-tinted outer border.
 * - Fill is a fully rounded inset pill with a glossy top highlight.
 * - Label (if any) + percentage are centered inside the bar, in white.
 * - Pause / stop buttons float *outside* the bar (to the right) so the bar
 *   itself stays clean.
 */

const ProgressRow = Styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--neko-gray-30);

  .neko-progress-side {
    font-size: 13px;
    font-weight: 700;
    color: var(--neko-gray-40);
    flex: 0 0 auto;
  }
`;

const Track = Styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: var(--neko-control-height);
  padding: 3px;
  box-sizing: border-box;
  border-radius: 999px;
  background: transparent;
  /* Crisp outer border defines the pill container. The inner fill sits
     inset from the border so you read it as "pill inside a pill". */
  border: 2px solid color-mix(in oklab, var(--neko-main-color) 55%, transparent);
  overflow: hidden;

  .neko-progress-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 12px;
    transition: clip-path 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* Crisp two-layer knockout — the dark label sits on the empty track,
     the white label is clip-path'd to only reveal itself where the fill
     has passed. Both stay pin-sharp: no text-shadow, no blur. */
  .neko-progress-label.dark {
    color: var(--neko-gray-30);
  }
  .neko-progress-label.light {
    color: white;
  }
`;

const VARIANT_COLORS = {
  primary: 'var(--neko-main-color)',
  success: 'var(--neko-green)',
  warning: 'var(--neko-orange)',
  danger:  'var(--neko-red)',
  info:    'var(--neko-blue)',
};

const Fill = Styled.div`
  position: relative;
  height: 100%;
  width: ${props => `${Math.max(0, Math.min(100, props.$percent))}%`};
  border-radius: 999px;
  /* Solid variant colour, pixel-sharp — no gradients, no shadows, no halos. */
  background: ${props => VARIANT_COLORS[props.$variant] || VARIANT_COLORS.primary};
  transition:
    width 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.3s ease;
  will-change: width;
`;

const Buttons = Styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
`;

const NekoProgress = (props) => {
  let {
    value = 0,
    max = 100,
    busy = false,
    isBusy = false,
    paused = false,
    variant,
    startLabel,
    endLabel,
    onPauseClick,
    onStopClick,
    className,
    // Legacy props — kept for backward-compat but no longer rendered inside
    // the bar. The bar now shows only the percentage; any caption belongs
    // outside (above/below/beside) the component.
    status,
    label,
    showPercent,
    ...rest
  } = props;

  const busyState = busy || isBusy;

  useDeprecatedIsBusy(isBusy, 'NekoProgress');

  const ratio = parseFloat(value) / parseFloat(max);
  const ratioOk = Number.isFinite(ratio);
  const percent = ratioOk ? Math.round(Math.max(0, Math.min(1, ratio)) * 100) : 0;

  React.useEffect(() => {
    if (!ratioOk) {
      console.warn(
        `NekoProgress: invalid value/max (value=${value}, max=${max}). Falling back to 0%. ` +
        `Make sure both are finite numbers and max > 0.`
      );
    }
  }, [ratioOk, value, max]);
  const effectiveVariant = variant || (percent >= 100 ? 'success' : 'primary');

  const classNames = useClasses('neko-progress', className);
  const hasControls = busyState && (onPauseClick || onStopClick);
  const labelText = `${percent}%`;

  return (
    <ProgressRow className={classNames} {...rest}>
      {startLabel && <span className="neko-progress-side">{startLabel}</span>}
      <Track>
        <Fill $percent={percent} $busy={busyState} $variant={effectiveVariant} />
        <span className="neko-progress-label dark">{labelText}</span>
        <span className="neko-progress-label light"
          style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}>
          {labelText}
        </span>
      </Track>
      {endLabel && <span className="neko-progress-side">{endLabel}</span>}
      {hasControls && (
        <Buttons>
          {onPauseClick && (
            <NekoButton rounded className="primary" icon={paused ? 'play' : 'pause'}
              title={paused ? 'Resume' : 'Pause'} onClick={onPauseClick} />
          )}
          {onStopClick && (
            <NekoButton rounded className="danger" icon="stop"
              title="Stop" onClick={onStopClick} />
          )}
        </Buttons>
      )}
    </ProgressRow>
  );
};

NekoProgress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  busy: PropTypes.bool,
  isBusy: PropTypes.bool,
  paused: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'info']),
  /** Optional bookend labels (e.g. "2025" / "2026"). */
  startLabel: PropTypes.node,
  endLabel: PropTypes.node,
  onPauseClick: PropTypes.func,
  onStopClick: PropTypes.func,
};

export { NekoProgress };
