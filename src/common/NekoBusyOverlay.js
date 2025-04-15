// Previous: none
// Current: 0.0.0

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useClasses } from '../hooks';

const NekoBusyOverlay = (props) => {
  const { spinner = true, busy = false, overlayStyle } = props;
  const [ showLoader, setShowLoader ] = useState(true);

  useEffect(() => {
    let timeout;

    if (!busy) { 
      timeout = setTimeout(() => { 
        setShowLoader(false); 
        timeout = null; 
      }, 250);
    }
    else { 
      setShowLoader(true);
    }

    return (() => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
  }, [busy]);

  const className = useClasses('neko-overlay', { overlayHidden: !busy });

  const loader = !showLoader ? null : (
    <>
      <div className={className} style={overlayStyle}>
        {Boolean(spinner) && 
          <div className={'lds-ellipsis ' + (!busy ? 'spinnerHidden' : '')}>
            <div></div><div></div><div></div><div></div>
          </div>
        }
      </div>
      <style jsx="true">{`
        .neko-overlay {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background: var(--neko-main-overlay-color);
          border-radius: 8px;
          transition: opacity 1s ease-out;
          z-index: 10;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }

        .overlayHidden {
          opacity: 0;
          transition: opacity 0.25s ease-out;
        }
        .spinnerHidden {
          opacity: 0;
          transition: opacity 0.25s ease-out;
        }
        .lds-ellipsis {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          justify-items: center;
          align-items: center;
        }
        .lds-ellipsis div {
          position: absolute;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: white;
          animation-timing-function: cubic-bezier(0, 1, 1, 0);
        }
        .lds-ellipsis div:nth-child(1) {
          left: 8px;
          animation: lds-ellipsis1 0.6s infinite;
        }
        .lds-ellipsis div:nth-child(2) {
          left: 8px;
          animation: lds-ellipsis2 0.6s infinite;
        }
        .lds-ellipsis div:nth-child(3) {
          left: 32px;
          animation: lds-ellipsis2 0.6s infinite;
        }
        .lds-ellipsis div:nth-child(4) {
          left: 56px;
          animation: lds-ellipsis3 0.6s infinite;
        }
        @keyframes lds-ellipsis1 {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes lds-ellipsis3 {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(0);
          }
        }
        @keyframes lds-ellipsis2 {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(24px, 0);
          }
        }
      `}</style>
    </>
  );

  const propsForElement = { ...props, busy: undefined, spinner: undefined };
  return (
    <div style={{ position: 'relative' }} {...propsForElement}> 
      {loader}
      {props.children}
    </div>
  );
};

NekoBusyOverlay.propTypes = {
  busy: PropTypes.bool.isRequired,
  spinner: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default NekoBusyOverlay;