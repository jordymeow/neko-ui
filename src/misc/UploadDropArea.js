import React, { useState, forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoBusyOverlay, postFetch } from '../../index';
import { useClasses } from '../hooks';

const StyledUploadDropArea = Styled.div`
  &.dropping {
    background: #a4d5ff;
  }
`;

const NekoUploadDropArea = forwardRef((props, ref) => {

  const { onSuccess = () => {}, onFailure = () => {}, apiUrl, onSelectFiles = () => {},
    apiConfig, className, disabled = false, children, multiple, accept = "image/*", ...rest } = props;
  const [ inDropZone, setInDropZone ] = useState(false);
  const [ busy, setBusy ] = useState(false);
  const hasApi = apiUrl;

  const uploadFile = useCallback(async (files) => {
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
  }, [apiUrl, multiple, apiConfig, onSuccess, onFailure]);

  const uploadFiles = useCallback((files, e) => {
    e.preventDefault();
    e.stopPropagation();
    setInDropZone(false);
    if (hasApi) {
      uploadFile(files);
    }
    else {
      onSelectFiles(files);
    }
  }, [hasApi, uploadFile]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setInDropZone(true);
  }, [disabled]);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setInDropZone(false);
  }, [disabled]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    const files = [...e.dataTransfer.files];
    e.target.value = null;
    uploadFiles(files, e);
  }, [disabled, uploadFiles]);

  const onInputUpload = useCallback((e) => {
    const files = [...e.target.files];
    e.target.value = null;
    uploadFiles(files, e);
  }, [uploadFiles]);

  const classNames = useClasses('neko-upload-drop-area', className, { 'dropping': inDropZone });

  return (
    <NekoBusyOverlay busy={busy}>
      <input type="file" accept={'.csv, .json, .jsonl, .txt'} ref={ref} onChange={onInputUpload}
        style={{ display: 'none' }} multiple={multiple} disabled={disabled} />
      <StyledUploadDropArea className={classNames}
        onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop} {...rest}>
        {children}
      </StyledUploadDropArea>
    </NekoBusyOverlay>
  );
});

NekoUploadDropArea.propTypes = {
  ref: PropTypes.ref,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  onSelectFiles: PropTypes.func,
  apiUrl: PropTypes.string,
  apiConfig: PropTypes.object,
  disabled: PropTypes.bool
};

export { NekoUploadDropArea };
