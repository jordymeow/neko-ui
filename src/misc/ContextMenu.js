// Previous: none
// Current: 0.0.0

import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { useOutsideClick } from '../hooks';
import NekoUI from '../NekoUI';

const NekoContextMenu = ({ children, visible = false, targetRef, onClose }) => {
  const portalRef = useRef();
  const [opacity, setOpacity] = useState(0);

  useOutsideClick(() => {
    if (visible) onClose();
  }, [targetRef, portalRef]);

  useEffect(() => {
    const element = document.createElement('div');
    portalRef.current = element;
    return () => {
      if (portalRef.current) {
        document.body.removeChild(portalRef.current);
      }
      portalRef.current = null;
    };
  }, []);

  const updatePosition = () => {
    if (!visible || !portalRef.current || !targetRef.current) return;

    requestAnimationFrame(() => {
      const rect = targetRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      let contextMenuContent = portalRef.current.querySelector('.neko-portal-content');
      
      while (contextMenuContent && !contextMenuContent.offsetHeight) {
        contextMenuContent = contextMenuContent.firstChild;
      }

      const contextMenuHeight = contextMenuContent ? contextMenuContent.offsetHeight : 0;
      const topPosition = windowHeight - rect.bottom < contextMenuHeight 
        ? rect.top - contextMenuHeight 
        : rect.bottom;

      Object.assign(portalRef.current.style, {
        position: 'fixed',
        top: `${topPosition}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: '9999'
      });
    });
  };

  useEffect(() => {
    if (visible && portalRef.current) {
      document.body.appendChild(portalRef.current);
      const timeoutId = setTimeout(() => {
        updatePosition();
        setOpacity(1);
      }, 5);
      
      return () => {
        clearTimeout(timeoutId);
        if (portalRef.current && portalRef.current.parentNode) {
          portalRef.current.parentNode.removeChild(portalRef.current);
        }
        setOpacity(0);
      };
    } else if (portalRef.current) {
      const parentNode = portalRef.current.parentNode;
      if (parentNode) parentNode.removeChild(portalRef.current);
      setOpacity(0);
    }
  }, [visible, portalRef, targetRef]);

  useLayoutEffect(() => {
    updatePosition();
    const onResizeOrScroll = () => updatePosition();
    window.addEventListener('resize', onResizeOrScroll);
    window.addEventListener('scroll', onResizeOrScroll);

    return () => {
      window.removeEventListener('resize', onResizeOrScroll);
      window.removeEventListener('scroll', onResizeOrScroll);
    };
  }, [visible, portalRef, targetRef]);

  if (!visible || !portalRef.current) {
    return null;
  }

  const portalStyles = {
    opacity: opacity,
    transition: 'opacity 0.2s cubic-bezier(0.22, 0.61, 0.36, 1)',
  };
  
  return ReactDOM.createPortal(
    <div className="neko-portal-content" style={portalStyles}>
      <NekoUI>{children}</NekoUI>
    </div>, 
    portalRef.current
  );
};

NekoContextMenu.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool,
  targetRef: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export { NekoContextMenu };