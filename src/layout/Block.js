import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoTypo } from '../misc/Typography';
import { NekoMwaiSwitch } from '../misc/MwaiSwitch';
import NekoBusyOverlay from '../common/NekoBusyOverlay';
import { useClasses } from '../hooks';

const Block = Styled.div`
  font-size: var(--neko-font-size);
  margin-bottom: 16px;

  .neko-block-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 12px;
  }

  .neko-block-title-section {
    padding: 0 4px 8px 4px;

    &.has-subtitle {
      padding-bottom: 12px;
    }
  }

  .neko-block-titles {
    flex: 1;
    min-width: 0;
  }

  .neko-block-title {
    margin: 0 0 2px 0;
    font-weight: 600;
    letter-spacing: 0;
  }

  .neko-block-subtitle {
    font-size: 12px;
    opacity: 0.65;
    margin-top: 0;
    line-height: 1.45;
  }

  .neko-block-content {
    background: white;
    color: var(--neko-font-color);
    padding: 18px 18px;
    box-shadow: var(--neko-shadow-sm);
    border: 1px solid var(--neko-gray-90);
    border-radius: var(--neko-radius-md);

    p:first-child { margin-top: 0; }
    p:last-child  { margin-bottom: 0; }
    ul { list-style: disc; }
    ol { list-style: decimal; }

    .neko-toolbar {
      border: 1px solid var(--neko-gray-90);
    }
  }

  .neko-block-action { }

  /* .primary is a section on a colored workspace (like TabContent).
     Title + subtitle sit directly on the workspace bg; body is a white card.
     No inner frame, no extra padding — the workspace IS the frame. */
  &.primary {
    background: transparent;
    padding: 0;

    /* Title sits on the colored workspace, above a white card. Spec is driven
       by the --neko-surface-title-* tokens so NekoTabs.inversed shares the
       same look automatically. */
    .neko-block-title-section {
      padding: 2px 4px var(--neko-surface-title-padding-bottom) 4px;
    }

    .neko-block-title {
      color: white;
      font-size: var(--neko-surface-title-font-size);
      font-weight: var(--neko-surface-title-font-weight);
      letter-spacing: var(--neko-surface-title-letter-spacing);
      line-height: var(--neko-surface-title-line-height);
      margin: 0 0 2px 0;
    }

    .neko-block-subtitle {
      color: rgba(255, 255, 255, 0.72);
      font-size: 13px;
      line-height: 1.45;
    }

    .neko-block-content {
      box-shadow: var(--neko-shadow-sm);
    }
  }

  &.primary.accent-green   { --neko-block-accent: var(--neko-green); }
  &.primary.accent-purple  { --neko-block-accent: var(--neko-purple); }
  &.primary.accent-orange  { --neko-block-accent: var(--neko-orange); }
  &.primary.accent-red     { --neko-block-accent: var(--neko-red); }
  &.primary.accent-cyan    { --neko-block-accent: var(--neko-cyan); }

  &.standard {
    .neko-block-content { box-shadow: none; }
  }

  &.raw {
    --neko-block-accent: var(--neko-main-color);
    padding: 10px;
    background-color: var(--neko-block-accent);
    border-radius: var(--neko-radius-md);
    color: white;

    .neko-block-title,
    .neko-block-title-section .neko-block-subtitle {
      color: white;
      opacity: 0.95;
    }
    .neko-block-title-section .neko-block-subtitle { opacity: 0.7; }

    .neko-block-content {
      padding: 0;
      background: none;
      box-shadow: none;
      border: 0;
    }
  }
  &.raw.accent-green   { --neko-block-accent: var(--neko-green); }
  &.raw.accent-purple  { --neko-block-accent: var(--neko-purple); }
`;

/**
 * @param {string} className
 * @param {boolean} mwaiPill - Show AI Engine pill
 * @param {boolean} mwaiEnabled - Whether AI Engine is enabled
 * @param {boolean} mwaiInstalled - Whether AI Engine is installed (shows Off instead of Get when not enabled)
 */
const StyledNekoBlock = props => {

  const {
    title,
    subtitle,
    children,
    className = '',
    color,
    busy = false,
    style = {},
    contentStyle = {},
    action,
    mwaiPillTooltip = '',
    mwaiPill = false,
    mwaiEnabled = false,
    mwaiInstalled,
    maxHeight,
    ...rest
  } = props;
  const classNames = useClasses('neko-block', className, color ? `accent-${color}` : '');

  // AI Engine status at the end of the header: On / Get / Off (see NekoMwaiSwitch).
  const renderMwaiPill = () => {
    if (!mwaiPill) return null;
    return <NekoMwaiSwitch enabled={mwaiEnabled} installed={mwaiInstalled} tooltip={mwaiPillTooltip} />;
  };

  // Combine mwai pill with custom action
  const combinedAction = mwaiPill ? (
    <>
      {renderMwaiPill()}
      {action}
    </>
  ) : action;

  return (
    <Block className={classNames} style={style} {...rest}>
      {title && (
        <div className={`neko-block-title-section ${subtitle ? 'has-subtitle' : ''}`}>
          <div className="neko-block-header">
            <div className="neko-block-titles">
              <NekoTypo h2 className="neko-block-title">{title}</NekoTypo>
              {subtitle && <div className="neko-block-subtitle">{subtitle}</div>}
            </div>
            {!!combinedAction && <div className="neko-block-action">
              {combinedAction}
            </div>}
          </div>
        </div>
      )}
      <NekoBusyOverlay busy={busy}>
        <div className="neko-block-content" style={{
            ...contentStyle,
            ...(maxHeight ? { maxHeight, overflowY: 'auto' } : {})
          }}>
          {children}
        </div>
      </NekoBusyOverlay>
    </Block>
  );
};

const NekoBlock = (props) => {
  return (<StyledNekoBlock {...props} />);
}

NekoBlock.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.oneOf(['', 'primary', 'standard', 'raw']),
  color: PropTypes.oneOf(['green', 'purple', 'orange', 'red', 'cyan']),
  style: PropTypes.object,
  contentStyle: PropTypes.object,
  action: PropTypes.element,
  busy: PropTypes.bool,
  mwaiPill: PropTypes.bool,
  mwaiEnabled: PropTypes.bool,
  mwaiInstalled: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export { NekoBlock };
