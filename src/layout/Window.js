// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

const WindowBase = Styled.div`
  margin: 20px;
  padding: 14px;
  background-color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  > * + * {
    /* Base margin between child elements */
    margin-top: 14px;
  }
`;

const TitleBar = Styled(props => (
  props.children ? (
    <div className={props.className}>
      {props.children}
    </div>
  ) : null
))`
  background-color: var(--neko-main-color);
  color: white;
`;

const StyledNekoWindow = props => (
  <WindowBase className='neko-window'>
    <TitleBar>{props.title}</TitleBar>
    {props.children}
  </WindowBase>
);

const NekoWindow = (props) => {
  return (<StyledNekoWindow {...props} />);
}

NekoWindow.propTypes = {
  title: PropTypes.string
};

export { NekoWindow };
