// Previous: none
// Current: 0.0.0

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { Icon } from '@iconify/react';
import folderIcon from '@iconify/icons-mdi/folder';
import folderOpen from '@iconify/icons-mdi/folder-open';
import imageMultipleOutline from '@iconify/icons-mdi/image-multiple-outline';
import chevronRight from '@iconify/icons-mdi/chevron-right';
import chevronDown from '@iconify/icons-mdi/chevron-down';
import tagIcon from '@iconify/icons-mdi/tag';
import { useClasses } from '../hooks';

const StyledNekoFinder = props => {
  const { chevron = true } = props;

  const children = React.Children.map(props.children, child => {
    return React.cloneElement(child, {
      chevron
    });
  });

  return (
    children
  );
};

const FinderTitleContainer = Styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-family: var(--neko-font-family);
`;

const FinderTitle = Styled.div`
  align-items: center;
  display: flex;

  &.can-expand {
    cursor: pointer;
  }

  &.selected {
    color: #956DBE;
  }

  span {
    font-weight: normal;
    font-size: var(--neko-font-size);
    margin: 0 0 0 8px;
  }

  svg {
    color: var(--neko-font-color) !important;
  }
`;

const ChevronSpace = Styled.div`
  height: 24px;
  width: 24px;
`;

const FinderTitleIconDropZone = Styled.div`
  position: relative;
  width: 24px;
  height: 24px;
`;

const FinderTitleIconDroppableArea = Styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
`;

const ItemContainer = Styled.div`
  border-left: 1px solid var(--neko-gray-98);
  margin-left: 12px;
  padding-left: 6px;

  &.no-line {
    border-left: 0;
    padding-left: 12px;
  }

  &.no-chevron {
    border-left: 0;
    margin-left: 0;
    padding-left: 0;
  }
`;

const StyledNekoFinderItem = props => {
  const defaultIcons = {
    gallery: imageMultipleOutline,
    tag: tagIcon
  }

  const { title, chevron, rightElement = null, rightElementStyle = { marginLeft: '5px' }, showRightElement = false, selected = false,
    draggable = false, onDragStart, onDragOver, onDragEnd, onDrop, isExpanded = false, dragging = false, rightAction = null,
    rightActionOnHover = null, onDragLeave, preventClose = false } = props;
  const isCustomizedIcon = !!props.icon;
  const hasChild = !!props.children;
  const [ expanded, setExpanded ] = useState(isExpanded);
  const [ icon, setIcon ] = useState(() => {
    if (typeof props.icon === 'string' && Object.keys(defaultIcons).includes(props.icon)) {
      return defaultIcons[props.icon];
    } else if (props.icon) {
      return props.icon;
    }
    return folderIcon
  });
  const isFolder = Boolean(icon);
  const [ showRightAction, setShowRightAction ] = useState(false);

  useEffect(() => {
    setExpanded(isExpanded);
    if (!isCustomizedIcon) {
      setIcon(isExpanded ? folderIcon : folderOpen);
    }
  }, [isCustomizedIcon, isExpanded]);

  const onClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  }

  const onChevronClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  }

  const children = React.Children.map(props.children, child => {
    return React.cloneElement(child, {
      chevron
    });
  });

  const iconColor = dragging || selected ? `var(--neko-purple)` : (selected ? `var(--neko-black)` : `var(--neko-main-color)`);
  const finderTitleClassNames = useClasses('neko-finder-title', { 'can-expand': isFolder || children || props.onClick }, { selected });
  const finderItemContainerClassNames = useClasses('neko-finder-item-container', { 'no-line': !isFolder }, { 'no-chvron': !chevron });

  return (
    <div className='neko-finder'>
      <FinderTitleContainer onMouseEnter={() => setShowRightAction(true)} onMouseLeave={() => setShowRightAction(false)}>
        <FinderTitle className={finderTitleClassNames} onClick={onClick} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave} draggable={draggable} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} onDragLeave={onDragLeave} onDragEnd={onDragEnd}>
          {chevron
            ? (isFolder && hasChild)
              ? <Icon icon={expanded ? chevronDown : chevronRight} width="24" height="24" onClick={onChevronClick} />
              : <ChevronSpace></ChevronSpace>
            : null
          }
          <FinderTitleIconDropZone>
            <FinderTitleIconDroppableArea />
            <Icon icon={icon} color={iconColor} width="24" height="24" />
          </FinderTitleIconDropZone>
          <span>{title}</span>
          {showRightElement &&
            <div style={rightElementStyle}>{rightElement}</div>
          }
        </FinderTitle>
        {showRightAction ? (rightActionOnHover || rightAction) : rightAction}
      </FinderTitleContainer>
      {expanded && <ItemContainer className={finderItemContainerClassNames}>{children}</ItemContainer>}
    </div>
  )
}

const NekoFinder = (props) => {
  return (<StyledNekoFinder {...props} />);
}

NekoFinder.propTypes = {
  chevron: PropTypes.bool
};

const NekoFinderItem = (props) => {
  return (<StyledNekoFinderItem {...props} />);
}

NekoFinderItem.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.instanceOf(Icon), PropTypes.oneOf(['gallery'])]),
  title: PropTypes.string,
  isExpanded: PropTypes.bool
};

export { NekoFinder, NekoFinderItem };