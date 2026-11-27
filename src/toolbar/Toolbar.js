import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

const ToolbarBase = Styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 10px 10px;
  background: white;
  color: var(--neko-font-color);
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  align-items: center;

  &.neko-align-left {
    justify-content: flex-start;
  }

  &.neko-align-right {
    justify-content: flex-end;
  }

  > *:not(:last-child) {
    margin-right: 5px;
  }
`;

const StyledNekoToolbar = ({ align = 'left', ...props }) => {
  return (
    <ToolbarBase className={`neko-toolbar neko-align-${align}`} {...props}>
      {props.children}
    </ToolbarBase>
  );
};

const NekoToolbar = (props) => {
  return (<StyledNekoToolbar {...props} />);
};

NekoToolbar.propTypes = {
  align: PropTypes.oneOf(['left', 'right'])
};

export { NekoToolbar };
