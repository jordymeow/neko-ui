// Previous: none
// Current: 0.0.0

import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Styled, { createGlobalStyle } from 'styled-components';
import { NekoButton } from '../button/Button';
import { useClasses } from '../hooks';

const GlobalModalStyles = createGlobalStyle`
  .ReactModal__Overlay {
    z-index: 9999;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.35) !important;
    opacity: 0;
    transition: opacity 200ms ease-in-out;
  }
  .ReactModal__Overlay--after-open {
    opacity: 1;
  }
  .ReactModal__Overlay--before-close {
    opacity: 0;
  }
  .ReactModal__Overlay .neko-modal {
    opacity: 0;
    transform: scale(0.85);
    transition: all 200ms ease-in-out;
  }
  .ReactModal__Overlay--after-open .neko-modal {
    transform: scale(1);
    opacity: 1;
  }
  .ReactModal__Overlay--before-close .neko-modal {
    transform: scale(0.85);
    opacity: 0;
  }
  .neko-modal {
    background: white;
    color: var(--neko-font-color);
    position: relative;
    box-shadow: 0 1px 2px rgba(0,0,0,0.07), 
                0 2px 4px rgba(0,0,0,0.07), 
                0 4px 8px rgba(0,0,0,0.07), 
                0 8px 16px rgba(0,0,0,0.07),
                0 16px 32px rgba(0,0,0,0.07), 
                0 32px 64px rgba(0,0,0,0.07);
    outline: none;
    padding: 15px;
    max-width: 1200px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
  }
  .neko-modal.full-size {
    margin-top: 32px;
    width: 90vw;
    height: 85vh;
    max-width: none;
    max-height: none;
  }
`;

const NekoModalContent = Styled.div`
  width: ${props => props.fullSize ? '100%' : (props.width ?? '518px')};
  flex: 1;
  display: flex;
  flex-direction: column;

  p {
    margin: 0;
  }
  .title {
    font-family: var(--neko-font-family);
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    margin-bottom: 15px;
  }
  .content-container {
    display: flex;
    position: relative;
    z-index: 1;
    flex: 1;
    overflow-y: clip;

    .thumbnail {
      margin-right: 15px;
      width: 240px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .content {
      flex: auto;
      font-family: var(--neko-font-family);
      font-style: normal;
      font-weight: normal;
      font-size: var(--neko-font-size);
      line-height: 14px;
      width: 100%;
      margin: 0px !important;
      padding: 0px !important;
    }
  }
  .button-group {
    align-items: center;
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    font-size: inherit;
    white-space: normal;
  }
`;

const deprecatedButtonProps = [
  'disabled',
  'ok',
  'okOnClick',
  'okDisabled',
  'cancel',
  'cancelOnClick',
  'cancelDisabled',
];

const StyledNekoModal = (props) => {
  const {
    className,
    style,
    title = '',
    content = '',
    contentWidth,
    customButtons = null,
    okOnEnter = false,
    thumbnail,
    okButton = {},
    cancelButton = {},
    isOpen,
    children,
    customButtonsPosition = 'right',
    fullSize = false,
    ...rest
  } = props;
  
  const showCustomButtons = customButtons !== null;
  const classNames = useClasses('neko-modal', className, { 'custom-modal': style, 'full-size': fullSize});
  const { label: okLabel = 'OK', ...okButtonProps } = okButton;
  const { label: cancelLabel = 'Cancel', ...cancelButtonProps } = cancelButton;

  useEffect(() => {
    const deprecatedProps = [];
    deprecatedButtonProps.forEach((prop) => {
      if (props[prop] !== undefined) {
        deprecatedProps.push(prop);
      }
    });
    if (deprecatedProps.length > 0) {
      console.warn(`[Deprecated] NekoUI: The button attributes, ${deprecatedProps.join(', ')}, are deprecated in the NekoModal. Please use an object attribute like this: okButton={{ label: “OK", onClick, disabled }} cancelButton={{ label: “OK", onClick, disabled }}'`, { props });
    }
  }, [props]);

  const modalParentRef = useRef(null);
  const getModalParent = useCallback(() => {
    return modalParentRef.current;
  }, []);

  const keyUpHandler = useCallback(({ key }) => {
    if (key === 'Enter') {
      okButtonProps.onClick();
    }
  }, [okButtonProps.onClick]);
  
  useEffect(() => {
    if (!okOnEnter || !isOpen) return;
    window.addEventListener("keyup", keyUpHandler);
    return () => {
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [okOnEnter, isOpen, keyUpHandler]);

  const modalContent = children ? children : (
    <NekoModalContent width={contentWidth} fullSize={fullSize}>
      {title && <p className="title">{title}</p>}
      <div className="content-container">
        {thumbnail && <div className="thumbnail">{thumbnail}</div>}
        {content && <p className="content">{content}</p>}
      </div>
      <div className={`button-group ${className}`}>
        {showCustomButtons && customButtonsPosition === 'left' && customButtons}
        {cancelButtonProps.onClick && <NekoButton className="danger" {...cancelButtonProps}>{cancelLabel}</NekoButton>}
        {okButtonProps.onClick && <NekoButton {...okButtonProps}>{okLabel}</NekoButton>}
        {showCustomButtons && customButtonsPosition === 'right' && customButtons}
      </div>
    </NekoModalContent>
  );

  return (
    <>
      <GlobalModalStyles />
      <Modal 
        ariaHideApp={false}
        closeTimeoutMS={200}
        className={classNames}
        isOpen={isOpen}
        {...rest}
      >
        {modalContent}
      </Modal>
    </>
  );
};

const NekoModal = (props) => {
  return <StyledNekoModal {...props} />;
};

NekoModal.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  content: PropTypes.string,
  contentWidth: PropTypes.string,
  customButtons: PropTypes.object,
  okOnEnter: PropTypes.bool,
  thumbnail: PropTypes.element,
  okButton: PropTypes.object,
  cancelButton: PropTypes.object,
  fullSize: PropTypes.bool,
};