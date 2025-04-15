// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';

/**
 * @param {string} title=''
 */
const StyledNekoSettings = Styled(props => {

  const { title = '', contentAlign = 'left', titleStyle = {}, ...rest } = props;
  const classNames = useClasses('neko-settings', props.className);
  return (
    <div className={classNames} {...rest}>
      {title ? <div className="neko-settings-head" style={titleStyle}>{title}</div> : null}
      <div className={`neko-settings-content neko-settings-content-align-${contentAlign}`}>
        {props.children}
      </div>
    </div>
  );
})`
  display: flex;
  font-family: var(--neko-font-family);

  > .neko-settings-head {
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size); 
    line-height: 17px;
    width: 120px;
    margin-right: 16px;
    font-weight: 500;
    color: var(--neko-main-color);
  }

  /* Select, Checkbox, Input need to be a bit higher to be in front of the settings title */

  .neko-settings-content > .neko-select:first-child {
    position: relative;
    margin-top: -5px;
  }
  
  .neko-settings-content > div:first-child .neko-checkbox-container {
    margin-top: -5px;
  }

  .neko-settings-content > .neko-button:first-child {
    position: relative;
    margin-top: -5px;
  }

  .neko-settings-content > div:first-child > .neko-input {
    position: relative;
    margin-top: -5px;
  }

  > .neko-settings-content {
    flex: 1;

    &.neko-settings-content-align-right {
      flex: none;
      margin-left: auto;
    }

    input[type=text] {
      width: 100%;
    }


  }

  & + div {
    margin-top: 10px;
  }
`;

const NekoSettings = (props) => {
  return (<StyledNekoSettings {...props} />);
}

NekoSettings.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  contentAlign: PropTypes.string,
  titleStyle: PropTypes.object,
};

export { NekoSettings };
