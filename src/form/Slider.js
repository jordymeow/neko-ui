import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SliderContainer = styled.div`
  position: relative;
  user-select: none;
  padding-top: 24px;
  transition: opacity 0.3s ease;
  
  &.disabled {
    opacity: 0.6;
  }
`;

const SliderTrackContainer = styled.div`
  position: relative;
  height: 20px;
  cursor: pointer;
  padding: 0 10px;
`;

const SliderTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
  height: 6px;
  background: ${props => props.$disabled ? 'var(--neko-disabled-color)' : 'var(--neko-gray-90)'};
  border-radius: 3px;
  transform: translateY(-50%);
  opacity: ${props => props.$disabled ? 0.5 : 1};
  transition: background 0.3s ease, opacity 0.3s ease;
`;

const SliderFill = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  height: 6px;
  background: ${props => props.$disabled ? 'var(--neko-disabled-color)' : 'var(--neko-main-color)'};
  border-radius: 3px;
  transform: translateY(-50%);
  pointer-events: none;
  transition: background 0.3s ease;
`;

const SliderThumb = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: ${props => props.$disabled ? 'var(--neko-disabled-color)' : 'var(--neko-main-color)'};
  border-radius: 50%;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'grab'};
  transition: background 0.3s ease, box-shadow 0.2s ease;
  z-index: 2;

  &:hover {
    box-shadow: ${props => props.$disabled ? 'none' : '0 0 0 8px rgba(0, 123, 255, 0.1)'};
  }

  &:active {
    cursor: ${props => props.$disabled ? 'not-allowed' : 'grabbing'};
    box-shadow: ${props => props.$disabled ? 'none' : '0 0 0 12px rgba(0, 123, 255, 0.15)'};
  }

  &.dragging {
    cursor: grabbing;
    box-shadow: 0 0 0 12px rgba(0, 123, 255, 0.15);
  }
`;

const RecommendedMarker = styled.div`
  position: absolute;
  top: 50%;
  width: 3px;
  height: 14px;
  background: var(--neko-green, #00b386);
  border-radius: 5px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
`;

const TickMarks = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 10px;
  transform: translateY(-50%);
  pointer-events: none;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const TickMark = styled.div`
  position: absolute;
  top: 50%;
  width: 1px;
  height: 8px;
  background: var(--neko-gray-80);
  transform: translate(-50%, -50%);
`;

const ValueLabels = styled.div`
  position: absolute;
  top: 6px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--neko-gray-70);
  pointer-events: none;
`;

const ValueLabel = styled.div`
  position: absolute;
  transform: translateX(-50%);
  white-space: nowrap;
  font-weight: ${props => props.$isCurrent ? '600' : '400'};
  color: ${props => {
    if (props.$disabled) return 'var(--neko-gray-70)';
    if (props.$isCurrent && !props.$disabled) return 'var(--neko-main-color)';
    if (props.$isRecommended && !props.$disabled) return 'var(--neko-green, #00b386)';
    return 'var(--neko-gray-70)';
  }};
  opacity: ${props => props.$visible ? 1 : 0};
  transition: color 0.3s ease, opacity 0.2s ease;
`;

const Description = styled.div`
  margin-top: 5px;
  margin-bottom: 0;
  font-size: var(--neko-small-font-size);
  color: var(--neko-gray-60);
  line-height: 14px;
`;

const NekoSlider = ({
  name,
  value,
  min = 0,
  max = 100,
  step = 1,
  marks,
  recommended,
  description,
  onChange,
  onFinalChange,
  disabled = false,
  showLabels = true,
  formatValue,
  labelFormatter,
  className,
  style
}) => {
  const [internalValue, setInternalValue] = useState(value ?? min);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  useEffect(() => {
    if (isControlled && value !== undefined) {
      setInternalValue(value);
    }
  }, [value, isControlled]);

  const clampValue = useCallback((val) => {
    const stepValue = Math.round(val / step) * step;
    return Math.max(min, Math.min(max, stepValue));
  }, [min, max, step]);

  const getPositionFromValue = useCallback((val) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  const getValueFromPosition = useCallback((clientX) => {
    if (!trackRef.current) return currentValue;
    
    const rect = trackRef.current.getBoundingClientRect();
    const padding = 10; // padding on each side
    const effectiveWidth = rect.width - (padding * 2);
    const effectiveX = clientX - rect.left - padding;
    const percent = Math.max(0, Math.min(1, effectiveX / effectiveWidth));
    const rawValue = min + percent * (max - min);
    return clampValue(rawValue);
  }, [min, max, currentValue, clampValue]);

  const handleChange = useCallback((newValue) => {
    const clampedValue = clampValue(newValue);
    
    if (!isControlled) {
      setInternalValue(clampedValue);
    }
    
    if (onChange) {
      onChange(clampedValue, name);
    }
  }, [isControlled, onChange, name, clampValue]);

  const handleFinalChange = useCallback((finalValue) => {
    if (onFinalChange) {
      onFinalChange(finalValue, name);
    }
  }, [onFinalChange, name]);

  const handleMouseDown = useCallback((e) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    
    let latestValue = getValueFromPosition(e.clientX);
    handleChange(latestValue);
    
    const handleMouseMove = (e) => {
      latestValue = getValueFromPosition(e.clientX);
      handleChange(latestValue);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      handleFinalChange(latestValue);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [disabled, getValueFromPosition, handleChange, handleFinalChange]);

  const handleTrackClick = useCallback((e) => {
    if (disabled || e.target === thumbRef.current) return;
    const newValue = getValueFromPosition(e.clientX);
    handleChange(newValue);
    handleFinalChange(newValue);
  }, [disabled, getValueFromPosition, handleChange, handleFinalChange]);

  const formatDisplayValue = useCallback((val) => {
    if (formatValue) {
      return formatValue(val);
    }
    return Number.isInteger(val) ? val.toString() : val.toFixed(1);
  }, [formatValue]);

  const formatLabel = useCallback((val) => {
    if (labelFormatter) {
      return labelFormatter(val);
    }
    return formatDisplayValue(val);
  }, [labelFormatter, formatDisplayValue]);

  // Calculate tick marks based on marks prop or intelligently
  const tickMarks = useMemo(() => {
    const range = max - min;
    const resultMarks = [];
    
    if (marks && Array.isArray(marks)) {
      // Use provided marks, excluding min and max
      marks.forEach(val => {
        if (val > min && val < max) {
          const position = ((val - min) / range) * 100;
          resultMarks.push({ value: val, position });
        }
      });
    } else {
      // Determine good tick interval based on range
      let interval;
      if (range <= 10) {
        interval = 1;
      } else if (range <= 50) {
        interval = 5;
      } else if (range <= 100) {
        interval = 10;
      } else if (range <= 500) {
        interval = 50;
      } else if (range <= 1000) {
        interval = 100;
      } else if (range <= 5000) {
        interval = 500;
      } else {
        interval = Math.pow(10, Math.floor(Math.log10(range / 5)));
      }
      
      // Generate tick marks (excluding min and max)
      for (let val = min + interval; val < max; val += interval) {
        const position = ((val - min) / range) * 100;
        resultMarks.push({ value: val, position });
      }
    }
    
    return resultMarks;
  }, [min, max, marks]);

  const thumbPosition = getPositionFromValue(currentValue);
  const hasRecommended = recommended !== undefined && recommended >= min && recommended <= max;

  return (
    <SliderContainer 
      className={`${className || ''} ${disabled ? 'disabled' : ''}`} 
      style={style}
      $hasDescription={!!description}
    >
      {showLabels && (
        <ValueLabels>
          <ValueLabel 
            style={{ left: '10px' }}
            $visible={isDragging}
          >
            {formatLabel(min)}
          </ValueLabel>
          
          {hasRecommended && !disabled && (
            <ValueLabel 
              style={{ left: `calc(10px + (100% - 20px) * ${getPositionFromValue(recommended) / 100})` }}
              $isRecommended
              $visible={true}
              $disabled={disabled}
            >
              {formatLabel(recommended)}
            </ValueLabel>
          )}
          
          <ValueLabel 
            style={{ left: `calc(10px + (100% - 20px) * ${thumbPosition / 100})` }}
            $isCurrent
            $visible={true}
            $disabled={disabled}
          >
            {formatLabel(currentValue)}
          </ValueLabel>
          
          <ValueLabel 
            style={{ left: 'calc(100% - 10px)' }}
            $visible={isDragging}
          >
            {formatLabel(max)}
          </ValueLabel>
        </ValueLabels>
      )}
      
      <SliderTrackContainer 
        ref={trackRef}
        onClick={handleTrackClick}
      >
        <SliderTrack $disabled={disabled} />
        
        <TickMarks $visible={isDragging}>
          {tickMarks.map((tick, index) => (
            <TickMark 
              key={index}
              style={{ left: `calc(10px + (100% - 20px) * ${tick.position / 100})` }}
            />
          ))}
        </TickMarks>
        
        <SliderFill 
          style={{ width: `calc((100% - 20px) * ${thumbPosition / 100})` }}
          $disabled={disabled}
        />
        
        {hasRecommended && !disabled && (
          <RecommendedMarker style={{ left: `calc(10px + (100% - 20px) * ${getPositionFromValue(recommended) / 100})` }} />
        )}
        
        <SliderThumb
          ref={thumbRef}
          className={isDragging ? 'dragging' : ''}
          style={{ left: `calc(10px + (100% - 20px) * ${thumbPosition / 100})` }}
          onMouseDown={handleMouseDown}
          $disabled={disabled}
        />
      </SliderTrackContainer>
      
      {description && (
        <Description>{description}</Description>
      )}
    </SliderContainer>
  );
};

NekoSlider.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  marks: PropTypes.arrayOf(PropTypes.number),
  recommended: PropTypes.number,
  description: PropTypes.string,
  onChange: PropTypes.func,
  onFinalChange: PropTypes.func,
  disabled: PropTypes.bool,
  showLabels: PropTypes.bool,
  formatValue: PropTypes.func,
  labelFormatter: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object
};

export default NekoSlider;
export { NekoSlider };