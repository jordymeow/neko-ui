import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { ChevronsLeft, ChevronLeft, ChevronsRight, ChevronRight } from 'lucide-react';
import { ICON_SIZES } from '../common/PresetIcons';

const PagingContainer = Styled.div`
  align-items: center;
  display: flex;
  user-select: none;

  .neko-paging-text {
    margin-right: 15px;
  }

  .neko-paging-controller {
    box-sizing: border-box;
    height: 30px;
    align-items: center;
    background: var(--neko-main-color);
    border-radius: 15px;
    display: flex;
    padding: 3px 5px;

    .nako-paging-controller-icon {
      background-color: white;
      border-radius: 50%;
      cursor: pointer;
      margin-right: 2px;
      height: 18px;
      width: 18px;
      min-width: 18px;
      min-height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.1s ease-in;
      box-sizing: border-box;
      flex-shrink: 0;

      :last-child {
        margin-right: 0;
      }

      &.disabled {
        color: var(--neko-disabled-color);
        cursor: default;
        pointer-events: none;
      }

      &:hover {
        transform: scale(1.2) !important;
        z-index: 10;
        position: relative;
      }
    }

    .nako-paging-controller-text {
      color: white;
      font-family: var(--neko-font-family);
      font-style: normal;
      font-weight: normal;
      font-size: var(--neko-font-size);
      margin: 0 10px;
      user-select: none;
      white-space: nowrap;
      
      @media (min-width: 360px) {
        margin: 0 20px;
      }
      
      @media (min-width: 480px) {
        margin: 0 40px;
      }
    }

    span.neko-paging-current-page {
      cursor: pointer;
      display: inline-block;
      padding: 0 6px;
      border-radius: 9px;
      background: rgba(255, 255, 255, 0.2);
      font-weight: 600;
      transition: background 0.15s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.35);
      }
    }

    /* Explicit values on every property so wp-admin input styles can't leak in */
    input.neko-paging-current-page {
      user-select: text;
      -webkit-user-select: text;
      box-sizing: content-box;
      height: 18px;
      min-height: 0;
      line-height: 18px;
      margin: 0;
      padding: 0 6px;
      border: none;
      border-radius: 9px;
      background: white;
      color: var(--neko-main-color);
      font: inherit;
      font-weight: 600;
      text-align: center;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
      outline: none;
      vertical-align: baseline;
    }
  }
`;

/**
 * @param {number} currentPage Current page
 * @param {number} limit Items per page
 */
const StyledNekoPaging = props => {
  const { currentPage, limit = 0, onClick, total = 0, onCurrentPageChanged, infinite = false, maxInfinite = false, controllerText, compact = false } = props;
  const isEditable = !!onCurrentPageChanged;
  const maxPage = useMemo(() => {
    if (infinite || maxInfinite) return 0;
    return Math.ceil(total === 0 ? 1 : (limit > 0 ? (total / limit) : 1));
  }, [infinite, maxInfinite, limit, total]);
  const prevIconClassName = `nako-paging-controller-icon ${!infinite && currentPage === 1 ? 'disabled' : ''}`;
  const nextIconClassName = `nako-paging-controller-icon ${(!infinite && !maxInfinite) && currentPage === maxPage ? 'disabled' : ''}`;
  const [ showCurrentPageInput, setShowCurrentPageInput ] = useState(false);
  const [useCompactMode, setUseCompactMode] = useState(compact);

  const onClickHandle = (page) => {
    setShowCurrentPageInput(false);
    onClick(page);
  };

  const getValidPage = (page) => {
    if (infinite) return page;
    const numberPage = Number(page);
    if (maxInfinite) {
      return numberPage < 1 ? 1 : numberPage;
    }
    return numberPage > maxPage ? maxPage : (numberPage < 1 ? 1 : numberPage);
  }

  // Single commit path: Enter blurs, Escape restores the value then blurs.
  const onBlur = (e) => {
    const page = e.target.value.trim();
    if (page !== '' && !isNaN(page)) {
      const valid = getValidPage(page);
      if (valid !== currentPage) onCurrentPageChanged(valid);
    }
    setShowCurrentPageInput(false);
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
    else if (e.key === 'Escape') {
      e.target.value = currentPage;
      e.target.blur();
    }
  };

  const currentPageJsx = useMemo(() => {
    if (!showCurrentPageInput) {
      const onClick = () => {
        // Don't allow editing if there's only 1 page or if not editable
        if (!isEditable || maxPage === 1) {
          return;
        }
        setShowCurrentPageInput(true);
      }
      // Only show as clickable if editable AND there's more than 1 page
      const isClickable = isEditable && maxPage > 1;
      return <span className={isClickable ? 'neko-paging-current-page' : ''} onClick={onClick}
        title={isClickable ? 'Go to page…' : undefined}>{currentPage}</span>;
    }
    return <input autoFocus type="text" inputMode="numeric" className="neko-paging-current-page"
      aria-label="Go to page" defaultValue={currentPage} onFocus={(e) => e.target.select()}
      style={{ width: `${Math.max(String(maxPage || currentPage).length, 2)}ch` }}
      onBlur={onBlur} onKeyDown={onKeyDown} />;
  }, [currentPage, showCurrentPageInput, onCurrentPageChanged, maxPage]);

  const onControllerClick = (e) => {
    if (!showCurrentPageInput || e.target !== e.currentTarget) return;

    setShowCurrentPageInput(false);
  }

  const containerRef = useRef(null);
  
  // Auto-detect if we need compact mode based on container width
  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // Use compact mode if container is less than 280px wide
        setUseCompactMode(compact || width < 280);
      }
    };
    
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [compact]);

  return (
    <PagingContainer className='neko-paging' ref={containerRef}>

      {!!total && <span className="neko-paging-text">{total} result{total !== 1 ? 's' : ''}</span>}

      {/* Arrows around "1/1" do nothing, so a single page only shows the results count. */}
      {(infinite || maxInfinite || maxPage > 1) && <div className="neko-paging-controller" onClick={onControllerClick}>
        {(!infinite && !maxInfinite) && <ChevronsLeft
          className={prevIconClassName}
          onClick={() => onClickHandle(1)}
          size={ICON_SIZES.chevron}
        />}
        <ChevronLeft
          className={prevIconClassName}
          onClick={() => onClickHandle(currentPage - 1)}
          size={ICON_SIZES.chevron}
        />
        <p className="nako-paging-controller-text" onClick={onControllerClick}>
          {!!controllerText
            ? controllerText
            : useCompactMode 
              ? <>{currentPageJsx}/{maxPage}</>
              : <>Page {currentPageJsx} of {maxPage}</>
          }
        </p>
        <ChevronRight
          className={nextIconClassName}
          onClick={() => onClickHandle(currentPage + 1)}
          size={ICON_SIZES.chevron}
        />
        {(!infinite && !maxInfinite) && <ChevronsRight
          className={nextIconClassName}
          onClick={() => onClickHandle(maxPage)}
          size={ICON_SIZES.chevron}
        />}
      </div>}

    </PagingContainer>
  );
};

const NekoPaging = (props) => {
  return (<StyledNekoPaging {...props} />);
};

NekoPaging.propTypes = {
  currentPage: PropTypes.number,
  limit: PropTypes.number,
  total: PropTypes.number,
  onClick: PropTypes.func,
  lastPage: PropTypes.number,
  infinite: PropTypes.bool,
  maxInfinite: PropTypes.bool,
  controllerText: PropTypes.object
};

export { NekoPaging };
