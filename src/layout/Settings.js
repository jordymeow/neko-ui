import React, { useId } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';

/**
 * @param {string} title=''
 * @param {string} color - Color theme for the settings title
 */
const StyledNekoSettings = Styled(props => {

  const { title = '', contentAlign = 'left', titleStyle = {}, color, ...rest } = props;
  const classNames = useClasses('neko-settings', props.className);
  // The title is the only thing naming the control beside it, and it was not tied to it, so a
  // row read as "Enable, checkbox" with no clue which setting it belonged to. On the Modules tab
  // that meant twenty-two checkboxes all announcing "Enable". Labelling the content as a group
  // names them without changing anything on screen.
  const headId = useId();
  const named = title !== '' && title !== null && title !== undefined;
  return (
    <div className={classNames} {...rest}>
      <div className="neko-settings-head" id={named ? headId : undefined} style={titleStyle}>
        {title || '\u00A0'}
      </div>
      <div className={`neko-settings-content neko-settings-content-align-${contentAlign}`}
        {...(named ? { role: 'group', 'aria-labelledby': headId } : {})}>
        {props.children}
      </div>
    </div>
  );
})`
  display: flex;
  font-family: var(--neko-font-family);
  
  ${({ color }) => {
    if (!color) return '';
    return `
      --settings-color: var(--neko-${color});
    `;
  }}

  > .neko-settings-head {
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size);
    /* Tight line-height + a small top pad: single-line titles still sit roughly
       centred with the 30px controls, and wrapped titles don't get a 30px gap
       between lines. */
    line-height: 17px;
    padding-top: 6px;
    flex: 0 0 140px;
    min-width: 0;
    margin-right: 16px;
    font-weight: 500;
    color: var(--settings-color, var(--neko-main-color));
    /* Allow the title to wrap gracefully when needed (e.g. "Context Max Length")
       but don't let it blow up the row — hyphenate-and-wrap. */
    word-break: break-word;
    hyphens: auto;
  }

  /* Controls align top-flush with the settings title — the title has line-height 17px
     which sits at the top of the row, and controls (all 30px — checkbox/input/select/button)
     start at the same y. */

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
  color: PropTypes.oneOf(['blue', 'purple', 'green', 'red', 'orange', 'yellow', 'gray']),
};

export { NekoSettings };
