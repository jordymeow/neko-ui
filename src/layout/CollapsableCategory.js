import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoIcon } from '../misc/Icon';

const CategoryWrapper = Styled.div`
  margin-bottom: 8px;
`;

const CategoryTitle = Styled.div`
  padding: 5px 0;
  border-bottom: 1px solid var(--neko-main-color-80);
  color: var(--neko-main-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0;
  transition: color var(--neko-duration-base) var(--neko-ease-out);

  &:focus-visible {
    outline: 2px solid var(--neko-main-color);
    outline-offset: 2px;
  }

  .neko-accordion-head {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .neko-accordion-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: var(--neko-main-color);
    opacity: 0.85;
    transition: opacity var(--neko-duration-base) var(--neko-ease-out);
  }

  .neko-accordion-subtitle {
    margin-left: 8px;
    color: var(--neko-gray-50);
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0;
  }

  &:hover {
    color: color-mix(in oklab, var(--neko-main-color) 85%, black);
    .neko-accordion-icon { opacity: 1; }
    /* Nudge the +/- icon on hover for feedback. By class, not "> span:last-child": a title
       without content has no +/- icon, so its last child is the title text itself, which
       turned 90 degrees and flew off when hovered (the section titles of AI Engine's theme
       editors: Style, Font, Actions). */
    > .neko-accordion-toggle { transform: rotate(90deg); }
  }

  /* A title with nothing to open is a heading, not a control: it does not react. */
  &[data-static="true"] {
    cursor: default;
    &:hover { color: var(--neko-main-color); }
  }
`;

/* Plus/minus icon: two bars, vertical rotates 90° + scales out when expanded */
const PlusMinus = Styled.span`
  position: relative;
  display: inline-block;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: var(--neko-main-color);
  transition: transform 0.35s var(--neko-ease-spring);

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: currentColor;
    border-radius: 1px;
    transition:
      transform var(--neko-duration-base) var(--neko-ease-spring),
      opacity var(--neko-duration-base) var(--neko-ease-out);
  }
  &::before {
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    transform: translateY(-50%);
  }
  &::after {
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    transform: translateX(-50%) ${(props) => (props.$isCollapsed ? 'rotate(0deg)' : 'rotate(90deg) scaleY(0)')};
    opacity: ${(props) => (props.$isCollapsed ? 1 : 0)};
  }
`;

const CollapsibleContent = Styled.div`
  max-height: ${(props) => (props.$isCollapsed ? '0' : `${props.$contentHeight + 15}px`)};
  overflow: hidden;
  opacity: ${(props) => (props.$isCollapsed ? 0 : 1)};
  transition: ${(props) => (props.$animate
    ? 'max-height 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease'
    : 'none')};

  /* Built-in breathing room between the accordion title underline and the
     first row of content — stories no longer need to hand-apply
     marginTop: 10 on the first child of every body. */
  > div {
    padding-top: 10px;
  }
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
  const [expandedCategory, setExpandedCategory] = useState(() => {
    if (!keepState) return null;
    try {
      return JSON.parse(localStorage.getItem(keepState));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (keepState) {
      localStorage.setItem(keepState, JSON.stringify(expandedCategory));
    }
  }, [expandedCategory, keepState]);

  const onCategoryClick = (categoryIndex) => {
    setExpandedCategory(expandedCategory === categoryIndex ? null : categoryIndex);
  };

  return (
    <div className="neko-accordions">
      {React.Children.map(children, (child, index) => {
        if (child?.type === NekoCollapsableCategory || 
            child?.type === NekoAccordion ||
            child?.type === NekoCollapsableCategoryDeprecated ||
            child?.type?.name === 'NekoCollapsableCategoryDeprecated') {
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
  subtitle,
  icon,
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
      let storedCollapsed = null;
      try { storedCollapsed = JSON.parse(localStorage.getItem(keepState)); } catch {}
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

  // A section that has never been opened builds nothing. A settings screen with a dozen closed
  // sections used to lay out every field inside them and fetch their images up front. Once
  // opened it stays mounted, because the open and close animation measures the real content.
  const [everOpened, setEverOpened] = useState(!isCollapsed);
  useEffect(() => {
    if (!collapsed) {
      setEverOpened(true);
    }
  }, [collapsed]);

  // The resize observer does not report the content appearing for the first time, so the very
  // first open animated to 15px of padding and looked empty. Measure it once it is there.
  useEffect(() => {
    if (everOpened) {
      updateContentHeight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [everOpened]);

  if (hide) {
    return null;
  }

  const interactive = hasChildren && !disabled;
  const toggle = () => {
    if (interactive) {
      setAnimate(true);
      setCollapsed(!collapsed);
      onClick();
    }
  };

  return (
    <CategoryWrapper className="neko-accordion" style={style}>
      <CategoryTitle
        onClick={toggle}
        // A styled div with an onClick and nothing else: the whole Chatbots builder, where every
        // setting lives behind one of these, could not be opened without a mouse. aria-expanded
        // also lets a screen reader say whether the section is open before it is entered.
        data-static={hasChildren ? undefined : 'true'}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-expanded={interactive ? !collapsed : undefined}
        onKeyDown={interactive ? (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            toggle();
          }
        } : undefined}
        style={{
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        <span className="neko-accordion-head">
          {icon && (
            <span className="neko-accordion-icon">
              <NekoIcon icon={icon} width={18} fill="none" raw />
            </span>
          )}
          {(icon || subtitle) ? (
            <span>
              <span className="neko-accordion-title">{title}</span>
              {subtitle && <small className="neko-accordion-subtitle">{subtitle}</small>}
            </span>
          ) : (
            title
          )}
        </span>
        {hasChildren && <PlusMinus className="neko-accordion-toggle" $isCollapsed={collapsed} />}
      </CategoryTitle>
      <CollapsibleContent $isCollapsed={collapsed} $contentHeight={contentHeight} $animate={animate}>
        <div ref={contentRef}>{everOpened ? children : null}</div>
      </CollapsibleContent>
    </CategoryWrapper>
  );
};

NekoCollapsableCategory.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  subtitle: PropTypes.node,
  icon: PropTypes.string,
  isCollapsed: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
  keepState: PropTypes.string,
  disabled: PropTypes.bool,
  hide: PropTypes.bool,
};

// Modern component names
const NekoAccordion = NekoCollapsableCategory;
const NekoAccordions = NekoCollapsableCategories;

// Deprecated aliases with console warnings
const NekoCollapsableCategoryDeprecated = (props) => {
  console.warn(
    '[NekoUI] NekoCollapsableCategory is deprecated. Please use NekoAccordion instead.'
  );
  return <NekoCollapsableCategory {...props} />;
};

const NekoCollapsableCategoriesDeprecated = (props) => {
  console.warn(
    '[NekoUI] NekoCollapsableCategories is deprecated. Please use NekoAccordions instead.'
  );
  return <NekoCollapsableCategories {...props} />;
};

// Copy propTypes to deprecated components
NekoCollapsableCategoryDeprecated.propTypes = NekoCollapsableCategory.propTypes;
NekoCollapsableCategoriesDeprecated.propTypes = NekoCollapsableCategories.propTypes;

export { 
  // New recommended exports
  NekoAccordion, 
  NekoAccordions,
  // Deprecated exports (backward compatibility)
  NekoCollapsableCategoryDeprecated as NekoCollapsableCategory,
  NekoCollapsableCategoriesDeprecated as NekoCollapsableCategories
};
