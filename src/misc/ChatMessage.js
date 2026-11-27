import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

/**
 * NekoChatMessage — a chat bubble for conversational UIs.
 *
 *   <NekoChatMessage role="user">Hello!</NekoChatMessage>
 *   <NekoChatMessage role="ai">Hi, how can I help?</NekoChatMessage>
 *
 * User bubbles align right with the brand main colour; AI bubbles align left
 * with a neutral gray. Wrap several inside a flex-column container and they'll
 * lay out naturally.
 */

const Bubble = Styled.div`
  align-self: ${props => props.$role === 'user' ? 'flex-end' : 'flex-start'};
  max-width: 82%;
  padding: 8px 12px;
  border-radius: 10px;
  background: ${props => props.$role === 'user'
    ? 'var(--neko-main-color)'
    : 'color-mix(in oklab, var(--neko-gray-90) 40%, white)'};
  color: ${props => props.$role === 'user'
    ? 'white'
    : 'var(--neko-gray-20)'};
  font-size: 13px;
  line-height: 1.45;
  word-wrap: break-word;
`;

const NekoChatMessage = ({ role = 'ai', children, style, className }) => (
  <Bubble $role={role} style={style} className={className}>{children}</Bubble>
);

NekoChatMessage.propTypes = {
  role: PropTypes.oneOf(['user', 'ai', 'system']),
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

export { NekoChatMessage };
