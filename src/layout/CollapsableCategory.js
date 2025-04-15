// Previous: none
// Current: 0.0.0

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

const CategoryWrapper = Styled.div`
  margin-bottom: 10px;
`;

const CategoryTitle = Styled.div`
  margin-bottom: 0px;
  padding-bottom: 2px;
  border-bottom: 2px solid #d1e3f2;
  color: var(--neko-main-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-weight: 600;
`;

const Arrow = Styled.span`
  border: solid var(--neko-main-color);
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: ${(props) => (props.$isCollapsed ? 'rotate(45deg)' : 'rotate(-135deg)')};
  transition: transform 0.15s ease-in-out;
`;

const CollapsibleContent = Styled.div`
  max-height: ${(props) => (props.$isCollapsed ? '0' : `${props.$contentHeight + 15}px`)};
  overflow: hidden;
  transition: ${(props) => (props.$animate ? 'max-height 0.15s ease-in-out' : 'none')};
`;

const useResizeObserver = (ref, callback) => {
  useEffect(() => {
    const observeTarget = ref.current;
    if (!observeTarget) return;

    const observer = new ResizeObserver((entries) => {
      callback();
    });

    observer.observe(observeTarget);

    return () => observer.disconnect();
  }, [ref, callback]);
};

const NekoCollapsableCategories = ({ children, keepState }) => {
  const [expandedCategory, setExpandedCategory] = useState(
    keepState ? JSON.parse(localStorage.getItem(keepState)) : null
  );

  useEffect(() => {
    if (keepState) {
      localStorage.setItem(keepState, JSON.stringify(expandedCategory));
    }
  }, [expandedCategory, keepState]);

  const onCategoryClick = (categoryIndex) => {
    setExpandedCategory(expandedCategory === categoryIndex ? null : categoryIndex);
  };

  return (
    <div>
      {React.Children.map(children, (child, index) => {
        if (child?.type === NekoCollapsableCategory) {
          return React.cloneElement(child, {
            isCollapsed: expandedCategory !== index,
            onClick: () => onCategoryClick(index),
            keepState: keepState ? `${keepState}-${index}` : child.props.keepState,
          });
        }
        return child;
      })}
    </div>
  );
};

NekoCollapsableCategories.propTypes = {
  children: PropTypes.node.isRequired,
  keepState: PropTypes.string,
};

const NekoCollapsableCategory = ({
  isCollapsed = false,
  children,
  onClick = () => {},
  keepState,
  disabled = false,
  hide = false,
  title,
  style
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [animate, setAnimate] = useState(false);
  const hasChildren = React.Children.count(children) > 0;

  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const updateContentHeight = () => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  };

  useResizeObserver(contentRef, updateContentHeight);

  useEffect(() => {
    if (keepState) {
      const storedCollapsed = JSON.parse(localStorage.getItem(keepState));
      setCollapsed(storedCollapsed !== null ? storedCollapsed : isCollapsed);
    }
  }, [keepState, isCollapsed]);

  useEffect(() => {
    if (keepState) {
      localStorage.setItem(keepState, JSON.stringify(collapsed));
    }
  }, [collapsed, keepState]);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  if (hide) {
    return null;
  }

  return (
    <CategoryWrapper style={style}>
      <CategoryTitle
        onClick={() => {
          if (hasChildren && !disabled) {
            setAnimate(true);
            setCollapsed(!collapsed);
            onClick();
          }
        }}
        style={{
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        {title}
        {hasChildren && <Arrow $isCollapsed={collapsed} />}
      </CategoryTitle>
      <CollapsibleContent $isCollapsed={collapsed} $contentHeight={contentHeight} $animate={animate}>
        <div ref={contentRef}>{children}</div>
      </CollapsibleContent>
    </CategoryWrapper>
  );
};

NekoCollapsableCategory.propTypes = {
  title: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
  keepState: PropTypes.string,
  disabled: PropTypes.bool,
  hide: PropTypes.bool,
};