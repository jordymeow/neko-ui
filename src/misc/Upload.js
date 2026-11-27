import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoIcon, postFetch } from '../../index';
import { useClasses } from '../hooks';

const StyledUpload = Styled.div`
  box-sizing: border-box;
  background: #C4C4C4;
  color: rgb(0 0 0 / 60%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: all 0.25s ease;
  border-radius: 8px;

  &[data-is-disabled=true] {
    svg {
      opacity: 0.7;
    }
  }

  div {
    transition: all 0.5s ease;
    transform: scale(1.5);
    pointer-events: none;
    max-width: 100%;
  }

  &:hover {
    cursor: pointer;
  }

  &.dropping {
    background: #a4d5ff;

    div {
      transform: scale(2);
    }
  }
`;

const NekoUpload = (props) => {

  const {
    width = '100%',
    height = '100%',
    onSuccess = () => {},
    onFailure = () => {},
    style = {},
    accept = 'image/*',
    multiple,
    iconSize = 48,
    iconColor = '#A9A9A9',
    className,
    apiUrl,
    apiConfig,
    onClick,
    disabled,
    ...rest
  } = props;

  const [ inDropZone, setInDropZone ] = useState(false);
  const [ inputId, setInputId ] = useState(Math.floor(Math.random() * 100000000));
  const inputEl = useRef(null);
  const divEl = useRef(null);
  const [ busy, setBusy ] = useState(false);

  useEffect(() => {
    if (!divEl) return;

    divEl.current.style.pointerEvents = busy ? 'none' : 'auto';
  }, [divEl, busy])

  const uploadFile = async (files) => {
    setBusy(true);
    const upload = async (file) => {
      const config = { ...apiConfig, file };
      return await postFetch(apiUrl, config);
    }
    const response = await Promise.all(files.map(async (file) => {
      return await upload(file);
    }))
    const successResponses = response.filter(v => v.success);
    const failerResponses = response.filter(v => !v.success);
    if (successResponses.length) {
      onSuccess(multiple ? successResponses : successResponses[0]);
    }
    if (failerResponses.length) {
      onFailure(multiple ? failerResponses : failerResponses[0]);
    }
    setBusy(false);
  }

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setInDropZone(true);
  }

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInDropZone(false);
  }

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    const files = [...e.dataTransfer.files];
    uploadFiles(files, e);
  }

  const onUploaderClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    inputEl.current.click();
  }

  const onInputUpload = (e) => {
    const files = [...e.target.files];
    uploadFiles(files, e);
  }

  const uploadFiles = (files, e) => {
    e.preventDefault();
    e.stopPropagation();
    setInDropZone(false);
    console.log(files);
    uploadFile(files);
  }

  const fileAccept = Array.isArray(accept) ? accept.join(',') : accept;
  const classNames = useClasses('neko-upload', className, { 'dropping': inDropZone });

  return (
    <div ref={divEl}>
      <input type="file" id={inputId} accept={fileAccept} ref={inputEl} onChange={onInputUpload} style={{ display: 'none' }} disabled={disabled} multiple={multiple} />
      <StyledUpload onClick={onUploaderClick} style={{ ...style, width, height }} className={classNames} 
        onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop} data-is-disabled={disabled} {...rest}>
        <NekoIcon width={iconSize} height={iconSize} icon='upload' spinning={busy} color={iconColor}
          onDragOver={onDragOver} onDragEnter={onDragEnter} />
      </StyledUpload>
    </div>
  );
}

NekoUpload.propTypes = {
  width : PropTypes.string,
  height : PropTypes.string,
  onSuccess : PropTypes.func,
  onFailure : PropTypes.func,
  style : PropTypes.object,
  apiUrl : PropTypes.string,
  apiConfig : PropTypes.object,
  accept: PropTypes.oneOf([PropTypes.string, PropTypes.array]),
};

export { NekoUpload };
