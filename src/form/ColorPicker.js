import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoButton } from '../button/Button';

const StyledColorPicker = Styled.div`
  position: relative;
  transition: opacity 0.3s ease;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
    
    .swatch {
      cursor: not-allowed;
      border-color: var(--neko-disabled-color);
    }
  }

  .swatch {
    width: 24px;
    height: 24px;
    border: 3px solid #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border-radius: var(--neko-radius-sm);
    transition: transform 0.15s ease, opacity 0.3s ease, border-color 0.3s ease;
    background-image: 
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc);
    background-size: 6px 6px;
    background-position: 0 0, 3px 3px;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: scale(1.1);
    }
  }
  
  .popover {
    position: fixed;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    z-index: 10066;
    border-radius: 8px;
    background: white;
    padding: 12px;
    width: 200px;
  }

  .color-picker-area {
    width: 100%;
    height: 150px;
    position: relative;
    border-radius: 4px;
    margin-bottom: 10px;
    background: linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%),
                linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #000 100%);
    cursor: crosshair;
  }

  .color-picker-cursor {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .hue-slider {
    width: 100%;
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(to right, 
      #ff0000 0%, 
      #ffff00 17%, 
      #00ff00 33%, 
      #00ffff 50%, 
      #0000ff 67%, 
      #ff00ff 83%, 
      #ff0000 100%);
    position: relative;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .alpha-slider {
    width: 100%;
    height: 12px;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    margin-bottom: 10px;
    background-image: 
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc);
    background-size: 8px 8px;
    background-position: 0 0, 4px 4px;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 6px;
      background: linear-gradient(to right, transparent 0%, var(--current-color) 100%);
    }
  }

  .hue-cursor, .alpha-cursor {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .hex-input {
    width: 100%;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 12px;
    border: 1.5px solid var(--neko-input-border);
    box-sizing: border-box;
    height: 28px;
    background: var(--neko-input-background);
    color: black;
    padding: 0 8px;
    border-radius: var(--neko-radius-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    text-align: center;

    &:focus {
      background-color: white;
      box-shadow: var(--neko-focus-ring);
      outline: none;
    }
  }
`;

// Helper functions for color conversion
const hexToHsva = (hex) => {
  // Ensure hex starts with # and handle 3, 6, or 8 character formats
  if (!hex || hex === '') {
    return { h: 0, s: 0, v: 0, a: 100 };
  }
  
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-char hex
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  // Parse RGB values
  const r = parseInt(hex.slice(0, 2), 16) / 255 || 0;
  const g = parseInt(hex.slice(2, 4), 16) / 255 || 0;
  const b = parseInt(hex.slice(4, 6), 16) / 255 || 0;
  const a = hex.length >= 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, v: v * 100, a: a * 100 };
};

const hsvaToHex = (h, s, v, a = 100, includeAlpha = null) => {
  h = h / 360;
  s = s / 100;
  v = v / 100;
  const alpha = a / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r, g, b;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
    default: r = 0; g = 0; b = 0; break;
  }

  const toHex = (n) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  // Only include alpha in hex if it's not 100% OR if explicitly requested
  const shouldIncludeAlpha = includeAlpha !== null ? includeAlpha : alpha < 0.999;
  const alphaHex = shouldIncludeAlpha ? toHex(alpha) : '';
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
};

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event) => {
      if (startedInside || !startedWhenMounted) return;
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    const validateEventStart = (event) => {
      startedWhenMounted = ref.current;
      startedInside = ref.current && ref.current.contains(event.target);
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};

const NekoColorPicker = ({ name, value = '#000000', onChange, supportAlpha = true, disabled = false }) => {
  const popover = useRef();
  const swatchRef = useRef();
  const colorAreaRef = useRef();
  const hueSliderRef = useRef();
  const alphaSliderRef = useRef();
  const [isOpen, toggle] = useState(false);
  const [color, setColor] = useState(value);
  const [hsva, setHsva] = useState(() => {
    const parsed = hexToHsva(value);
    // If alpha is disabled, always set alpha to 100
    if (!supportAlpha) {
      parsed.a = 100;
    }
    return parsed;
  });
  const [isDraggingColor, setIsDraggingColor] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [isDraggingAlpha, setIsDraggingAlpha] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setColor(value);
    const newHsva = hexToHsva(value);
    if (!supportAlpha) {
      newHsva.a = 100;
    }
    setHsva(newHsva);
  }, [value, supportAlpha]);

  const close = useCallback(() => { 
    if (color !== value) {
      onChange(color, name);
    }
    toggle(false);
  }, [color, value, onChange, name]);

  useClickOutside(popover, close);

  // Calculate popover position when opening
  useEffect(() => {
    if (isOpen && swatchRef.current && popover.current) {
      const swatchRect = swatchRef.current.getBoundingClientRect();
      const popoverWidth = 224; // 200px + padding
      const popoverHeight = supportAlpha ? 285 : 260; // adjust height if alpha slider is shown
      
      let top = swatchRect.top - popoverHeight - 8;
      let left = swatchRect.left + swatchRect.width / 2 - popoverWidth / 2;
      
      // Check if popover would go off the top of the screen
      if (top < 10) {
        top = swatchRect.bottom + 8;
      }
      
      // Check if popover would go off the left side
      if (left < 10) {
        left = 10;
      }
      
      // Check if popover would go off the right side
      if (left + popoverWidth > window.innerWidth - 10) {
        left = window.innerWidth - popoverWidth - 10;
      }
      
      // Check if popover would go off the bottom (when positioned below)
      if (top > swatchRect.bottom && top + popoverHeight > window.innerHeight - 10) {
        top = swatchRect.top - popoverHeight - 8;
      }
      
      setPopoverPosition({ top, left });
    }
  }, [isOpen, supportAlpha]);

  const updateColorFromHsva = (newHsva) => {
    setHsva(newHsva);
    // Only include alpha in the hex if supportAlpha is true AND alpha is not 100%
    const hex = hsvaToHex(newHsva.h, newHsva.s, newHsva.v, newHsva.a, supportAlpha ? null : false);
    setColor(hex);
  };

  const handleColorAreaMouseDown = (e) => {
    setIsDraggingColor(true);
    updateColorArea(e);
  };

  const updateColorArea = (e) => {
    if (!colorAreaRef.current) return;
    const rect = colorAreaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    const newHsva = {
      h: hsva.h,
      s: x * 100,
      v: (1 - y) * 100,
      a: hsva.a
    };
    updateColorFromHsva(newHsva);
  };

  const handleHueMouseDown = (e) => {
    setIsDraggingHue(true);
    updateHue(e);
  };

  const updateHue = (e) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    const newHsva = {
      h: x * 360,
      s: hsva.s,
      v: hsva.v,
      a: hsva.a
    };
    updateColorFromHsva(newHsva);
  };

  const handleAlphaMouseDown = (e) => {
    setIsDraggingAlpha(true);
    updateAlpha(e);
  };

  const updateAlpha = (e) => {
    if (!alphaSliderRef.current) return;
    const rect = alphaSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    const newHsva = {
      h: hsva.h,
      s: hsva.s,
      v: hsva.v,
      a: x * 100
    };
    updateColorFromHsva(newHsva);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingColor) {
        updateColorArea(e);
      } else if (isDraggingHue) {
        updateHue(e);
      } else if (isDraggingAlpha) {
        updateAlpha(e);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingColor(false);
      setIsDraggingHue(false);
      setIsDraggingAlpha(false);
    };

    if (isDraggingColor || isDraggingHue || isDraggingAlpha) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingColor, isDraggingHue, isDraggingAlpha, hsva]);

  const handleHexInput = (e) => {
    const value = e.target.value;
    const maxLength = supportAlpha ? 9 : 7;
    if (/^#[0-9A-Fa-f]{0,8}$/.test(value) && value.length <= maxLength) {
      setColor(value);
      if (value.length === 7 || (supportAlpha && value.length === 9)) {
        const newHsva = hexToHsva(value);
        // If alpha is disabled, always set alpha to 100
        if (!supportAlpha) {
          newHsva.a = 100;
        }
        setHsva(newHsva);
      }
    }
  };

  const hueColor = hsvaToHex(hsva.h, 100, 100, 100);
  const currentColorOpaque = hsvaToHex(hsva.h, hsva.s, hsva.v, 100);

  return (
    <StyledColorPicker className={`neko-color-picker ${disabled ? 'disabled' : ''}`}>
      <div 
        className="swatch" 
        ref={swatchRef} 
        onClick={() => !disabled && toggle(true)}
      >
        <div style={{ 
          backgroundColor: disabled ? 'var(--neko-gray-80)' : color, 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }} />
      </div>
      {isOpen && (
        <div 
          className="popover" 
          ref={popover}
          style={{ 
            top: `${popoverPosition.top}px`, 
            left: `${popoverPosition.left}px` 
          }}>
          <div 
            className="color-picker-area" 
            ref={colorAreaRef}
            style={{ backgroundColor: hueColor }}
            onMouseDown={handleColorAreaMouseDown}
          >
            <div 
              className="color-picker-cursor" 
              style={{ 
                left: `${hsva.s}%`, 
                top: `${100 - hsva.v}%`,
                backgroundColor: currentColorOpaque
              }} 
            />
          </div>
          
          <div 
            className="hue-slider" 
            ref={hueSliderRef}
            onMouseDown={handleHueMouseDown}
          >
            <div 
              className="hue-cursor" 
              style={{ 
                left: `${(hsva.h / 360) * 100}%`,
                backgroundColor: hueColor
              }} 
            />
          </div>

          {supportAlpha && (
            <div 
              className="alpha-slider" 
              ref={alphaSliderRef}
              style={{ '--current-color': currentColorOpaque }}
              onMouseDown={handleAlphaMouseDown}
            >
              <div 
                className="alpha-cursor" 
                style={{ 
                  left: `${hsva.a}%`,
                  backgroundColor: color
                }} 
              />
            </div>
          )}

          <input
            type="text"
            className="hex-input"
            value={color}
            onChange={handleHexInput}
            maxLength={supportAlpha ? 9 : 7}
            placeholder={supportAlpha ? "#RRGGBBAA" : "#RRGGBB"}
          />

          <div style={{ display: 'flex', padding: 0 }}>
            <NekoButton style={{ flex: 1 }} onClick={() => onChange(color, name)}>Apply</NekoButton>
          </div>
        </div>
      )}
    </StyledColorPicker>
  );
};

NekoColorPicker.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  supportAlpha: PropTypes.bool,
  disabled: PropTypes.bool
};

export { NekoColorPicker };