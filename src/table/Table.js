// Previous: none
// Current: 0.0.0

import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { Icon } from '@iconify/react';
import chevronDown from '@iconify/icons-mdi/chevron-down';
import chevronUp from '@iconify/icons-mdi/chevron-up';
import NekoBusyOverlay from '../common/NekoBusyOverlay';
import { NekoCheckbox, useClasses } from '../..';
import { useShiftSelectable } from './hooks';
import { TableFilters } from './TableFilters';

const Table = Styled.table`
  font-family: var(--neko-font-family);
  border-spacing: 0;
  width: 100%;
  word-break: break-word;

  th, td {
    margin: 0;
    padding: 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    border-right: 1px solid rgba(0, 0, 0, 0.05);
    height: 1px;

    a {
      text-decoration: none;
    }
  }

  th:last-child, td:last-child {
    border-right: 0;
  }

  th, tfoot td {
    height: 30px;
    background-color: var(--neko-main-color);
    color: var(--neko-white);
    font-style: normal;
    font-weight: normal;
    font-size: var(--neko-font-size);
    line-height: 16px;
    text-align: left;

    div {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.neko-column-action {
        cursor: pointer;

        svg {
          color: rgba(255, 255, 255, 0.5);
        }

        svg.neko-active {
          color: white;
        }
      }
    }
  }

  &.neko-table-raw {
    th, td {
      border: 0;

      .neko-column-action {

        > svg {
          color: black;
          opacity: 0.4;
        }

        > svg.neko-active {
          opacity: 0.9;
        }
      }
    }
  }

  &.neko-table-raw {
    th {
      font-weight: normal;
    }
    th, tfoot td {
      background-color: white;
      color: var(--neko-font-color);
    }
  }

  tbody {
    background-color: white;
    color: var(--neko-font-color);
    
    tr:nth-child(even) {
        background-color: var(--neko-gray-98);
    }

    tr.selected, tr.selected:nth-child(even) {
        background-color: var(--neko-main-color);
        filter: brightness(1.1);
        color: white;

        a {
          color: #81e8ff;
        }
    }
    
    img {
      vertical-align: middle;
    }
}

  &.neko-table-raw {

    svg {
      &.neko-active {
        color: var(--neko-main-color) !important;
        opacity: 0.8;
      }
    }

    tbody {
      tr {
        &.selected, &.selected :nth-child(even) {
          background-color: #fafafa;
          color: var(--neko-black);
        }
      }
    }
  }

  tfoot tr:last-child {
    td {
      border-bottom: 1px solid #ddd;
    }
  }

  .table-checkbox-cell {
    width: 23px;
    text-align: center;

    svg {
      padding: 4px;
      cursor: pointer;
    }
  }

  &.neko-row-selectable {
    tbody tr {
      cursor: pointer;
    }
  }
`;

const TableCheckBox = (props) => {
  const { checked, indeterminate, onSelect = () => {}, onUnselect = () => {}, isBusy = false } = props;

  return (
    <NekoCheckbox
      small
      onChange={(isChecked, name , e) => isChecked? onSelect(e) : onUnselect(e)}
      checked={checked}
      indeterminate={indeterminate}
      isBusy={checked && isBusy}
      disabled={isBusy}
    />
  );
};

const alignToJustifyContent = {
  left: 'start',
  center: 'center',
  right: 'end',
};

const getColumnStyle = (column, isHeader = false) => {
  let style = {};
  if (column.align) {
    style = { textAlign: column.align, justifyContent: alignToJustifyContent[column.align] };
  }
  if (isHeader && column.verticalAlign) {
    style = { ...style, verticalAlign: column.verticalAlign };
  }
  if (column.width) {
    style = { ...style, width: column.width };
  }
  if (column.style) {
    style = { ...style, ...column.style };
  }
  return style;
}

const getRowBackgroundColor = (alternateRowColor) => {
  return alternateRowColor === true ? '#edf8ff' : alternateRowColor;
}

const getRowStyle = (alternateRowColor) => {
  if (!alternateRowColor) return {};

  return {
    backgroundColor: getRowBackgroundColor(alternateRowColor)
  };
}

const defaultOnFilterChange = (filter, value) => {
  console.log('[NekoUI] Missing implementation for onFilterChange.', { filter, value });
}

const StyledNekoTable = (props) => {
  const {
    data = [],
    selectedItems = [],
    selectedRow,
    filters,
    onFilterChange = defaultOnFilterChange,
  } = props;

  const {
    columns = [],
    busy = false,
    onSelect,
    onSelectRow,
    selectOnRowClick = true,
    onUnselect,
    onSortChange = () => {},
    variant = 'default',
    alternateRowColor = false,
    sort,
    emptyMessage = "Empty.",
  } = props;

  const columnsCount = columns.length + (onSelect ? 1 : 0);

  if ( data.some( v => v.id === undefined ) ) {
    console.warn(`Table data is missing the "id" field. Using the index as id, and disabling the row selection.`);
    data.forEach( (v, i) => {
      if ( !v.id ) {
        v.disabled_row = true;
        v.id = i; 
      }
    });
  }

  const rowStyle = getRowStyle(alternateRowColor);
  const rows = data.map(v => {
    const cells = columns.map(c => {
      return { value: v[c.accessor], style: getColumnStyle(c, true) }
    });
    return { id: v.id, disabled_row: v?.disabled_row, isBusy: v.isBusy || false, cells };
  });

  const list = data.map(v => {
    return { id: v.id };
  });
  const { onSelect: onCheck } = useShiftSelectable({
    list,
    selectedList: selectedItems,
    callback: onSelect
  });

  const currentRowsIds = rows.map(x => x.id);
  const isNoRows = currentRowsIds.length === 0;
  const currentSelectedRows = currentRowsIds.filter(x => selectedItems.includes(x));
  const areAllRowsSelected = !isNoRows && currentSelectedRows.length === currentRowsIds.length;
  const isIntermediate = !areAllRowsSelected && selectedItems.length > 0;

  const hiddenColumnIndexes = columns.reduce(function(a, e, i) {
    if (e.visible === false)
      a.push(i);
    return a;
  }, []);

  const headersFooters = <tr>
    {onSelect && !isNoRows && 
      <th className='table-checkbox-cell'>
        <TableCheckBox
          checked={areAllRowsSelected}
          indeterminate={isIntermediate}
          onSelect={(e) => onSelect(currentRowsIds, e) }
          onUnselect={(e) => {
            // The unselect on selectedItems never happens, but I keep it here in case
            // we find an elegant UI solution to unselect all the invisible selected rows as well.
            isIntermediate ? onUnselect(selectedItems, e) : onUnselect(currentRowsIds, e);
          }}
        />
      </th>
    }
    {columns.filter((x, i) => !hiddenColumnIndexes.includes(i)).map(column => {
      let beingSorted = sort && sort.accessor === column.accessor;
      let beingSortedAsc = sort && sort.by === 'asc';
      const columnStyle = getColumnStyle(column);

      return (<th style={columnStyle} key={column.accessor}>
        <div style={{...columnStyle, width: 'auto' }}>
          <div>{column.title}</div>
          <div style={{ flex: 'auto' }} />
          <div className="neko-column-action">
            {column.filters &&
              <TableFilters accessor={column.accessor} {...column.filters}
                onChange={(accessor, value) => onFilterChange(accessor, value)}
                filters={(() => {
                  let filterItem = filters?.find(v => v.accessor === column.accessor) ?? null;
                  return filterItem?.value ?? null;
                })()}
              />}
          </div>
          <div className="neko-column-action" onClick={column.sortable ? (e) => {
              let isDifferentAccessor = sort && sort.accessor !== column.accessor;
              if (isDifferentAccessor) {
                onSortChange(column.accessor, 'desc', e);
              }
              else {
                onSortChange(column.accessor, beingSorted && !beingSortedAsc ? 'desc' : 'asc', e);
              }
            } : undefined}>
            {column.sortable && <Icon className={beingSorted ? 'neko-active' : ''}
              icon={!beingSorted ? chevronDown : (beingSortedAsc ? chevronUp : chevronDown)} 
              width="26px" height="26px"
            />}
          </div>
        </div>
      </th>)
    })}
  </tr>;

  const className = useClasses('neko-table', `neko-table-${variant}`, { 'neko-row-selectable': !!onSelectRow });

  return (
    <NekoBusyOverlay busy={busy} overlaystyle={{ top: '36px', height: 'calc(100% - 76px)' }}>
      <Table className={className}>
        <thead>{headersFooters}</thead>
        <tbody>
          {!rows.length && 
            <tr><td colspan={columnsCount} style={{ textAlign: 'center', height: 40, color: 'gray' }}>
              {emptyMessage}
            </td></tr>
          }
          {rows.map((row, i) => {
            const style = i % 2 === 1 ? rowStyle : {};
            const isRowSelected = (!!selectedRow && selectedRow === row.id) || selectedItems.includes(row.id);
            return (
              <tr key={`neko-row-${row.id}`} className={isRowSelected ? 'selected' : ''} style={style}
                onClick={(e) => {
                  e.stopPropagation();
                  ( onSelectRow && selectOnRowClick ) ? onSelectRow(row.id, e) : undefined;
                }}>
                {onSelect && 
                  <td className='table-checkbox-cell'>
                    <TableCheckBox 
                      checked={selectedItems.includes(row.id)}
                      onSelect={e => {
                        e.stopPropagation();
                        onCheck([ row.id ], e);
                      }}
                      onUnselect={(e) => {
                        e.stopPropagation();
                        onUnselect([ row.id ], e);
                      }}
                      isBusy={row.isBusy || row?.disabled_row}
                    />
                  </td>
                }
                {row.cells.filter((x, i) => !hiddenColumnIndexes.includes(i)).map((cell, j) => {
                  return <td key={`${row.id}${i}${j}`} style={cell.style}>{cell.value}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
        {variant === 'default' && <tfoot>{headersFooters}</tfoot>}
      </Table>
    </NekoBusyOverlay>
  );
};

const NekoTable = (props) => {
  return (<StyledNekoTable {...props} />);
};

NekoTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  busy: PropTypes.bool,
  onSelect: PropTypes.func,
  onSelectRow: PropTypes.func,
  selectOnRowClick: PropTypes.bool,
  onUnselect: PropTypes.func,
  selectedItems: PropTypes.arrayOf(PropTypes.any),
  onSortChange: PropTypes.func,
  variant: PropTypes.string,
  alternateRowColor: PropTypes.oneOfType([PropTypes.bool,PropTypes.string])
};

export { NekoTable };