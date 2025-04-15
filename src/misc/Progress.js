// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { InlineIcon } from '@iconify/react';
import pauseIcon from '@iconify/icons-mdi/pause';
import stopIcon from '@iconify/icons-mdi/stop';
import playIcon from '@iconify/icons-mdi/play';

import { useClasses } from '../hooks';

const StyledNekoProgress = Styled(props => {
  let { value = 0, max = 100, busy = false, paused = false, status, className, ...rest } = props;
  value = Math.min(value, max);
  let ratio = parseFloat(value) / parseFloat(max);
  const classNames = useClasses('neko-progress', className);

  return (
    <div className={classNames} {...rest}>
      <ProgressCurrent ratio={ratio} busy={props.busy} status={status} />
      <div className="neko-progress-buttons">
        {busy && props.onPauseClick && 
          <div className='neko-progress-button pause' onClick={props.onPauseClick}>
            {paused ? <InlineIcon icon={playIcon} /> : <InlineIcon icon={pauseIcon} />}
          </div>
        }
        {busy && props.onStopClick && 
          <div className='neko-progress-button stop' onClick={props.onStopClick}>
            <InlineIcon icon={stopIcon} />
          </div>
        }
      </div>
    </div>
  );
})`
  position: relative;
  box-sizing: border-box;
  height: 30px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.06) 0%,
    rgba(0, 0, 0, 0.02) 50%,
    rgba(0, 0, 0, 0.10) 100%
  );
  border-radius: 12px;

  .neko-progress-buttons {
    position: absolute;
    height: 100%;
    right: 0px;
    display: flex;
    align-items: center;
    padding-right: 5px;

    .neko-progress-button {
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 2px;
      border-radius: 100%;
      color: white;
      padding: 2px;
      width: 18px;
      height: 18px;
      background-color: var(--neko-main-color);

      &:hover {
        background-color: var(--neko-lighten-blue);
      }

      &.stop {
        background: var(--neko-red);

        &:hover {
          background-color: var(--neko-lighten-red);
        }
      }
    }
  }
`;

const ProgressCurrent = Styled(props => {
  const percent = !isNaN(props.ratio) ? parseInt(Math.round(props.ratio * 100)) : 0;
  const typeOfStatus = typeof props.status;
  const classNames = useClasses('neko-progress-current', props.className);
  let status;
  if (typeOfStatus !== 'undefined') {
    status = (typeOfStatus === 'string') ? props.status : props.status(percent);
  } else {
    status = `${percent}%`;
  }

  return (
    <div className={classNames} style={{ minWidth: 28, width: percent + '%' }}>
      <div>{status}</div>
    </div>
  );
})`
  box-sizing: border-box;
  position: absolute;
  overflow: hidden;
  top: 0; left: 0;
  height: 100%;
  background-color: var(--neko-main-color);
  border-radius: 12px;
  text-align: center;
  padding: 0 10px;
  vertical-align: middle;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: min-width 0.2s ease-out;
  background-size: 30px 30px;
  background-image: linear-gradient(135deg, rgba(255, 255, 255, .15) 25%,
                    transparent 25%,
                    transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%,
                    transparent 75%, transparent);
  animation: ${props => props.busy ? 'animate-stripes 1.6s linear infinite' : 'none'};

  @keyframes animate-stripes {
    0% { background-position: 0 0; }
    100% { background-position: 60px 0; }
  }
`;

const NekoProgress = (props) => {
  return (<StyledNekoProgress {...props} />);
}

NekoProgress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  busy: PropTypes.bool,
  paused: PropTypes.bool,
  onPauseClick: PropTypes.func,
  onStopClick: PropTypes.func,
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

export { NekoProgress };