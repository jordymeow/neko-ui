import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

import { NekoButton } from '../button/Button';
import { NekoIcon } from './Icon';

/**
 * NekoAssetPicker — a small row that shows the currently-chosen asset
 * (avatar, icon, image, sound…) with a "Change" button next to it.
 *
 *   <NekoAssetPicker
 *     label="AI Avatar"
 *     value="chat-nyao-1.svg"
 *     thumbnail={<NekoIcon icon="cat" width={28} color="white" />}
 *     onPickClick={() => openPicker()}
 *   />
 */

const Wrap = Styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  background: color-mix(in oklab, var(--neko-main-color) 4%, white);
  border: 1px solid var(--neko-border-color);
`;

const Thumb = Styled.div`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background: var(--neko-main-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 ${props => props.$size}px;
`;

const NekoAssetPicker = ({
  label,
  value,
  thumbnail,
  thumbSize = 44,
  onPickClick,
  pickLabel = 'Change',
  style,
  className,
}) => (
  <Wrap style={style} className={className}>
    <Thumb $size={thumbSize}>
      {thumbnail || <NekoIcon icon="image" width={Math.round(thumbSize * 0.65)} color="white" />}
    </Thumb>
    <div style={{ flex: 1, minWidth: 0 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>}
      {value && <code style={{ fontSize: 11, opacity: 0.55 }}>{value}</code>}
    </div>
    <NekoButton className="secondary" small icon="image" onClick={onPickClick}>
      {pickLabel}
    </NekoButton>
  </Wrap>
);

NekoAssetPicker.propTypes = {
  label: PropTypes.node,
  value: PropTypes.string,
  thumbnail: PropTypes.node,
  thumbSize: PropTypes.number,
  onPickClick: PropTypes.func,
  pickLabel: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

export { NekoAssetPicker };
