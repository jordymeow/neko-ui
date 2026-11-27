import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

/**
 * NekoKeyValueGrid — a compact key/value information grid (e.g. Discussion
 * metadata panel). Pass `entries` as an array of `{ label, value }`.
 *
 *   <NekoKeyValueGrid columns={2} entries={[
 *     { label: 'Model',   value: 'claude-opus-4-7' },
 *     { label: 'Bot ID',  value: 'claude' },
 *     { label: 'Chat ID', value: 'chat-11-a91f' },
 *   ]} />
 */

const Grid = Styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns}, minmax(0, 1fr));
  gap: 10px 14px;
`;

const Cell = Styled.div`
  min-width: 0;

  .kv-label {
    font-weight: 700;
    font-size: 12px;
    color: var(--neko-gray-40);
  }
  .kv-value {
    font-size: 13px;
    color: var(--neko-font-color);
    word-wrap: break-word;
    margin-top: 2px;
  }
`;

const NekoKeyValueGrid = ({ entries = [], columns = 2, style, className }) => (
  <Grid $columns={columns} style={style} className={className}>
    {entries.map((e, i) => (
      <Cell key={i}>
        <div className="kv-label">{e.label}</div>
        <div className="kv-value">{e.value}</div>
      </Cell>
    ))}
  </Grid>
);

NekoKeyValueGrid.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.node.isRequired,
    value: PropTypes.node,
  })),
  columns: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
};

export { NekoKeyValueGrid };
