// Previous: none
// Current: 0.0.0

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

const StyledSection = Styled.section`
  .mask {
    position: absolute;
    overflow: hidden;
    display: block;
    width: ${props => props.width}px;
    height: ${props => props.width / 2}px;
  }

  .semi-circle {
    position: relative;
    display: block;
    width: ${props => props.width}px;
    height: ${props => props.width / 2}px;
    background: linear-gradient(to right, #27b775 0%, #f3f32c 50%, #f71b1b 100%);
    border-radius: 50% 50% 50% 50% / 100% 100% 0% 0% ;

    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      z-index: 2;
      display: block;
      width: 140px;
      height: 70px;
      margin-left: -70px;
      background: ${props => props.backgroundColor};
      border-radius: 50% 50% 50% 50% / 100% 100% 0% 0% ;
    }      
  }

  .semi-circle--mask {
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.width}px;
    height: ${props => props.width}px;
    background: transparent;
    transform-origin: center center;
    backface-visibility: hidden;
    transition: all .3s ease-in-out;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0%;
      z-index: 2;
      display: block;
      width: ${props => props.width + 2}px;
      height: ${props => props.width / 2 + 2}px;
      margin-top: -1px;
      margin-left: -1px;
      background: #5396c1d6;
      border-radius: 50% 50% 50% 50% / 100% 100% 0% 0% ;
    }      
  }

  .gauge { 
    width: ${props => props.width}px;
    height: ${props => props.width / 2}px;
    
    .semi-circle--mask {
      transform: rotate(${props => props.degrees}deg) translate3d(0,0,0);
    }
  }

  .child-container {
    position: absolute;
    font-size: 16px;
    display: flex;
    width: ${props => props.width + 2}px;
    height: ${props => props.width / 2}px;
    z-index: 10;

    .spacing {
      flex: auto;
    }

    .child {
      color: white;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;

const NekoGauge = ({ value = 1000, min = 0, max = 2500, width = 200, background = '#007cba', children }) => {
  const [internalValue, setInternalValue] = useState(value);
  const [degrees, setDegrees] = useState(0);

  useEffect(() => {
    const computedDegrees = 180 * (internalValue <= max ? internalValue : max) / max;
    setDegrees(computedDegrees);
  }, [internalValue, max]);

  useEffect(() => {
    setTimeout(() => {
      setInternalValue(value);
    }, 100);
  }, [value]);

  return (
    <StyledSection className='neko-gauge' backgroundColor={background} degrees={degrees} width={width}>
      <div className="gauge">
        <div className="mask">
          <div className="semi-circle"></div>
          <div className="semi-circle--mask"></div>
        </div>
        <div className="child-container">
          <div className="child">
            <div className="spacing" />
            {children}
          </div>
        </div>
      </div>
    </StyledSection>
  )
};

NekoGauge.propTypes = {
  value : PropTypes.number,
  min : PropTypes.number,
  max : PropTypes.number,
  width : PropTypes.number,
  background : PropTypes.string,
};

export { NekoGauge };