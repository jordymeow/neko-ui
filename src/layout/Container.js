// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';

const Container = Styled.div`
  font-size: var(--neko-font-size);
  font-family: var(--neko-font-family);
  background-color: white;
  color: var(--neko-font-color);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;

  &.primary {
    background-color: var(--neko-main-color);
  }

  p:first-child {
    margin-top: 0px;
  }

  p:last-child {
    margin-bottom: 0px;
  }

  .neko-container-content {
    padding: 20px 20px;
  }
`;

const Bar = Styled.div`
  justify-content: flex-start;
  background-color: var(--neko-gray-98);
  display: flex;
  align-items: center;
  padding: 8px 10px;

  &.align-right {
    justify-content: flex-end;
  }
`;

/**
 * @oaram {string} className
 */
const StyledNekoContainer = props => {

  const {
    header,
    headerAlign = 'left',
    footer,
    footerAlign = 'right',
    className,
    style = {},
    contentStyle = {},
    children,
  } = props;

  const classNames = useClasses('neko-container', className);

  return (
    <Container className={classNames} style={style}>
      {header && <Bar className={`align-${headerAlign}`}>{ header }</Bar>}
      <div className="neko-container-content" style={contentStyle}>
        { children }
      </div>
      {footer && <>
        <div style={{ flex: 'auto' }} />
        <Bar className={`align-${footerAlign}`}>{ footer }</Bar>
      </>}
    </Container>
  );
};

const NekoContainer = (props) => {
  return (<StyledNekoContainer {...props} />);
}

NekoContainer.propTypes = {
  header: PropTypes.element,
  headerAlign: PropTypes.oneOf(['left', 'right']),
  footer: PropTypes.element,
  footerAlign: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  style: PropTypes.object,
  contentStyle: PropTypes.object
};

export { NekoContainer };
