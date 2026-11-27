import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';
import { NekoErrorBoundary } from '../helpers';

const SplitViewContainer = Styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  position: relative;
  width: 100%;
  min-height: 400px;

  &.collapsed {
    /* When the sidebar is collapsed it occupies zero width — drop the container
       gap too so the main column actually reaches the right edge instead of
       leaving a 20px ghost gutter. */
    gap: 0;

    .neko-splitview-sidebar {
      flex: 0 0 0;
      width: 0;
      min-width: 0;
      max-width: 0;
      padding: 0;
      overflow: hidden;
      opacity: 0;
    }

    .neko-splitview-main {
      flex: 1;
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .neko-splitview-sidebar {
      width: 100% !important;
      max-width: 100%;
      flex: 1 1 auto !important;
    }

    .neko-splitview-main {
      width: 100%;
    }

    &.collapsed {
      .neko-splitview-sidebar {
        display: none;
      }
    }
  }
`;

const MainContent = Styled.div`
  flex: ${props => props.$flex || 2};
  min-width: 0;
  padding: ${props => props.$minimal ? '0' : '32px 30px'};
  transition: flex 0.3s ease;
  position: relative;

  .neko-block:not(:first-child) {
    margin-top: ${props => props.$minimal ? '0' : '-20px'};
  }

  .neko-block:last-child {
    margin-bottom: 0px;
  }
`;

const Sidebar = Styled.div`
  flex: ${props => props.$flex || 1};
  min-width: 0;
  max-width: ${props => props.$maxWidth || '400px'};
  padding: ${props => props.$minimal ? '0' : '32px 30px'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--neko-sidebar-bg, transparent);
  opacity: 1;

  .neko-block:not(:first-child) {
    margin-top: ${props => props.$minimal ? '0' : '-20px'};
  }

  .neko-block:last-child {
    margin-bottom: 0px;
  }
`;

const StyledNekoSplitView = props => {
  const {
    children,
    isCollapsible = true,
    defaultCollapsed = false,
    isCollapsed: controlledIsCollapsed,
    onToggle,
    onCollapseChange,
    sidebarFlex = 1,
    mainFlex = 2,
    sidebarMaxWidth = '400px',
    minimal = false,
    className = '',
    ...rest
  } = props;

  // Determine if component is controlled or uncontrolled
  const isControlled = controlledIsCollapsed !== undefined;
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(defaultCollapsed);
  const isCollapsed = isControlled ? controlledIsCollapsed : internalIsCollapsed;

  const handleToggle = () => {
    if (isControlled) {
      // Controlled mode - call onToggle
      if (onToggle) {
        onToggle();
      }
    } else {
      // Uncontrolled mode - manage state internally
      const newState = !isCollapsed;
      setInternalIsCollapsed(newState);
      if (onCollapseChange) {
        onCollapseChange(newState);
      }
    }
  };

  const classNames = useClasses('neko-splitview', className, { collapsed: isCollapsed });

  const childrenArray = React.Children.toArray(children);
  const mainContent = childrenArray[0];
  const sidebarContent = childrenArray[1];

  return (
    <SplitViewContainer className={classNames} {...rest}>
      <MainContent className="neko-splitview-main" $flex={mainFlex} $minimal={minimal}>
        {mainContent}
      </MainContent>
      
      <Sidebar 
        className="neko-splitview-sidebar" 
        $flex={sidebarFlex}
        $maxWidth={sidebarMaxWidth}
        $minimal={minimal}
      >
        {sidebarContent}
      </Sidebar>
    </SplitViewContainer>
  );
};

const NekoSplitView = props => {
  return (
    <NekoErrorBoundary>
      <StyledNekoSplitView {...props} />
    </NekoErrorBoundary>
  );
};

const SplitViewMain = ({ children }) => children;
const SplitViewSidebar = ({ children }) => children;

NekoSplitView.Main = SplitViewMain;
NekoSplitView.Sidebar = SplitViewSidebar;

NekoSplitView.propTypes = {
  isCollapsible: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  onToggle: PropTypes.func,
  onCollapseChange: PropTypes.func,
  sidebarFlex: PropTypes.number,
  mainFlex: PropTypes.number,
  sidebarMaxWidth: PropTypes.string,
  minimal: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

SplitViewMain.propTypes = {
  children: PropTypes.node
};

SplitViewSidebar.propTypes = {
  children: PropTypes.node
};

export { NekoSplitView };