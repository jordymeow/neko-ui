import { createContext, useContext, useEffect, useMemo, useState, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';


// When a NekoContextMenu renders another NekoContextMenu inside it (e.g. a
// NekoSelect rendered inside a NekoTable column filter popup), the child
// portal lives in document.body and is NOT a DOM descendant of the parent
// portal. Without this registry, a mousedown inside the child portal would
// be treated as "outside" by the parent and dismiss it, which destroyed
// the child before its onClick could run. Each menu registers its portal
// node with its nearest parent via context, so the parent's outside-click
// check can include all descendant portals.
const PortalRegistry = createContext(null);

const NekoContextMenu = ({ children, visible = false, targetRef, onClose, matchWidth = true }) => {
  const portalRef = useRef();
  const [opacity, setOpacity] = useState(0);

  const parentRegistry = useContext(PortalRegistry);
  const descendantPortalsRef = useRef(new Set());
  const registry = useMemo(() => ({
    register: (ref) => {
      descendantPortalsRef.current.add(ref);
      parentRegistry && parentRegistry.register(ref);
    },
    unregister: (ref) => {
      descendantPortalsRef.current.delete(ref);
      parentRegistry && parentRegistry.unregister(ref);
    },
  }), [parentRegistry]);

  useEffect(() => {
    if (!parentRegistry || !visible) return;
    parentRegistry.register(portalRef);
    return () => parentRegistry.unregister(portalRef);
  }, [parentRegistry, visible]);

  useEffect(() => {
    if (!visible) return;
    const handleMouseDown = (e) => {
      const refs = [targetRef, portalRef, ...descendantPortalsRef.current];
      for (const ref of refs) {
        if (ref?.current && ref.current.contains(e.target)) return;
      }
      onClose && onClose();
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [visible, onClose, targetRef]);

  useEffect(() => {
    const element = document.createElement('div');
    portalRef.current = element;
    return () => {
      portalRef.current = null;
    };
  }, []);

  const updatePosition = () => {
    if (!visible || !portalRef.current || !targetRef.current) return;

    requestAnimationFrame(() => {
      const rect = targetRef.current.getBoundingClientRect();
      // Resolve the target's own window so the portal positions correctly when the
      // trigger lives inside an iframe (e.g. Gutenberg apiVersion 3 block editor).
      const targetWindow = targetRef.current.ownerDocument?.defaultView || window;
      const windowHeight = targetWindow.innerHeight;
      const windowWidth = targetWindow.innerWidth;
      let contextMenuContent = portalRef.current.querySelector('.neko-portal-content');
      
      // Find the first child with height
      while (contextMenuContent && !contextMenuContent.offsetHeight) {
        contextMenuContent = contextMenuContent.firstChild;
      }

      const contextMenuHeight = contextMenuContent ? contextMenuContent.offsetHeight : 0;
      const contextMenuWidth = matchWidth ? rect.width : (contextMenuContent ? contextMenuContent.offsetWidth : 0);

      const topPosition = windowHeight - rect.bottom < contextMenuHeight 
        ? rect.top - contextMenuHeight 
        : rect.bottom;

      // Compute left with viewport padding instead of margins, to keep perfect alignment
      const padding = 5; // gutter to avoid touching the viewport edges
      let leftPosition = rect.left;
      const maxLeft = windowWidth - contextMenuWidth - padding;
      if (Number.isFinite(maxLeft)) {
        leftPosition = Math.min(leftPosition, maxLeft);
      }
      leftPosition = Math.max(leftPosition, padding);

      const styleObj = {
        position: 'fixed', 
        top: `${topPosition}px`,
        left: `${leftPosition}px`,
        width: matchWidth ? `${rect.width}px` : 'auto',
        zIndex: '9999'
      };
      Object.assign(portalRef.current.style, styleObj);
    });
  };

  useEffect(() => {
    if (visible && portalRef.current) {
      // Append the portal to the target's own document so styles (injected by the
      // active styled-components StyleSheetManager into the same document) apply.
      const targetDoc = targetRef.current?.ownerDocument || document;
      targetDoc.body.appendChild(portalRef.current);
      // Use a timeout to delay the actual rendering and then trigger the animation
      const timeoutId = setTimeout(() => {
        updatePosition();
        setOpacity(1);
      }, 5); // This delay is to let the browser render the element with opacity: 0 first

      return () => clearTimeout(timeoutId);
    } else if (portalRef.current) {
      const parentNode = portalRef.current.parentNode;
      if (parentNode) parentNode.removeChild(portalRef.current);
      setOpacity(0); // reset opacity when not visible
    }
  }, [visible, portalRef, targetRef]);

  useLayoutEffect(() => {
    updatePosition();
    const onResizeOrScroll = () => updatePosition();
    // Listen on the target's own window so resize/scroll inside an iframe keep the portal aligned.
    const targetWindow = targetRef.current?.ownerDocument?.defaultView || window;
    targetWindow.addEventListener('resize', onResizeOrScroll);
    targetWindow.addEventListener('scroll', onResizeOrScroll);

    return () => {
      targetWindow.removeEventListener('resize', onResizeOrScroll);
      targetWindow.removeEventListener('scroll', onResizeOrScroll);
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
      {/* No <NekoUI> wrapper here: a second GlobalStyles instance deletes the page's :root variables when the menu unmounts. */}
      <PortalRegistry.Provider value={registry}>
        {children}
      </PortalRegistry.Provider>
    </div>,
    portalRef.current
  );
};

NekoContextMenu.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool,
  targetRef: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  matchWidth: PropTypes.bool,
};

export { NekoContextMenu };
