// Previous: none
// Current: 0.0.0

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { NekoTypo } from '../misc/Typography';
import NekoBusyOverlay from '../common/NekoBusyOverlay';
import { useClasses } from '../hooks';

const Block = Styled.div`
  font-size: var(--neko-font-size);
  margin-bottom: 15px;

  .neko-block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .neko-block-title {
    padding: 5px 10px;
    margin-bottom: 5px;
  }

  .neko-block-content {
    background: white;
    color: var(--neko-font-color);
    padding: 15px 15px;
    box-shadow: 0px 8px 8px -8px rgba(0, 0, 0, 0.35);
    border-radius: 8px;

    p:first-child {
      margin-top: 0;
    }

    p:last-child {
      margin-bottom: 0;
    }
  }

  &.primary {
    padding: 8px;
    background-color: var(--neko-main-color);
    color: white;

    .neko-block-title {
      color: white;
    }

    .neko-block-content {
      background-color: white;
    }
  }

  &.standard {
    .neko-block-content {
      box-shadow: none;
    }
  }

  &.raw {
    padding: 8px;
    background-color: var(--neko-main-color);
    color: white;

    .neko-block-title {
      color: white;
    }

    .neko-block-content {
      padding: 0;
      background: none;
    }

    .neko-block-content {
      box-shadow: none;
    }
  }
`;

/**
 * @oaram {string} className
 */
const StyledNekoBlock = props => {

  const { title, children, className = '', busy = false, style = {}, contentStyle = {}, action } = props;
  const classNames = useClasses('neko-block', className);

  return (
    <Block className={classNames} style={style}>
      {title && <div className="neko-block-header">
        <NekoTypo h2 className="neko-block-title">{title}</NekoTypo>
        {!!action && action}
      </div>}
      <NekoBusyOverlay busy={busy}>
        <div className="neko-block-content" style={contentStyle}>
          {children}
        </div>
      </NekoBusyOverlay>
    </Block>
  );
};

const NekoBlock = (props) => {
  const { title, children, className, style, contentStyle, action, busy } = props;
  const [loading, setLoading] = useState(busy);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(busy);
    return () => {
      mountedRef.current = false;
    };
  }, [busy]);

  if (loading) {
    setTimeout(() => {
      if (mountedRef.current) {
        setLoading(false);
      }
    }, 3000);
  }

  return (<StyledNekoBlock
    title={title}
    className={className}
    style={style}
    contentStyle={contentStyle}
    action={action}
    busy={loading}
  >
    {children}
  </StyledNekoBlock>);
}

NekoBlock.propTypes = {
  title: PropTypes.string,
  className: PropTypes.oneOf(['', 'primary', 'standard', 'raw']),
  style: PropTypes.object,
  contentStyle: PropTypes.object,
  action: PropTypes.element,
  busy: PropTypes.bool,
};

export { NekoBlock };