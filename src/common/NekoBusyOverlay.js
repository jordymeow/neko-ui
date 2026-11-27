import React, { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useClasses, useDeprecatedIsBusy } from '../hooks';
import { NekoIcon } from '../misc/Icon';

const STYLE_ID = 'neko-busy-overlay-css';
const CSS = `
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
.spinnerTop {
  justify-content: flex-start;
  padding-top: 80px;
}
.neko-busy-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: spin 1s linear infinite;
}
.neko-busy-icon svg {
  color: white;
  transform: scaleY(-1);
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

// The CSS used to be a <style> rendered by every overlay instance (one per tab
// panel, block, table...), so each mount/unmount forced a full style recalc.
// It is now injected once per document.
const useInsertion = React.useInsertionEffect || useLayoutEffect;
const injectedDocs = new WeakSet();
const useOverlayStyles = () => {
  useInsertion(() => {
    if (typeof document === 'undefined' || injectedDocs.has(document)) return;
    injectedDocs.add(document);
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);
};

const NekoBusyOverlay = (props) => {
  const { spinner = true, busy = false, isBusy = false, overlayStyle, spinnerTop = false,
    children, ...rest } = props;
  useOverlayStyles();

  // Handle both busy and isBusy props - prefer busy over isBusy
  const busyState = busy || isBusy;

  useDeprecatedIsBusy(isBusy, 'NekoBusyOverlay');

  // Starts hidden when not busy: an invisible overlay used to sit on top of
  // freshly mounted content for 250ms and swallow clicks.
  const [ showLoader, setShowLoader ] = useState(busyState);

  useEffect(() => {
    if (busyState) {
      setShowLoader(true);
      return;
    }
    const timeout = setTimeout(() => setShowLoader(false), 250);
    return () => clearTimeout(timeout);
  }, [busyState]);

  const className = useClasses('neko-overlay', { overlayHidden: !busyState, spinnerTop: spinnerTop });

  return (
    <div style={{ position: 'relative' }} {...rest}>
      {showLoader && (
        <div className={className} style={overlayStyle}>
          {Boolean(spinner) &&
            <div className={'neko-busy-icon ' + (!busyState ? 'spinnerHidden' : '')}>
              <NekoIcon raw icon="sync" width={32} height={32} />
            </div>
          }
        </div>
      )}
      {children}
    </div>
  );
};

NekoBusyOverlay.propTypes = {
  busy: PropTypes.bool,
  isBusy: PropTypes.bool,
  spinner: PropTypes.bool,
  spinnerTop: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default NekoBusyOverlay;
