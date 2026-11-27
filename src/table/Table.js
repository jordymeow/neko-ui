import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ICON_SIZES } from '../common/PresetIcons';
import NekoBusyOverlay from '../common/NekoBusyOverlay';
import { NekoCheckbox, useClasses } from '../..';
import { useDeprecatedIsBusy } from '../hooks';
import { useShiftSelectable } from './hooks';
import { TableFilters } from './TableFilters';
import { NekoEmpty } from '../misc/Empty';

const Table = Styled.table`
  font-family: var(--neko-font-family);
  border-spacing: 0;
  width: 100%;
  /* Keep words whole. Breaking at any letter turned "Sync Remote URLs" into "Sync Remot / e
     URLs" in every narrow column. A value with no spaces, like a hash or a long id, still
     breaks because of overflow-wrap, and a table full of those can ask for break-all again
     with the breakAnywhere prop. */
  word-break: normal;
  overflow-wrap: anywhere;
  display: block;

  &.neko-table-break-anywhere {
    word-break: break-all;
  }

  thead, tbody, tfoot {
    display: block;
  }
  
  /* Rounded corners for header row */
  thead tr th:first-child {
    border-radius: 5px 0 0 0;
  }
  
  thead tr th:last-child {
    border-radius: 0 5px 0 0;
  }
  
  /* Rounded corners for footer row */
  tfoot tr th:first-child {
    border-radius: 0 0 0 5px;
  }
  
  tfoot tr th:last-child {
    border-radius: 0 0 5px 0;
  }

  tr {
    display: grid;
    grid-template-columns: ${props => props.$gridColumns || 'repeat(auto-fit, minmax(0, 1fr))'};
  }

  th, td {
    margin: 0;
    padding: 7px 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    border-right: 1px solid rgba(0, 0, 0, 0.05);
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    flex-direction: column;
    justify-content: center;

    a {
      text-decoration: none;
    }
  }

  th:last-child, td:last-child {
    border-right: 0;
  }

  th {
    height: 26px;
    background-color: var(--neko-main-color);
    color: var(--neko-white);
    font-style: normal;
    font-weight: normal;
    font-size: var(--neko-font-size);
    line-height: 16px;
    text-align: left;
    flex-direction: row;
    align-items: center;
    position: relative;
    overflow: hidden;

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;

      .neko-column-action {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        transition: transform 0.28s var(--neko-ease-spring);

        svg {
          color: rgba(255, 255, 255, 0.55);
          display: block;
          width: 18px;
          height: 18px;
          transition: color 0.2s var(--neko-ease-out);
        }

        &:hover svg {
          color: rgba(255, 255, 255, 0.85);
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
          opacity: 0.5;
        }

        > svg.neko-active {
          opacity: 1;
        }
      }
    }
  }

  &.neko-table-raw {
    th {
      font-weight: bold;
    }
    th {
      background-color: white;
      color: var(--neko-font-color);
    }
  }

  tbody {
    background-color: white;
    color: var(--neko-font-color);
    min-height: 40px;

    tr:nth-child(even) {
        background-color: var(--neko-gray-98);
    }

    tr.selected, tr.selected:nth-child(even) {
        position: relative;
        background: var(--neko-main-color);
        filter: brightness(1.2);
        color: white;
        box-shadow: 0 -1px 0 var(--neko-main-color);
        z-index: 1;

        > td {
          position: relative;
          z-index: 2;
          border-bottom-color: transparent;
        }

        small {
          opacity: 0.65;
        }

        a {
          color: #81e8ff;
        }

        .neko-button {
          border: 1px solid white;
        }
    }
    
    td small {
      display: block;
      font-size: var(--neko-small-font-size);
      color: var(--neko-gray-60);
      line-height: 14px;
      margin-top: 2px;
    }
    
    tr.selected td small {
      color: white;
      opacity: 0.65;
    }
    
    img {
      vertical-align: bottom;
    }
}

  &.neko-table-raw {

    svg {
      &.neko-active {
        color: var(--neko-main-color) !important;
        opacity: 1;
      }
    }

    tbody {
      tr {
        transition: background 0.18s var(--neko-ease-out);

        /* Subtle brand-blue row hover — clearly legible without fighting
           the zebra striping. */
        &:hover:not(.selected) {
          background: color-mix(in oklab, var(--neko-main-color) 8%, transparent);
        }

        &.selected, &.selected:nth-child(even) {
          position: relative;
          background: var(--neko-main-color);
          filter: brightness(1.2);
          color: white;
          box-shadow: 0 -1px 0 var(--neko-main-color);
          z-index: 1;

          > td {
            position: relative;
            z-index: 2;
            border-bottom-color: transparent;
          }

          small {
            opacity: 0.65;
          }

          a {
            color: #81e8ff;
          }

          .neko-button {
            border: 1px solid white;
          }
        }
      }
    }
  }

  tfoot tr:last-child {
    td {
      border-bottom: 0;
    }
  }

  /* Empty state: one borderless cell that closes the table, since there's no footer. */
  tbody.neko-table-empty-body {
    border-radius: 0 0 5px 5px;
    overflow: hidden;

    > tr, > tr:nth-child(even) {
      background: var(--neko-white);
    }

    > tr > td {
      border: 0;
      align-items: center;
    }
  }

  .table-checkbox-cell {
    text-align: center;
    justify-content: center;

    svg {
      padding: 5px;
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
  const { checked, indeterminate, onSelect = () => {}, onUnselect = () => {}, isBusy = false, busy = false } = props;
  
  // Handle both busy and isBusy props - prefer busy over isBusy
  const busyState = busy || isBusy;
  
  useDeprecatedIsBusy(isBusy, 'TableCheckBox');

  return (
    <NekoCheckbox
      small
      onChange={(isChecked, name , e) => isChecked? onSelect(e) : onUnselect(e)}
      checked={checked}
      indeterminate={indeterminate}
      busy={checked && busyState}
      disabled={busyState}
    />
  );
};

const getColumnStyle = (column, isHeader = false) => {
  let style = {};
  if (column.align) {
    style = { textAlign: column.align };
  }
  if (isHeader && column.verticalAlign) {
    style = { ...style, verticalAlign: column.verticalAlign };
  }
  // Width is now handled by grid-template-columns, not individual cell styles
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

const computeGridColumns = (columns, hasCheckbox) => {
  const visibleColumns = columns.filter(col => col.visible !== false);
  
  // Add checkbox column if needed
  const gridParts = hasCheckbox ? ['34px'] : [];
  
  // Convert column widths to grid-compatible values
  visibleColumns.forEach(column => {
    if (column.width) {
      if (column.width.endsWith('%')) {
        // Convert percentage to fr unit (e.g., 45% -> 0.45fr)
        const percentage = parseFloat(column.width) / 100;
        gridParts.push(`${percentage}fr`);
      } else {
        // Keep pixel or other fixed values as is
        gridParts.push(column.width);
      }
    } else {
      // Default to 1fr for columns without width
      gridParts.push('1fr');
    }
  });
  
  return gridParts.join(' ');
}

const defaultOnFilterChange = (filter, value) => {
  console.log('[NekoUI] Missing implementation for onFilterChange.', { filter, value });
}

/**
 * @param {string} className
 * @param {string|object} icon
 * @param {bool} disabled
 * @param {function} onClick
 */
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
    isBusy = false,
    onSelect,
    onSelectRow,
    selectOnRowClick = true,
    onUnselect,
    onSortChange = () => {},
    variant = 'default',
    alternateRowColor = false,
    sort,
    emptyMessage = "Nothing to show",
    initialLoad = false,
    breakAnywhere = false,
  } = props;
  
  // Handle both busy and isBusy props - prefer busy over isBusy
  const busyState = busy || isBusy;
  
  useDeprecatedIsBusy(isBusy, 'NekoTable');

  const columnsCount = columns.length + (onSelect ? 1 : 0);

  // If data doesn't have "id" field, we will use the index as id and add a warning.
  const hasMissingIds = data.some(v => v.id === undefined);
  if (hasMissingIds) {
    console.warn(`Table data is missing the "id" field. Using the index as id instead, and disabling the row selection.`);
  }
  const normalizedData = hasMissingIds
    ? data.map((v, i) => v.id === undefined ? { ...v, id: -(i + 1), disabled_row: true } : v)
    : data;

  const rowStyle = getRowStyle(alternateRowColor);
  const rows = normalizedData.map(v => {
    const cells = columns.map(c => {
      return { value: v[c.accessor], style: getColumnStyle(c, true) }
    });
    return { id: v.id, disabled_row: v?.disabled_row, isBusy: v.isBusy || false, cells };
  });

  const list = normalizedData.map(v => {
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

  const hasCheckbox = !!onSelect && !isNoRows;
  const headersFooters = <tr>
    {hasCheckbox && 
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
        <div>
          <div>{column.title}</div>
          <div style={{ flex: 'auto' }} />
          {column.filters && (
            <div className="neko-column-action">
              <TableFilters accessor={column.accessor} {...column.filters}
                onChange={(accessor, value) => onFilterChange(accessor, value)}
                filters={(() => {
                  let filterItem = filters?.find(v => v.accessor === column.accessor) ?? null;
                  return filterItem?.value ?? null;
                })()}
              />
            </div>
          )}
          {column.sortable && (
            <div className="neko-column-action" onClick={(e) => {
              let isDifferentAccessor = sort && sort.accessor !== column.accessor;
              if (isDifferentAccessor) {
                onSortChange(column.accessor, 'desc', e);
              }
              else {
                onSortChange(column.accessor, beingSorted && beingSortedAsc ? 'desc' : 'asc', e);
              }
            }}>
              {!beingSorted ? 
                <ChevronDown className={beingSorted ? 'neko-active' : ''} size={ICON_SIZES.chevron} /> : 
                (beingSortedAsc ? <ChevronUp className="neko-active" size={ICON_SIZES.chevron} /> : <ChevronDown className="neko-active" size={ICON_SIZES.chevron} />)
              }
            </div>
          )}
        </div>
      </th>)
    })}
  </tr>;

  const className = useClasses('neko-table', `neko-table-${variant}`,
    { 'neko-row-selectable': !!onSelectRow }, { 'neko-table-break-anywhere': breakAnywhere });
  const gridColumns = computeGridColumns(columns, hasCheckbox);

  return (
    <NekoBusyOverlay busy={busyState} spinnerTop={rows.length > 0} overlayStyle={{
      top: '36px',
      bottom: variant === 'default' && rows.length > 0 ? '36px' : 0,
      height: 'auto',
      borderRadius: 0,
    }}>
      <Table className={className} $gridColumns={gridColumns}>
        <thead>{headersFooters}</thead>
        <tbody className={!rows.length && !initialLoad ? 'neko-table-empty-body' : undefined}>
          {!rows.length && !initialLoad &&
            <tr><td style={{ gridColumn: '1 / -1' }}>
              {typeof emptyMessage === 'string'
                ? <NekoEmpty title={emptyMessage} style={{ padding: '24px 16px' }} />
                : emptyMessage}
            </td></tr>
          }
          {rows.map((row, i) => {
            const isRowSelected = (!!selectedRow && selectedRow === row.id) || selectedItems.includes(row.id);
            const style = !isRowSelected && i % 2 === 0 ? rowStyle : {};
            return (
              <tr key={`neko-row-${row.id}`} className={isRowSelected ? 'selected' : ''} style={style}
                onClick={(e) => {
                  e.stopPropagation();
                  ( onSelectRow && selectOnRowClick ) ? onSelectRow(row.id, e) : undefined;
                }}>
                {hasCheckbox && 
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
                {row.cells
                  .map((cell, origIdx) => ({ ...cell, origIdx }))
                  .filter((x) => !hiddenColumnIndexes.includes(x.origIdx))
                  .map((cell) => {
                    return <td key={`${row.id}-${cell.origIdx}`} style={cell.style}>{cell.value}</td>;
                  })}
              </tr>
            );
          })}
        </tbody>
        {/* Repeating the headers under an empty table only adds weight. */}
        {variant === 'default' && rows.length > 0 && <tfoot>{headersFooters}</tfoot>}
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
  isBusy: PropTypes.bool,
  onSelect: PropTypes.func,
  onSelectRow: PropTypes.func,
  selectOnRowClick: PropTypes.bool,
  onUnselect: PropTypes.func,
  selectedItems: PropTypes.arrayOf(PropTypes.any),
  onSortChange: PropTypes.func,
  variant: PropTypes.string,
  alternateRowColor: PropTypes.oneOfType([PropTypes.bool,PropTypes.string]),
  initialLoad: PropTypes.bool,
  breakAnywhere: PropTypes.bool
};

export { NekoTable };
