// Previous: none
// Current: 0.0.0

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
import { NekoUploadDropArea } from "../misc/UploadDropArea";
import { NekoTable } from "../table/Table";
import { NekoCheckboxGroup } from "../form/CheckboxGroup";
import { NekoCheckbox } from "../form/Checkbox";
import { useClasses } from '../hooks';

const StyledNekoModal = Styled(NekoModal)`
  width: 633px;

  &.custom-modal {
    padding: 0;
  }

  .neko-media-library-modal-wrapper {
    padding: 15px;
  }

  .neko-media-library-modal-content-header {
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
  .neko-media-library-modal-content-body {
    margin-top: 33px;
    margin-bottom: 36px;

    video {
      object-fit: cover;
      height: 100%;
    }

    .neko-media-library-modal-content-body-list {
      max-height: 406px;
      overflow-y: scroll;
      margin-bottom: 10px;
      width: 100%;
    }
    .neko-media-library-modal-content-body-gallery {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(6, 1fr);
      margin-bottom: 10px;

      .neko-media-library-modal-content-media-container {
        cursor: pointer;
        position: relative;

        img, video {
          box-sizing: border-box;
        }

        &.disabled {
          img, video {
            opacity: 0.3;
            cursor: auto;
          }
        }

        &.selected {
          img, video {
            cursor: pointer;
            border: 5px solid var(--neko-main-color);
          }
        }

        &:hover {
          .zoom-button {
              display: block;
          }
        }

        .zoom-button {
          background-color: rgba(0, 0, 0, 0.4);
          border: 0;
          border-radius: 30px;
          cursor: pointer;
          display: none;
          position: absolute;
          top: 2px;
          left: 2px;
          width: 30px;
          height: 30px;
        }
      }
    }

    .neko-media-library-modal-content-body-checkboxes {
      display: flex;
      margin-bottom: 8px;
    }

    .neko-media-library-modal-content-body-selected-gallery {
      display: flex;

      .neko-media-library-modal-content-selected-media-container {
        overflow: hidden;
        position: relative;
        height: 50px;
        width: 50px;
        padding-right: 5px;

        &.dummy {
          width: 50px;

          &.drag-over {
            width: 50px;
          }
        }

        &.drag-over {
          width: 105px;

          .zoom-button {
            left: 56px;
          }
        }

        &.drag-over::before {
          content: '';
          display: inline-block;
          width: 50px;
          height: 50px;
          background-color: var(--neko-main-color);
        }

        img, video {
          box-sizing: border-box;
          width: 100%;
          max-width: 50px;
        }

        &.drag-over {
          img, video {
            margin-left: 5px;
          }
        }

        &:hover {
          .remove-button,
          .zoom-button {
              display: block;
          }
        }

        .remove-button {
          background-color: rgba(0, 0, 0, 0.4);
          border: 0;
          border-radius: 20px;
          cursor: pointer;
          display: none;
          position: absolute;
          top: 1px;
          right: 1px;
          width: 20px;
          height: 20px;
        }

        .zoom-button {
          background-color: rgba(0, 0, 0, 0.4);
          border: 0;
          border-radius: 20px;
          cursor: pointer;
          display: none;
          position: absolute;
          top: 1px;
          left: 1px;
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .neko-media-library-modal-content-footer {
    display: flex;
    justify-content: space-between;
  }
  .neko-media-library-modal-search {
    position: relative;
  }
`;

const selectedImageBaseWidth = 55;
const nextItemRange = 25;
const selectedImageIdPrefix = 'nmlm-selected-';
const dragOverClassName = 'drag-over';
const removeClass = (className) => {
  Array.prototype.forEach.call(document.getElementsByClassName(className), (ele) => {
    ele.classList.remove(className);
  });
}
const displayModes = {
  grid: 'grid',
  list: 'list'
};
const columns = [
  { accessor: 'thumbnail_url', title: 'Thumb', style: { width: '42px' } },
  { accessor: 'title', title: 'Title' },
  { accessor: 'size', title: 'Size', style: { width: '70px' } },
  { accessor: 'filename', title: 'Filename' },
];

const StyledNekoMediaLibraryModal = (props) => {
  const { images, onNextPage, onPreviousPage, onRefresh, onClick, onRemoveClick, onZoomClick, onSearch, onUnusedImagesChanged, unusedImagesValue, searchValue, busy,
    currentPage, limit, total, onPageChange, selected, multiSelect = false, showUploader = false, uploader, onSelectedOrderChanged, accept = [], className,
    onUploadSuccess = () => {}, onUploadFailure = () => {}, uploadApiUrl, uploadApiConfig, uploadMultiple, onClose, onCancel, onSave, ...rest } = props;
  const [ search, setSerch ] = useState(searchValue);
  const [ dragImageIndex, setDragImageIndex ] = useState(null);
  const [ displayMode, setDisplayMode ] = useState(displayModes.grid);
  const ref = useRef(null);
  const acceptMimes = Array.isArray(accept) ? accept : accept.split(',');
  const classNames = useClasses('neko-media-library-modal', className);

  const onDragOver = (e, i) => {
    e?.preventDefault();
    if( !e || !e.currentTarget || !e.currentTarget.getBoundingClientRect ) {
      console.error('❌ Invalid event or target');
      return;
    }
    if (dragImageIndex === null) return;
    const { width, left, right } = e.currentTarget.getBoundingClientRect();
    let target = i;
    if (dragImageIndex < i) {
      if (i > 0 && i < selected.length) {
        if (target + 1 === dragImageIndex && e.clientX >= right - nextItemRange) {
          target -= 1
        } else if (target - 1 === dragImageIndex && e.clientX >= left - nextItemRange) {
          target += 1;
        } else if (width !== selectedImageBaseWidth && e.clientX >= right - nextItemRange) {
          target += 1;
        }
      } else if (width !== selectedImageBaseWidth && e.clientX >= right - nextItemRange) {
        target += 1;
      }
    }
    removeClass(dragOverClassName);
    if (dragImageIndex === target || (dragImageIndex + 1) === target) return;
    document.getElementById(`${selectedImageIdPrefix}${target}`).classList.add(dragOverClassName);
  };

  const onDragEnd = (e) => {
    e?.preventDefault();
    setDragImageIndex(null);
    removeClass(dragOverClassName);
  };

  const onDrop = (e, i) => {
    e?.preventDefault();
    if (dragImageIndex === null || dragImageIndex === i || (dragImageIndex + 1) === i) return;
    onSelectedOrderChanged({ currentIndex: dragImageIndex, afterIndex: dragImageIndex > i ? i : i - 1});
  };

  const selectedMediaJsx = () => {
    if ( !multiSelect ) return [];
    const dummyElementForDrop = <div id={`nmlm-selected-${selected.length}`} className="neko-media-library-modal-content-selected-media-container dummy" draggable={false} onDragEnd={(e) => onDragEnd(e)} onDragOver={(e) => onDragOver(e, selected.length)} onDrop={(e) => onDrop(e, selected.length)} onDragLeave={() => removeClass(dragOverClassName)}></div>
    const selectedElement = selected.map( (image, i) => {
      return (
        <div id={`nmlm-selected-${i}`} key={image.id} className="neko-media-library-modal-content-selected-media-container" draggable={true}
          onDragStart={() => setDragImageIndex(i)}
          onDragEnd={onDragEnd}
          onDragOver={(e) => onDragOver(e, i)}
          onDrop={(e) => onDrop(e, i)}>
          { (image.mime === undefined || image.mime?.includes('image')) && <img src={image.src} className="neko-media-library-modal-content-media" /> }
          { image.mime?.includes('video') && <video autoplay loop muted playsInline src={image.src} className="neko-media-library-modal-content-media" /> }
          <button className="remove-button" onClick={() => onRemoveClick({ id: image.id, src: image.src })}>
            <NekoIcon icon="close" variant="white" width={19} height={19} />
          </button>
          <button className="zoom-button" onClick={() => onZoomClick(image)}>
            <NekoIcon icon="zoom-in" variant="white" width={19} height={19} />
          </button>
        </div>
      );
    } );
    return [...selectedElement, dummyElementForDrop];
  };

  const mediaGridJsx = useMemo(() => {
    return images.map((image) => {
      const isSelected = selected.some(v => v.id === image.id);
      const isDisabled = acceptMimes.length && !acceptMimes.includes(image.mime);
      const additionalClassNames = [
        isSelected ? 'selected' : null,
        isDisabled ? 'disabled' : null,
      ].filter(v => v !== null);
      return (
        <div key={image.id} className={`neko-media-library-modal-content-media-container ${additionalClassNames.join(' ')}`}
          onClick={() => {
            if (!isSelected && isDisabled) {
              return;
            }
            onClick({ id: image.id, src: image.src, zoom_src: image.zoom_src, mime: image.mime });
        }}>
          { (image.mime === undefined || image.mime?.includes('image')) && <img src={image.src} className="neko-media-library-modal-content-media" width="90" height="90" /> }
          { image.mime?.includes('video') && <video autoplay loop muted playsInline  src={image.src} className="neko-media-library-modal-content-media" width="90" height="90" /> }
          <button className="zoom-button" onClick={(e) => { e.stopPropagation(); onZoomClick(image); }}>
            <NekoIcon icon="zoom-in" variant='white' width={29} height={29} />
          </button>
        </div>
      );
    });
  }, [images, selected, onZoomClick, onClick, acceptMimes]);

  const mediaRows = useMemo(() => {

    const thumbnail_url = (x) => {
      if (x.mime === undefined || x.mime?.includes('image')) {
        return <img src={x.src} style={{ width: 40, height: 40, objectFit: 'cover' }} />;
      }
      if (x.mime?.includes('video')) {
        return <video autoplay loop muted playsInline src={x.src} style={{ width: 40, height: 40, objectFit: 'cover' }} />;
      }
      return null;
    }
    return images.map(x => ({
      id: x.id,
      thumbnail_url:thumbnail_url(x),
      title: x.title,
      size: x.size,
      filename: x.filename
    }));
  }, [images]);

  const onReset = useCallback(() => {
    setSerch("");
    onRefresh();
  }, [onRefresh]);

  const mediaListJsx = useMemo(() => {
    const onSelect = (ids, e) => {
      const image = images.find(v => v.id === ids[0]);
      onClick({ id: image.id, src: image.src, zoom_src: image.zoom_src, mime: image.mime });
    }
    return <NekoTable
      data={mediaRows}
      columns={columns}
      onSelect={onSelect}
      onUnselect={onSelect}
      selectedItems={selected.map(v => v.id)}
    />
  }, [images, mediaRows, selected, onClick]);

  return (
    <StyledNekoModal className={classNames} {...rest}>
      <div className="neko-media-library-modal-wrapper" draggable={true} onDragOver={() => removeClass(dragOverClassName)}>
        <NekoUploadDropArea ref={ref} onSuccess={onUploadSuccess} onFailure={onUploadFailure} apiUrl={uploadApiUrl} apiConfig={uploadApiConfig} disabled={!showUploader || dragImageIndex !== null} multiple={uploadMultiple}>
          <div className="neko-media-library-modal-content">
            <div className="neko-media-library-modal-content-header">
              <NekoTypo h1>Media Library</NekoTypo>
              <div style={{ display: 'flex' }}>
                <div className="neko-media-library-modal-search">
                  <NekoInput value={search} disabled={busy} onEnter={onSearch} onChange={(v) => setSerch(v)} placeholder="Search..." />
                  {search !== "" && <NekoIcon icon="close" containerStyle={{ width: '20px', position: 'absolute', right: '5px', top: '5px', cursor: 'pointer' }} width={20} height={20}
                    style={{ color: 'var(--neko-gray-60)' }} hoverColor='var(--neko-lighten-dark-gray)' onClick={onReset} />}
                </div>
                <NekoButton onClick={() => onSearch(search)} style={{ marginLeft: '4px', marginRight: '4px' }}>Search</NekoButton>
                <NekoIcon variant={ displayMode === displayModes.grid ? 'black' : 'blue' } icon='view-grid' onClick={() => setDisplayMode(displayModes.grid)} width="20" height="20" />
                <NekoIcon variant={ displayMode === displayModes.list ? 'black' : 'blue' } icon='format-list-bulleted' onClick={() => setDisplayMode(displayModes.list)} width="20" height="20" />
              </div>
            </div>
            <div>
              <div className="neko-media-library-modal-content-body">
                <NekoBusyOverlay busy={busy}>
                  <div className={`${displayMode === displayModes.grid ? 'neko-media-library-modal-content-body-gallery' : 'neko-media-library-modal-content-body-list'}`}>
                    {displayMode === displayModes.grid && showUploader && uploader}
                    {displayMode === displayModes.grid ? mediaGridJsx : mediaListJsx}
                  </div>
                </NekoBusyOverlay>
                <div className="neko-media-library-modal-content-body-checkboxes">
                  <NekoCheckboxGroup>
                    <NekoCheckbox id="unused_images" label="Unused Images" onChange={onUnusedImagesChanged} checked={unusedImagesValue} />
                  </NekoCheckboxGroup>
                </div>
                <div className="neko-media-library-modal-content-body-selected-gallery">
                  {selectedMediaJsx()}
                </div>
              </div>
            </div>
            <div className="neko-media-library-modal-content-footer">
              <NekoPaging limit={limit} currentPage={currentPage} total={total} onClick={onPageChange} />
              <div style={{ display: 'flex' }}>
              {!!onClose && <NekoButton onClick={() => onClose()}>
                Close
              </NekoButton>}
              {!!onCancel && <NekoButton className="danger" onClick={() => onCancel()}>
                Cancel
              </NekoButton>}
              {!!onSave && <NekoButton onClick={() => onSave()}>
                Save
              </NekoButton>}
              </div>
            </div>
          </div>
        </NekoUploadDropArea>
      </div>
    </StyledNekoModal>
  );
};

const NekoMediaLibraryModal = (props) => {
  return <StyledNekoMediaLibraryModal {...props} />;
};

NekoMediaLibraryModal.propTypes = {
  images: PropTypes.array,
  onNextPage: PropTypes.func,
  onPreviousPage: PropTypes.func,
  onRefresh: PropTypes.func,
  onClick: PropTypes.func,
  onSearch: PropTypes.func,
  searchValue: PropTypes.string,
  busy: PropTypes.bool,
  currentPage: PropTypes.number,
  limit: PropTypes.number,
  total: PropTypes.number,
  onPageChange: PropTypes.func,
  multiSelect: PropTypes.bool,
  selected: PropTypes.array,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  accept: PropTypes.oneOf([PropTypes.string, PropTypes.array]),
};

export { NekoMediaLibraryModal };