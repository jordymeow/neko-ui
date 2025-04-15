// Previous: none
// Current: 0.0.0

import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { ProOnly } from '../label/ProOnly';
import { NekoIcon } from '../misc/Icon';
import { useClasses } from '../hooks';
import NekoBusyOverlay from '../common/NekoBusyOverlay';
import { NekoButton } from '../button/Button';

const TAB_MAX_WIDTH = 320;
const SQUEEZED_TAB_MIN_WIDTH = 85;
const SQUEEZED_TAB_MAX_WIDTH = 160;
const NEKO_TABS_DEBUG_MODE = false;

const TabsHeaderContainer = Styled.div`
  display: flex;
  align-items: stretch;
  position: relative;
  height: 39px;
`;

const TabsHeader = Styled.div`
  display: flex;
  height: 39px;
  overflow-x: hidden;

  flex-grow: 1;
  flex-shrink: 1;
  max-width: 100%;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabsActions = Styled.div`
  display: flex;
  align-items: center;
  height: 39px;
  margin-left: auto;
  flex-shrink: 0;
`;

const Tab = Styled.button`
  border-radius: 8px 8px 0px 0px;
  border: 0;
  background-color: var(--neko-main-color-disabled);
  color: rgb(255 255 255 / 65%);
  display: flex;
  align-items: center;
  cursor: pointer;
  text-align: left;
  padding: 12px 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 5px 0 0;

  ${(props) => props.squeezed ? `
    flex: 1 1 ${SQUEEZED_TAB_MIN_WIDTH}px;
    max-width: ${SQUEEZED_TAB_MAX_WIDTH}px;
    min-width: ${SQUEEZED_TAB_MIN_WIDTH}px;
  ` : `
    flex: 0 0 auto;
    max-width: ${TAB_MAX_WIDTH}px;
  `}

  &:not(.active):not(.disabled):hover {
    filter: brightness(1.1);
  }

  &:focus {
    outline: none;
  }

  &.active {
    background-color: var(--neko-main-color);
    color: var(--neko-white);
  }

  &.disabled {
    cursor: default;
    display: inline-flex;
    padding-bottom: 7px;
  }

  &.hidden {
    display: none;
  }

  &.inversed {
    &.active {
      background-color: var(--neko-white);
      color: var(--neko-font-color);
    }
  }
`;

const TabsSlider = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 39px;
  margin-right: 5px;
`;

const TabContent = Styled.div`
  background-color: var(--neko-main-color);
  color: white;
  display: none;
  padding: 10px;
  border-radius: 0px 0px 8px 8px;
  box-shadow: 0px 8px 8px -8px rgba(0, 0, 0, 0.35);

  &.active {
    display: block;
  }

  &.inversed {
    background-color: var(--neko-white);
    color: var(--neko-black);
  }
`;

const getKeyOfTab = (child, i) => {
  const props = child.props;
  let key = 'tab-' + (i + 1);
  if (child.key) {
    key = child.key;
  } else if (typeof props.title === 'string') {
    key = props.title
      .toLowerCase()
      .replace(
        /[^a-z0-9\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\u2e80-\u2eff\u31f0-\u31ff\u3200-\u32ff\u3400-\u4dbf\uf900-\ufaff ]/gi,
        ''
      )
      .replace(/ /g, '-');
  }
  return key;
};

const randomHash = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let hash = '';
  for (let i = 0; i < length; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

const StyledNekoTabs = (props) => {
  const {
    inversed,
    children,
    action,
    isPro,
    currentTab,
    onChange,
    keepTabOnReload = true,
    callOnTabChangeFirst = true,
    ...rest
  } = props;

  const tabsHeaderRef = useRef(null);
  const actionsRef = useRef(null);
  const [actionWidth, setActionWidth] = useState(0);
  const [needsMoreSpace, setNeedsMoreSpace] = useState(false);

  const [internalCurrentTab, setInternalCurrentTab] = useState(() => {
    if (currentTab !== undefined) {
      return currentTab;
    } else if (keepTabOnReload) {
      const url = new URL(window.location.href);
      const storedTabKey = url.searchParams.get('nekoTab');
      return storedTabKey || '';
    } else {
      return '';
    }
  });

  const initialTabSelected = useRef(false);
  const tabRefs = useRef([]);

  const handleWheel = useCallback((event) => {
    if (tabsHeaderRef.current) {
      event.preventDefault();
      tabsHeaderRef.current.scrollLeft += event.deltaY;
    }
  }, []);

  useEffect(() => {
    const tabsHeader = tabsHeaderRef.current;
    if (tabsHeader) {
      tabsHeader.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        tabsHeader.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);

  const keepTab = useCallback((key) => {
    if (history.pushState && typeof key === 'string') {
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.set('nekoTab', key);
      let newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?' +
        searchParams.toString();
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, []);

  const validChildren = useMemo(() => {
    const valid = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        valid.push(child);
      }
    });
    return valid;
  }, [children]);

  const onTabClick = useCallback(
    (tabIndex, tabAttr, ev) => {
      if (!tabAttr || tabAttr.requirePro) {
        return;
      }
      if (currentTab === undefined && internalCurrentTab !== tabAttr.key) {
        setInternalCurrentTab(tabAttr.key);
      }
      if (onChange) {
        onChange(tabIndex, tabAttr, ev);
      }
      if (keepTabOnReload) {
        keepTab(tabAttr.key);
      }
    },
    [currentTab, internalCurrentTab, onChange, keepTabOnReload, keepTab]
  );

  useLayoutEffect(() => {
    if (actionsRef.current) {
      setActionWidth(actionsRef.current.offsetWidth);
    }
  }, []);

  useLayoutEffect(() => {
    if (NEKO_TABS_DEBUG_MODE && tabsHeaderRef.current) {
      console.log(`Initial container width: ${tabsHeaderRef.current.clientWidth}px`);
    }
  }, []);

  const tabAttributes = useMemo(() => {
    const allKeys = new Set();
    const newTabAttributes = React.Children.map(validChildren, (child, i) => {
      let key = child.key || getKeyOfTab(child, i);
      if (allKeys.has(key)) {
        console.warn(
          `Duplicate key '${key}' found in NekoTabs. Generating unique key.`
        );
        key += '-' + randomHash();
      }
      allKeys.add(key);

      const {
        title = `Untitled Tab ${i + 1}`,
        onClick = null,
        requirePro: childRequirePro = false,
        hidden = false,
        icon = null,
      } = child.props;
      const requirePro = !isPro && childRequirePro;
      return { key, title, onClick, requirePro, hidden, icon };
    });
    return newTabAttributes || [];
  }, [validChildren, isPro]);

  useLayoutEffect(() => {
    const availableWidth = tabsHeaderRef.current?.clientWidth || 0;
    let totalTabsWidth = 0;
    tabRefs.current.forEach((tabRef) => {
      if (tabRef) {
        totalTabsWidth += tabRef.scrollWidth;
      }
    });
    const isSqueezed = totalTabsWidth > availableWidth;
    setNeedsMoreSpace(isSqueezed);
    if (NEKO_TABS_DEBUG_MODE) {
      console.log(`Tabs are ${isSqueezed ? '' : 'not '}squeezed`);
      console.log(`Tab Keys: ${tabAttributes.map((a) => a.key).join(', ')}`);
      console.log(`Total Tabs Width: ${totalTabsWidth}px, Available Width: ${availableWidth}px`);
    }
  }, [tabAttributes, actionWidth]);

  useEffect(() => {
    if (tabAttributes.length === 0) return;

    const tabKeys = tabAttributes.map((attr) => attr.key);
    let newCurrentTab =
      currentTab !== undefined ? currentTab : internalCurrentTab;

    if (!tabKeys.includes(newCurrentTab) && tabKeys.length > 0) {
      newCurrentTab = tabKeys[0];
    }

    if (newCurrentTab !== internalCurrentTab) {
      setInternalCurrentTab(newCurrentTab);
    }
  }, [currentTab, tabAttributes]);

  useLayoutEffect(() => {
    if (initialTabSelected.current) return;
    if (tabAttributes.length === 0) return;

    initialTabSelected.current = true;

    const tabKeys = tabAttributes.map((attr) => attr.key);
    if (keepTabOnReload) {
      const url = new URL(window.location.href);
      const storedTabKey = url.searchParams.get('nekoTab');
      let tabKeyToSelect = storedTabKey && tabKeys.includes(storedTabKey)
        ? storedTabKey
        : tabKeys[0];

      if (tabKeyToSelect !== internalCurrentTab) {
        setInternalCurrentTab(tabKeyToSelect);
        const tabIndex = tabKeys.indexOf(tabKeyToSelect);
        if (callOnTabChangeFirst && tabAttributes[tabIndex]) {
          onTabClick(tabIndex, tabAttributes[tabIndex]);
        }
      }
    } else if (callOnTabChangeFirst) {
      const tabIndex = tabKeys.indexOf(internalCurrentTab);
      if (tabIndex !== -1 && tabAttributes[tabIndex]) {
        onTabClick(tabIndex, tabAttributes[tabIndex]);
      }
    }
  }, [
    keepTabOnReload,
    callOnTabChangeFirst,
    tabAttributes,
    internalCurrentTab,
    onTabClick,
  ]);

  const childTabs = useMemo(() => {
    return React.Children.map(validChildren, (child, i) => {
      const attr = tabAttributes[i];
      if (!attr) return null;
      const isActive = attr.key === internalCurrentTab && !attr.hidden;
      if (isActive && attr.hidden) {
        const firstVisibleTab = tabAttributes.find((a) => !a.hidden);
        if (firstVisibleTab) {
          setInternalCurrentTab(firstVisibleTab.key);
        }
      }
      return React.cloneElement(child, {
        isActive,
        inversed,
        key: attr.key,
      });
    });
  }, [validChildren, internalCurrentTab, inversed, tabAttributes]);

  const handleScrollLeft = () => {
    if (tabsHeaderRef.current) {
      tabsHeaderRef.current.scrollTo({
        left: tabsHeaderRef.current.scrollLeft - 200,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (tabsHeaderRef.current) {
      tabsHeaderRef.current.scrollTo({
        left: tabsHeaderRef.current.scrollLeft + 200,
        behavior: 'smooth',
      });
    }
  };

  const classNames = useClasses('neko-tabs', { inversed });

  return (
    <div className={classNames} {...rest}>
      <TabsHeaderContainer>
        <TabsHeader
          ref={tabsHeaderRef}
          $needsMoreSpace={needsMoreSpace}
          $actionWidth={actionWidth}
        >
          {tabAttributes.map((attr, i) => (
            <Tab
              key={attr.key}
              ref={(el) => (tabRefs.current[i] = el)}
              onClick={(ev) => onTabClick(i, attr, ev)}
              className={`neko-tab-title ${
                attr.key === internalCurrentTab ? 'active' : ''
              } ${attr.requirePro ? 'disabled' : ''} ${
                attr.hidden ? 'hidden' : ''
              } ${inversed ? 'inversed' : ''}`}
              squeezed={needsMoreSpace}
            >
              {attr.icon && (
                <NekoIcon
                  icon={attr.icon}
                  width={15}
                  height={15}
                  style={{ marginRight: '5px' }}
                  raw
                />
              )}

              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  flex: '1 1 auto',
                }}
              >
                {attr.title}
              </div>

              <ProOnly
                className="inline"
                show={attr.requirePro}
                style={{ marginLeft: 10, marginRight: -5, top: -1 }}
              />
            </Tab>
          ))}
        </TabsHeader>
        <TabsActions ref={actionsRef}>
          {needsMoreSpace && (
            <TabsSlider>
              <NekoButton
                rounded
                className="secondary"
                icon="chevron-left"
                onClick={handleScrollLeft}
              ></NekoButton>
              <NekoButton
                rounded
                className="secondary"
                icon="chevron-right"
                onClick={handleScrollRight}
              ></NekoButton>
            </TabsSlider>
          )}
          {action && action}
        </TabsActions>
      </TabsHeaderContainer>
      {childTabs}
    </div>
  );
};

const StyledNekoTab = (props) => {
  const { children, isActive = false, busy = false, inversed } = props;
  const classNames = useClasses('neko-tab-content', {
    active: isActive,
    inversed,
  });

  return (
    <NekoBusyOverlay busy={busy}>
      <TabContent className={classNames}>{isActive && children}</TabContent>
    </NekoBusyOverlay>
  );
};

const NekoTabs = (props) => <StyledNekoTabs {...props} />;

NekoTabs.propTypes = {
  isPro: PropTypes.bool,
  onChange: PropTypes.func,
  action: PropTypes.node,
  currentTab: PropTypes.string,
  keepTabOnReload: PropTypes.bool,
  callOnTabChangeFirst: PropTypes.bool,
};

NekoTabs.defaultProps = {
  keepTabOnReload: false,
  callOnTabChangeFirst: true,
};

const NekoTab = (props) => <StyledNekoTab {...props} />;

NekoTab.propTypes = {
  isActive: PropTypes.bool,
  requirePro: PropTypes.bool,
  title: PropTypes.string,
  icon: PropTypes.string,
};

export { NekoTab, NekoTabs };