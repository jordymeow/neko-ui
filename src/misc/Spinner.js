import React from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";
import { useClasses } from '../hooks';
import { NekoIcon } from './Icon';

const StyledCircleSpinner = Styled.div`
  width: ${props => props.size || '50%'};
  padding-top: ${props => props.size || '50%'};
  position: relative;
  margin: 0 auto;

  .double-bounce1, .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: ${props => props.color || '#333'};
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;

    -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
    animation: sk-bounce 2.0s infinite ease-in-out;
  }

  .double-bounce2 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }

  @-webkit-keyframes sk-bounce {
    0%, 100% { -webkit-transform: scale(0.0) }
    50% { -webkit-transform: scale(1.0) }
  }

  @keyframes sk-bounce {
    0%, 100% {
      transform: scale(0.0);
      -webkit-transform: scale(0.0);
    } 50% {
      transform: scale(1.0);
      -webkit-transform: scale(1.0);
    }
  }
`;

const CircleSpinner = ({ className, size, ...props }) => {
  const classNames = useClasses('neko-spinner', props.className);
  return (
    <StyledCircleSpinner className={classNames} size={size} {...props}>
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </StyledCircleSpinner>
  );
};

const StyledIconSpinner = Styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '24px'};
  height: ${props => props.size || '24px'};
  
  .neko-icon {
    animation: rotate 1s linear infinite;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const IconSpinner = ({ className, size = '24px', color = '#666', ...props }) => {
  const classNames = useClasses('neko-spinner-icon', className);
  const iconSize = parseInt(size);
  
  return (
    <StyledIconSpinner className={classNames} size={size} {...props}>
      <NekoIcon 
        icon="sync" 
        width={iconSize} 
        height={iconSize} 
        color={color}
        raw
      />
    </StyledIconSpinner>
  );
};

/**
 * @param {string} (variant) Tag Name
 */
const StyledNekoSpinner = (props) => {
  const { type = 'icon', ...rest } = props;

  switch (type) {
    case 'circle':
      return <CircleSpinner {...rest} />
    
    case 'icon':
      return <IconSpinner {...rest} />

    default:
      return <IconSpinner {...rest} />
  }
};

const NekoSpinner = (props) => {
  return <StyledNekoSpinner {...props} />;
};

NekoSpinner.propTypes = {
  type: PropTypes.oneOf(['circle', 'icon']),
  size: PropTypes.string,
  color: PropTypes.string,
};

export { NekoSpinner };
