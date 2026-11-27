import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

/**
 * NekoRow / NekoCol — a lightweight builder layout for forms.
 *
 * Pattern: a horizontal row of fields, each column having its own flex weight,
 * with label+control stacked vertically inside. Mirrors the row-and-col layout
 * pattern used across the chatbot builder, popup config, UI builder, etc.
 *
 *   <NekoRow>
 *     <NekoCol flex={3}><label>Name:</label><NekoInput /></NekoCol>
 *     <NekoCol><label>Popup:</label><NekoCheckbox label="Yes" /></NekoCol>
 *   </NekoRow>
 */

const StyledRow = Styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: flex-start;
`;

const StyledCol = Styled.div`
  flex: ${props => props.$flex};
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;

  > label {
    font-weight: 500;
    color: var(--neko-gray-40);
  }
`;

const NekoRow = ({ children, style, className }) => (
  <StyledRow style={style} className={className}>{children}</StyledRow>
);
NekoRow.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

const NekoCol = ({ flex = 1, children, style, className }) => (
  <StyledCol $flex={flex} style={style} className={className}>{children}</StyledCol>
);
NekoCol.propTypes = {
  flex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

export { NekoRow, NekoCol };
