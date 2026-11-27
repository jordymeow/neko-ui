import React, { useId } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

const GaugeWrapper = Styled.section`
  position: relative;
  display: inline-block;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  line-height: 1;

  svg {
    display: block;
    overflow: visible;
  }

  .neko-gauge-content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: ${props => Math.round(props.width * 0.05)}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    text-align: center;
    pointer-events: none;
  }
`;

const NekoGauge = ({ value = 1000, min = 0, max = 2500, width = 200, background = '#007cba', children }) => {
  const id = useId().replace(/:/g, '');
  const range = Math.max(1, max - min);
  const ratio = Math.max(0, Math.min(1, (value - min) / range));

  const stroke = Math.max(10, Math.round(width * 0.075));
  const padding = stroke / 2 + 2;
  const cx = width / 2;
  const cy = width / 2;
  const r = width / 2 - padding;
  const height = Math.ceil(width / 2 + padding / 2);

  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const arcLength = Math.PI * r;
  const filledLength = arcLength * ratio;

  return (
    <GaugeWrapper className='neko-gauge' width={width} height={height} backgroundColor={background}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`neko-gauge-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#27b775" />
            <stop offset="50%" stopColor="#f3c52c" />
            <stop offset="100%" stopColor="#f71b1b" />
          </linearGradient>
        </defs>
        <path
          d={arcPath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={arcPath}
          fill="none"
          stroke={`url(#neko-gauge-${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filledLength} ${arcLength + 1}`}
          style={{ transition: 'stroke-dasharray 0.4s var(--neko-ease-out, ease-out)' }}
        />
      </svg>
      <div className="neko-gauge-content">{children}</div>
    </GaugeWrapper>
  );
};

NekoGauge.propTypes = {
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  width: PropTypes.number,
  background: PropTypes.string,
  children: PropTypes.node,
};

export { NekoGauge };
