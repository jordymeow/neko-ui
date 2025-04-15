// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { ProOnly } from '../label/ProOnly';
import { Icon } from '@iconify/react';
import chevronDown from '@iconify/icons-mdi/chevron-down';
import chevronRight from '@iconify/icons-mdi/chevron-right';
import { useClasses } from '../hooks';

const TabContainer = Styled.div`
`;

const Tab = Styled.div`
  align-items: center;
  background-color: var(--neko-main-color);
  border: 0;
  cursor: pointer;
  display: flex;
  padding: 2px 3px 2px 19px;

  &.disabled {
    background-color: rgba(var(--neko-yellow-rgb), 0.25);
    cursor: default;
  }

  p {
    color: white;
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size);
    line-height: 17px;
    margin: 0;
  }

  .neko-side-tab-icon {
    color: white;
    margin-left: auto;
    height: 36px;
    width: 36px;
  }
`;

const TabContent = Styled.div`
  background-color: white;
  color: var(--neko-font-color);
  display: none;

  &.active {
    display: block;
  }
`;

const StyledNekoSideTabs = props => {
  const [activeTabIndex, setIsActiveTabIndex] = React.useState(props.activeTabIndex);

  const tabAttributes = React.Children.map(props.children, (child, i) => {
    const title = child.props.title || ("Untitled Tab " + (i + 1));

    let key = "tab-" + (i + 1);
    if (child.props.key) {
      key = child.props.key;
    } else if (typeof child.props.title === 'string') {
      key = child.props.title.toLowerCase().replace(/[^a-z0-9 ]/gi, '');
      key = key.replace(/ /g, '-');
    }
    // From July 4th, we avoid encoding this key.
    //key = encodeURIComponent(key);

    const onClick = child.props.onClick ? child.props.onClick : null;
    const requirePro = !props.isPro && (child.props.requirePro || false);
    const onDragOver = child.props.onDragOver;
    const onDrop = child.props.onDrop;
    const rightActions = child.props.rightActions || null;
    const className = child.props.className;
    return { key, title, onClick, requirePro, onDragOver, onDrop, rightActions, className };
  });

  const children = React.Children.map(props.children, (child, i) => {
    return React.cloneElement(child, {
      isActive: i === activeTabIndex
    });
  });

  const onTabClick = (tabIndex, tabAttr, ev) => {
    if (tabAttr.requirePro) return;
    const newTabIndex = tabIndex === activeTabIndex ? null : tabIndex;
    setIsActiveTabIndex(newTabIndex);
    if (props.onChange) {
      props.onChange(newTabIndex, tabAttr, ev);
    }
  };

  return (
    <TabContainer className='neko-side-tabs'>
      {tabAttributes.map((attr, i) => {
        const tabClassNames = ['neko-side-tab', i === activeTabIndex ? 'active' : '', attr.requirePro ? 'disabled' : ''].filter(v => v.length > 0);
        return (<React.Fragment key={attr.key + '-frag'}>
          <Tab
            key={attr.key}
            className={tabClassNames}
            onClick={(ev) => { onTabClick(i, attr, ev); }}
            onDragOver={attr.onDragOver}
            onDrop={attr.onDrop}
          >
            <p>
              <span style={{ fontSize: 15 }}>{attr.title}</span>
              <ProOnly className="inline" show={attr.requirePro} />
            </p>
            {attr.rightActions === null
              ? <Icon icon={i === activeTabIndex ? chevronDown : chevronRight } className="neko-side-tab-icon" />
              : (
                i === activeTabIndex
                  ? <div style={{ marginLeft: 'auto' }}>{attr.rightActions}</div>
                  : <Icon icon={chevronRight} className="neko-side-tab-icon" />
              )
            }
          </Tab>
          { children[i] }
        </React.Fragment>);
      })}
    </TabContainer>
  );
};

const StyledNekoSideTab = props => {
  const { children, isActive = false, className } = props;
  const classNames = useClasses('neko-side-tab-content', className, { active: isActive });

  return (
    <TabContent className={classNames}>
      { children }
    </TabContent>
  );
};

const NekoSideTabs = (props) => {
  return (<StyledNekoSideTabs {...props} />);
};

NekoSideTabs.propTypes = {
  isPro: PropTypes.bool,
  onChange: PropTypes.func,
  activeTabIndex: PropTypes.number
};

const NekoSideTab = (props) => {
  return (<StyledNekoSideTab {...props} />);
};

NekoSideTab.propTypes = {
  isActive: PropTypes.bool,
  requirePro: PropTypes.bool,
  title: PropTypes.string,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  rightActions: PropTypes.element
};

export { NekoSideTab, NekoSideTabs };