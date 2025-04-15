// Previous: none
// Current: 0.0.0

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { NekoTooltip } from './Tooltip';

const CountdownContainer = styled.div`
  display: inline-block;
  position: relative;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  user-select: none;
  cursor: pointer;
`;

const CountdownText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--neko-font-family, sans-serif);
  font-size: 0.8rem;
  font-weight: bold;
`;

const NekoCountdown = (props) => {
  const {
    initialTime = 10,
    size = 35,
    strokeWidth = 7,
    strokeColor = 'var(--neko-blue)',
    onEndCountdown,
  } = props;

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);
  const intervalId = useRef(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onEndCountdown?.();
      setIsActive(false);
      return;
    }

    intervalId.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId.current);
          onEndCountdown?.();
          setIsActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId.current);
    };
  }, [timeLeft, isActive, onEndCountdown]);

  const fraction = timeLeft / initialTime;
  const strokeDashoffset = circumference * (1 - fraction);

  const handleCountdownClick = () => {
    if (isActive) {
      clearInterval(intervalId.current);
      setIsActive(false);
    } else {
      setTimeLeft(initialTime);
      setIsActive(true);
    }
  };

  return (
    <NekoTooltip text={"Click to " + (isActive ? 'Pause' : 'Restart')}>
      <CountdownContainer size={size} onClick={handleCountdownClick}>
        <svg width={size} height={size}>
          <circle
            stroke="#ddd"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />

          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              transition: 'stroke-dashoffset 1s linear',
            }}
          />
        </svg>
        <CountdownText>{timeLeft}</CountdownText>
      </CountdownContainer>
    </NekoTooltip>
  );
};

NekoCountdown.propTypes = {
  initialTime: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  strokeColor: PropTypes.string,
  onEndCountdown: PropTypes.func,
};