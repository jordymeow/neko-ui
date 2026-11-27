import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Styled, { createGlobalStyle } from 'styled-components';
import { NekoButton } from '../button/Button';
import { useClasses } from '../hooks';

const GlobalModalStyles = createGlobalStyle`
  body.ReactModal__Body--open {
    overflow: hidden;
  }
  
  .ReactModal__Overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.35) !important;
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    overflow-y: auto;
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

  /* ──────────────────────────────────────────────────────────── */
  /* Base modal shell                                            */
  /* ──────────────────────────────────────────────────────────── */
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

  /* Screen: for big modals that are a whole screen of settings rather than a message.
     Same look as a tab: the title sits on the brand-blue workspace, the content is a
     white card, the buttons sit on the blue. A plain white sheet that big read as a
     blank page on top of the app. */
  .neko-modal.screen {
    background: var(--neko-main-color);
    border-radius: var(--neko-radius-lg);
    padding: 14px 16px 16px;
  }
  .neko-modal.screen .title {
    color: white;
    font-size: var(--neko-surface-title-font-size);
    font-weight: var(--neko-surface-title-font-weight);
    line-height: var(--neko-surface-title-line-height);
    margin: 0 4px var(--neko-surface-title-padding-bottom);
  }
  .neko-modal.screen .content-container {
    background: white;
    border-radius: var(--neko-radius-md);
    box-shadow: var(--neko-shadow-sm);
    padding: 16px;
  }
  .neko-modal.screen .button-group {
    background: none;
    padding: 0;
    margin: 14px 0 0;
    gap: 6px;
  }

  .neko-modal.large   { max-width: 700px; }
  .neko-modal.larger  { max-width: 900px; }
  .neko-modal.full-size {
    margin-top: 32px;
    padding: 15px 0 0 0;
    width: 90vw;
    height: 85vh;
    max-width: none;
    max-height: 85vh;
    overflow: hidden;
  }
`;

/* ────────────────────────────────────────────────────────────── */
/* Modal inner layout                                            */
/* ────────────────────────────────────────────────────────────── */
const NekoModalContent = Styled.div`
  /* Width adapts to the chosen size or explicit contentWidth */
  width: ${props => {
    if (props.size === 'full-size') return '100%';
    if (props.contentWidth) return props.contentWidth;
    switch (props.size) {
      case 'large':   return '700px';
      case 'larger':  return '900px';
      default:        return '518px';
    }
  }};
  flex: 1;
  display: flex;
  flex-direction: column;
  ${props => props.size === 'full-size' && `
    height: 100%;
    overflow: hidden;
  `}

  p { margin: 0; }

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
    overflow-y: ${props => props.size === 'full-size' ? 'auto' : 'clip'};

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
      margin: 0 !important;
      padding: 0 !important;
      ${props => props.size === 'full-size' && `
        overflow-y: auto;
        padding: 0 15px !important;
      `}
    }
  }

  /* Bottom‑footer buttons – new grey bar for better separation */
  .button-group {
    align-items: center;
    display: flex;
    justify-content: flex-end;
    font-size: inherit;
    white-space: normal;

    background: #f0f0f0;
    padding: 10px;
    margin: 15px -15px -15px -15px;
  }

  /* Header variation inside full‑size mode – no grey footer */
  .full-size-header .button-group {
    background: none;
    padding: 0;
    margin: 0;
  }

  .full-size-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    /* Top padding so primary-button hover-lift (transform: translateY(-1px))
       isn't clipped by the parent's overflow:hidden. */
    padding: 4px 15px 0;

    .title { margin-bottom: 0; align-self: center; }
    .button-group { gap: 5px; }
  }

  /* Footer variation for full-size mode */
  .button-group.full-size-footer {
    margin: 0;
    padding: 10px 15px;
  }
`;

/* ────────────────────────────────────────────────────────────── */
/* Utility                                                       */
/* ────────────────────────────────────────────────────────────── */
const deprecatedButtonProps = [
  'disabled',
  'ok',
  'okOnClick',
  'okDisabled',
  'cancel',
  'cancelOnClick',
  'cancelDisabled',
];

/* ────────────────────────────────────────────────────────────── */
/* Core component                                                */
/* ────────────────────────────────────────────────────────────── */
const StyledNekoModal = (props) => {
  const {
    className,
    style,
    contentStyle,
    title = '',
    content = '',
    contentWidth,
    customButtons = null,
    okOnEnter = false,
    thumbnail,
    okButton = {},
    cancelButton = {},
    action = null,
    isOpen,
    children,
    customButtonsPosition = 'right',
    /**
     * Preferred API – one of: "normal" | "large" | "larger" | "full-size"
     */
    size = 'normal',
    /**
     * Legacy boolean flag – will be mapped to `size="full-size"`.
     * Kept for backward‑compatibility.
     */
    fullSize: legacyFullSize = false,
    /**
     * Frames the modal like a tab (blue surface, white content card). For big modals
     * full of settings; small confirmations should stay plain.
     */
    screen = false,
    ...rest
  } = props;

  /* Resolve final size */
  const resolvedSize = size || (legacyFullSize ? 'full-size' : 'normal');
  const isFullSize   = resolvedSize === 'full-size';

  /* Compose modal class list */
  const classNames = useClasses(
    'neko-modal',
    className,
    {
      'large':      resolvedSize === 'large',
      'larger':     resolvedSize === 'larger',
      'full-size':  isFullSize,
      'screen':     screen && !isFullSize,
      'custom-modal': style,
    }
  );

  const { label: okLabel = 'OK', ...okButtonProps } = okButton;
  const { label: cancelLabel = 'Cancel', ...cancelButtonProps } = cancelButton;

  /* Deprecation warnings for old button props */
  useEffect(() => {
    const deprecated = deprecatedButtonProps.filter(p => props[p] !== undefined);
    if (deprecated.length) {
      console.warn(
        `[Deprecated] NekoUI: Button attributes ${deprecated.join(', ')} are deprecated in NekoModal.\n` +
        `Please use: okButton={{ label, onClick, disabled }} and cancelButton={{ ... }}`,
        { props }
      );
    }
  }, [props]);

  /* "Enter" key triggers OK */
  const keyUpHandler = useCallback(({ key }) => {
    if (key === 'Enter' && okButtonProps.onClick) okButtonProps.onClick();
  }, [okButtonProps]);

  useEffect(() => {
    if (!okOnEnter || !isOpen) return;
    window.addEventListener('keyup', keyUpHandler);
    return () => window.removeEventListener('keyup', keyUpHandler);
  }, [okOnEnter, isOpen, keyUpHandler]);

  /* ------------------------------------------------------------------ */
  /* Render helpers                                                     */
  /* ------------------------------------------------------------------ */
  const renderButtons = () => (
    <>
      {customButtons && customButtonsPosition === 'left' && customButtons}
      {cancelButtonProps.onClick && (
        <NekoButton className="danger" {...cancelButtonProps}>{cancelLabel}</NekoButton>
      )}
      {okButtonProps.onClick && (
        <NekoButton className={screen && !isFullSize ? 'secondary' : undefined} {...okButtonProps}>{okLabel}</NekoButton>
      )}
      {customButtons && customButtonsPosition === 'right' && customButtons}
    </>
  );

  const modalBody = children || (
    <NekoModalContent size={resolvedSize} contentWidth={contentWidth}>
      {/* Full‑size variant has inline header */}
      {isFullSize && title && (
        <div className="full-size-header">
          <p className="title">{title}</p>
          {action && (
            <div className="button-group">
              {action}
            </div>
          )}
        </div>
      )}

      {!isFullSize && title && <p className="title">{title}</p>}

      <div className="content-container">
        {thumbnail && <div className="thumbnail">{thumbnail}</div>}
        {content && <div className="content" style={contentStyle}>{content}</div>}
      </div>

      <div className={`button-group${isFullSize ? ' full-size-footer' : ''}`}>
        {renderButtons()}
      </div>
    </NekoModalContent>
  );

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <GlobalModalStyles />
      <Modal
        ariaHideApp={false}
        closeTimeoutMS={200}
        className={classNames}
        style={style}
        isOpen={isOpen}
        {...rest}
      >
        {modalBody}
      </Modal>
    </>
  );
};

const NekoModal = (props) => <StyledNekoModal {...props} />;

/* ────────────────────────────────────────────────────────────── */
/* Prop‑Types                                                    */
/* ────────────────────────────────────────────────────────────── */
NekoModal.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  contentStyle: PropTypes.object,
  title: PropTypes.string,
  content: PropTypes.string,
  contentWidth: PropTypes.string,
  customButtons: PropTypes.object,
  okOnEnter: PropTypes.bool,
  thumbnail: PropTypes.element,
  okButton: PropTypes.object,
  cancelButton: PropTypes.object,
  action: PropTypes.element,
  /** Preferred sizing API */
  size: PropTypes.oneOf(['normal', 'large', 'larger', 'full-size']),
  /** Legacy ‑ will map to size="full-size" (deprecated) */
  fullSize: PropTypes.bool,
  /** Tab-like frame for big modals (blue surface, white content card) */
  screen: PropTypes.bool,
  /** Modal visibility */
  isOpen: PropTypes.bool.isRequired,
};

export { NekoModal };
