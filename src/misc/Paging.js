// Previous: none
// Current: 0.0.0

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { Icon } from '@iconify/react';
import chevronDoubleLeft from '@iconify/icons-mdi/chevron-double-left';
import chevronLeft from '@iconify/icons-mdi/chevron-left';
import chevronDoubleRight from '@iconify/icons-mdi/chevron-double-right';
import chevronRight from '@iconify/icons-mdi/chevron-right';

const PagingContainer = Styled.div`
  align-items: center;
  display: flex;
  user-select: none;

  .neko-paging-text {
    font-family: var(--neko-font-family);
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 14px;
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
      border-radius: 100%;
      cursor: pointer;
      margin-right: 2px;
      height: 22px;
      width: 22px;
      transition: transform 0.1s ease-in;
      box-sizing: border-box;

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
      margin: 0 40px;
      user-select: none;
    }

    span.neko-paging-current-page {
      cursor: pointer;
      text-decoration: underline;
    }

    input.neko-paging-current-page {
      width: 1.5rem;
    }
  }
`;

const StyledNekoPaging = props => {
  const { currentPage, limit = 0, onClick, total = 0, onCurrentPageChanged, infinite = false, maxInfinite = false, controllerText } = props;
  const isEditable = !!onCurrentPageChanged;
  const maxPage = useMemo(() => {
    if (infinite || maxInfinite) return 0;
    return Math.ceil(total === 0 ? 1 : (limit > 0 ? (total / limit) : 1));
  }, [infinite, maxInfinite, limit, total]);
  const prevIconClassName = `nako-paging-controller-icon ${!infinite && currentPage === 1 ? 'disabled' : ''}`;
  const nextIconClassName = `nako-paging-controller-icon ${(!infinite && !maxInfinite) && currentPage === maxPage ? 'disabled' : ''}`;
  const [ showCurrentPageInput, setShowCurrentPageInput ] = useState(false);

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

  const onBlur = (e) => {
    const page = e.target.value;

    if (!isNaN(page)) {
      onCurrentPageChanged(getValidPage(page));
    }
    setShowCurrentPageInput(false);
  }

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const page = e.target.value;
      if (!isNaN(page)) {
        onCurrentPageChanged(getValidPage(page));
      }
      setShowCurrentPageInput(false);
    }
  };

  const currentPageJsx = useMemo(() => {
    if (!showCurrentPageInput) {
      const onClick = () => {
        if (!isEditable) {
          return;
        }
        setShowCurrentPageInput(true);
      }
      return <span className={isEditable ? 'neko-paging-current-page' : ''} onClick={onClick}>{currentPage}</span>;
    }
    return <input autoFocus type="text" className={isEditable ? 'neko-paging-current-page' : ''} 
      defaultValue={currentPage} onBlur={onBlur} onKeyDown={onKeyPress} />;
  }, [currentPage, showCurrentPageInput, onCurrentPageChanged]);

  const onControllerClick = (e) => {
    if (!showCurrentPageInput || e.target !== e.currentTarget) return;

    setShowCurrentPageInput(false);
  }

  return (
    <PagingContainer className='nako-paging'>

      {!!total && <span className="neko-paging-text">{total} result{total !== 1 ? 's' : ''}</span>}

      <div className="neko-paging-controller" onClick={onControllerClick}>
        {(!infinite && !maxInfinite) && <Icon icon={chevronDoubleLeft}
          className={prevIconClassName}
          onClick={() => onClickHandle(1)}
        />}
        <Icon icon={chevronLeft}
          className={prevIconClassName}
          onClick={() => onClickHandle(currentPage - 1)}
        />
        <p className="nako-paging-controller-text" onClick={onControllerClick}>
          {!!controllerText
            ? controllerText
            : <>Page {currentPageJsx} of {maxPage}</>
          }
        </p>
        <Icon icon={chevronRight}
          className={nextIconClassName}
          onClick={() => onClickHandle(currentPage + 1)}
        />
        {(!infinite && !maxInfinite) && <Icon icon={chevronDoubleRight}
          className={nextIconClassName}
          onClick={() => onClickHandle(maxPage)}
        />}
      </div>

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