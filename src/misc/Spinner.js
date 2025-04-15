// Previous: none
// Current: 0.0.0

import React from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";
import { useClasses } from '../hooks';

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

/**
 * @param {string} (variant) Tag Name
 */
const StyledNekoSpinner = (props) => {
  const { type = 'circle', ...rest } = props;

  switch (type) {
    case 'circle':
      return <CircleSpinner {...rest} />

    default:
      return null;
  }
};

const NekoSpinner = (props) => {
  return <StyledNekoSpinner {...props} />;
};

NekoSpinner.propTypes = {
  type: PropTypes.string,
};

export { NekoSpinner };
