import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoIcon } from './Icon';

/**
 * NekoEmpty — a clean empty-state component for lists, tables, and sections
 * that have no content yet. Icon + title + optional subtitle + optional CTA.
 *
 *   <NekoEmpty
 *     icon="folder"
 *     title="No discussions yet"
 *     subtitle="Run a chatbot conversation to populate this view."
 *     action={<NekoButton onClick={…}>Open the Playground</NekoButton>}
 *   />
 *
 * Fades in gently on mount so it doesn't jump into view. Pass `inline` for a
 * slimmer horizontal variant suitable for empty table rows.
 */

const EmptyContainer = Styled.div`
  display: flex;
  flex-direction: ${props => props.$inline ? 'row' : 'column'};
  align-items: center;
  justify-content: center;
  gap: ${props => props.$inline ? '12px' : '10px'};
  text-align: ${props => props.$inline ? 'left' : 'center'};
  padding: ${props => props.$inline ? '16px 12px' : '32px 24px'};
  color: var(--neko-gray-50);
  animation: neko-empty-fade 0.28s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes neko-empty-fade {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: none; }
  }

  .neko-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${props => props.$inline ? '32px' : '56px'};
    height: ${props => props.$inline ? '32px' : '56px'};
    border-radius: 50%;
    background: color-mix(in oklab, var(--neko-main-color) 8%, transparent);
    color: var(--neko-main-color);
    flex: 0 0 auto;
  }

  .neko-empty-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-width: ${props => props.$inline ? 'none' : '320px'};
  }

  .neko-empty-title {
    font-size: ${props => props.$inline ? '13px' : '14px'};
    font-weight: 600;
    color: var(--neko-gray-30);
    margin: 0;
    line-height: 1.35;
  }

  .neko-empty-subtitle {
    font-size: 12px;
    color: var(--neko-gray-60);
    line-height: 1.45;
    margin: 0;
  }

  .neko-empty-action {
    margin-top: ${props => props.$inline ? '0' : '8px'};
    ${props => props.$inline ? 'margin-left: auto;' : ''}
  }
`;

const NekoEmpty = ({
  icon = 'folder-open',
  title = 'Nothing yet',
  subtitle,
  action,
  inline = false,
  iconSize,
  style,
  className,
}) => (
  <EmptyContainer $inline={inline} style={style} className={className}>
    {icon && (
      <span className="neko-empty-icon">
        <NekoIcon icon={icon} width={iconSize || (inline ? 18 : 28)} />
      </span>
    )}
    <div className="neko-empty-body">
      {title && <p className="neko-empty-title">{title}</p>}
      {subtitle && <p className="neko-empty-subtitle">{subtitle}</p>}
    </div>
    {action && <div className="neko-empty-action">{action}</div>}
  </EmptyContainer>
);

NekoEmpty.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  action: PropTypes.node,
  inline: PropTypes.bool,
  iconSize: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
};

export { NekoEmpty };
