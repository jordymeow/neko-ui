import React, { useMemo, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";
import { NekoModal } from "./Modal";
import { NekoTypo } from "./../misc/Typography";
import { NekoInput } from "./../form/Input";
import { NekoButton } from "../button/Button";
import { NekoPaging } from "../misc/Paging";
import NekoBusyOverlay from "../common/NekoBusyOverlay";
import { NekoIcon } from "../misc/Icon";
import { NekoTable } from "../table/Table";
import { useClasses, useDeprecatedIsBusy } from '../hooks';

const StyledNekoModal = Styled(NekoModal)`
  width: 800px;

  &.custom-modal {
    padding: 0;
  }

  .neko-post-selector-modal-wrapper {
    padding: 15px;
  }

  .neko-post-selector-modal-content-header {
    align-items: center;
    display: flex;
    justify-content: space-between;

    h1 {
      font-size: 21px;
      font-weight: bold;
      margin: 0;
    }

    input {
      background-color: var(--neko-white);
      border: 1px solid var(--neko-black);
      border-radius: 3px;
    }
  }

  .neko-post-selector-modal-content-body {
    margin-top: 33px;
    margin-bottom: 36px;

    .neko-post-selector-modal-content-body-list {
      max-height: 406px;
      overflow-y: scroll;
      margin-bottom: 10px;
      width: 100%;
    }

    .neko-post-selector-modal-content-body-selected {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
      padding: 8px;
      background-color: var(--neko-gray-10);
      border-radius: 4px;

      .neko-post-selector-modal-content-selected-item {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        background-color: var(--neko-white);
        border: 1px solid var(--neko-gray-30);
        border-radius: 4px;
        font-size: 14px;

        .remove-button {
          background: none;
          border: none;
          margin-left: 8px;
          cursor: pointer;
          padding: 0;
          color: var(--neko-gray-60);
          
          &:hover {
            color: var(--neko-gray-80);
          }
        }
      }
    }
  }

  .neko-post-selector-modal-content-footer {
    display: flex;
    justify-content: space-between;
  }

  .neko-post-selector-modal-search {
    position: relative;
  }
`;

const columns = [
  { accessor: 'title', title: 'Title' },
  { accessor: 'date', title: 'Date', width: '120px' },
  { accessor: 'author', title: 'Author', width: '150px' },
  { accessor: 'status', title: 'Status', width: '100px' },
];

const StyledNekoPostSelectorModal = (props) => {
  const { 
    posts, 
    onNextPage, 
    onPreviousPage, 
    onRefresh, 
    onSearch, 
    searchValue, 
    busy,
    isBusy,
    currentPage, 
    limit, 
    total, 
    onPageChange, 
    selected, 
    onSelect,
    onClose, 
    onCancel, 
    onSave, 
    className,
    maxSelect = 1,
    ...rest 
  } = props;
  
  // Handle both busy and isBusy props - prefer busy over isBusy
  const busyState = busy || isBusy;
  
  useDeprecatedIsBusy(isBusy, 'NekoPostSelectorModal');

  const [search, setSearch] = useState(searchValue);
  const classNames = useClasses('neko-post-selector-modal', className);

  const onReset = useCallback(() => {
    setSearch("");
    onRefresh();
  }, [onRefresh]);

  const postRows = useMemo(() => {
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      date: new Date(post.date).toLocaleDateString(),
      author: post.author,
      status: post.status
    }));
  }, [posts]);

  const selectedPosts = useMemo(() => {
    return Array.isArray(selected) ? selected : (selected ? [selected] : []);
  }, [selected]);

  const postListJsx = useMemo(() => {
    
    const onSelectHandler = (ids) => {
      const selectedPosts = posts.filter(v => ids.includes(v.id));
      if (maxSelect === 1) {
        onSelect(selectedPosts[0]);
      } else {
        onSelect(selectedPosts);
      }
    };

    return (
      <NekoTable
        data={postRows}
        columns={columns}
        onSelect={onSelectHandler}
        onUnselect={onSelectHandler}
        selectedItems={selectedPosts.map(post => post.id)}
        selectOnRowClick={true}
      />
    );
  }, [posts, postRows, selectedPosts, onSelect, maxSelect]);

  const selectedPostsJsx = useMemo(() => {
    if (maxSelect === 1 || !selectedPosts.length) return null;

    return (
      <div className="neko-post-selector-modal-content-body-selected">
        {selectedPosts.map(post => (
          <div key={post.id} className="neko-post-selector-modal-content-selected-item">
            {post.title}
            <button 
              className="remove-button"
              onClick={() => {
                const newSelected = selectedPosts.filter(p => p.id !== post.id);
                onSelect(newSelected);
              }}
            >
              <NekoIcon icon="close" width={16} height={16} />
            </button>
          </div>
        ))}
      </div>
    );
  }, [selectedPosts, maxSelect, onSelect]);

  return (
    <StyledNekoModal className={classNames} {...rest}>
      <div className="neko-post-selector-modal-wrapper">
        <div className="neko-post-selector-modal-content">
          <div className="neko-post-selector-modal-content-header">
            <NekoTypo h1>Select Post{maxSelect > 1 ? 's' : ''}</NekoTypo>
            <div style={{ display: 'flex' }}>
              <div className="neko-post-selector-modal-search">
                <NekoInput 
                  value={search} 
                  disabled={busyState} 
                  onEnter={onSearch} 
                  onChange={(v) => setSearch(v)} 
                  placeholder="Search posts..." 
                />
                {search !== "" && (
                  <NekoIcon 
                    icon="close" 
                    containerStyle={{ 
                      width: '20px', 
                      position: 'absolute', 
                      right: '5px', 
                      top: '5px', 
                      cursor: 'pointer' 
                    }} 
                    width={20} 
                    height={20}
                    style={{ color: 'var(--neko-gray-60)' }} 
                    hoverColor='var(--neko-lighten-dark-gray)' 
                    onClick={onReset} 
                  />
                )}
              </div>
              <NekoButton onClick={() => onSearch(search)} style={{ marginLeft: '4px' }}>
                Search
              </NekoButton>
            </div>
          </div>
          <div>
            <div className="neko-post-selector-modal-content-body">
              <NekoBusyOverlay busy={busyState}>
                <div className="neko-post-selector-modal-content-body-list">
                  {postListJsx}
                </div>
                {selectedPostsJsx}
              </NekoBusyOverlay>
            </div>
          </div>
          <div className="neko-post-selector-modal-content-footer">
            <NekoPaging 
              limit={limit} 
              currentPage={currentPage} 
              total={total} 
              onClick={onPageChange} 
            />
            <div style={{ display: 'flex' }}>
              {!!onClose && (
                <NekoButton onClick={() => onClose()}>
                  Close
                </NekoButton>
              )}
              {!!onCancel && (
                <NekoButton className="danger" onClick={() => onCancel()}>
                  Cancel
                </NekoButton>
              )}
              {!!onSave && (
                <NekoButton onClick={() => onSave()}>
                  Save
                </NekoButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </StyledNekoModal>
  );
};

const NekoPostSelectorModal = (props) => {
  return <StyledNekoPostSelectorModal {...props} />;
};

NekoPostSelectorModal.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  })),
  onNextPage: PropTypes.func,
  onPreviousPage: PropTypes.func,
  onRefresh: PropTypes.func,
  onSearch: PropTypes.func,
  searchValue: PropTypes.string,
  busy: PropTypes.bool,
  isBusy: PropTypes.bool,
  currentPage: PropTypes.number,
  limit: PropTypes.number,
  total: PropTypes.number,
  onPageChange: PropTypes.func,
  selected: PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }),
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }))
  ]),
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  maxSelect: PropTypes.number,
};

export { NekoPostSelectorModal }; 