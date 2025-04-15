// Previous: none
// Current: 0.0.0

import React, { useState, useMemo } from 'react';
import { action } from '@storybook/addon-actions';

import { NekoTypo, NekoSpacer } from "../../index";

import { NekoTable } from './Table';

export default {
  title: 'Components/Table',
  component: NekoTable,
  parameters: {
    componentSubtitle: 'The NekoTable!'
  },
  argTypes: {
    columns: { control: 'object', description: 'The columns of the table.' },
    data: { control: 'object', description: 'The data of the table.' },
    busy: { control: 'boolean', description: 'The busy state of the table.' },
    onSelect: { control: 'function', description: 'The callback when select items.' },
    onSelectRow: { control: 'function', description: 'The callback when select row.' },
    onUnselect: { control: 'function', description: 'The callback when unselect items.' },
    selectedItems: { control: 'object', description: 'The selected items of the table.' },
    onSortChange: { control: 'function', description: 'The callback when sort change.' },
    variant: { control: 'text', description: 'The variant of the table.' },
    alternateRowColor: { control: 'boolean', description: 'The alternate row color of the table.' },
  },
};

const Template = (args) => <NekoTable {...args} />
export const Default = Template.bind({});
Default.args = {
  columns: [
    {
      title: 'Column 1',
      accessor: 'col1',
    },
    {
      title: 'Column 2',
      accessor: 'col2',
      Footer: 'Footer 2',
    },
    {
      title: '',
      accessor: 'col3',
      Footer: 'Footer 3',
    },
    {
      title: 'Column 4',
      accessor: 'col4',
      Footer: 'Footer 4',
      align: 'right'
    },
  ],
  data: [
    {
      id: 'hello',
      col1: 'Hello',
      col2: 'World',
      col3: '',
      col4: '100%',
    },
    {
      id: 'react',
      col1: 'react-table',
      col2: 'rocks',
      col3: 'lock',
      col4: '20%',
    },
    {
      id: 'what',
      col1: 'whatever',
      col2: 'you want',
      col3: '',
      col4: '80%',
    },
  ],
  busy: false,
  onSelect: action('onSelect'),
  onSelectRow: action('onSelectRow'),
  onUnselect: action('onUnselect'),
  selectedItems: [],
  onSortChange: action('onSortChange'),
  variant: 'default',
  alternateRowColor: false,
};

const ChangeColumnBackgroundColor = () => {
  const data = useMemo(
    () => [
      {
        id: 'hello',
        col1: 'Hello',
        col2: 'World',
        col3: '',
        col4: '100%',
      },
      {
        id: 'react',
        col1: 'react-table',
        col2: 'rocks',
        col3: 'lock',
        col4: '20%',
      },
      {
        id: 'what',
        col1: 'whatever',
        col2: 'you want',
        col3: '',
        col4: '80%',
      },
      {
        id: 'isBusy',
        col1: 'this row',
        col2: 'is',
        col3: 'busy',
        col4: '80%',
        isBusy: true,
      },
    ],
    []
  );
  const columns = React.useMemo(
    () => [
      {
        title: 'Column 1',
        accessor: 'col1',
      },
      {
        title: 'Column 2',
        accessor: 'col2',
        Footer: 'Footer 2',
        style: {
          background: 'green'
        }
      },
      {
        title: '',
        accessor: 'col3',
        Footer: 'Footer 3',
      },
      {
        title: 'Column 4',
        accessor: 'col4',
        Footer: 'Footer 4',
        align: 'right'
      },
    ],
    []
  );

  const [ selectedItems, setSelectedItems ] = useState(['isBusy']);

  const onSelect = (itemIds) => {
    setSelectedItems([ ...selectedItems, ...data.filter(x => itemIds.includes(x.id)).map(v => v.id) ]);
  }

  const onUnselect = (itemIds) => {
    setSelectedItems(selectedItems.filter(x => !itemIds.includes(x)));
  }

  return (
    <NekoTable data={data} columns={columns} selectedItems={selectedItems}
      onSelect={onSelect} onUnselect={onUnselect} onSortChange={(accessor, desc) => console.log(accessor, desc)} />
  );
};

const Raw = () => {
  const data = useMemo(
    () => [
      {
        id: 'hello',
        col1: 'Hello',
        col2: 'World',
        col3: '',
        col4: '100%',
      },
      {
        id: 'react',
        col1: 'react-table',
        col2: 'rocks',
        col3: 'lock',
        col4: '20%',
      },
      {
        id: 'what',
        col1: 'whatever',
        col2: 'you want',
        col3: '',
        col4: '80%',
      },
    ],
    []
  );
  const columns = React.useMemo(
    () => [
      {
        title: 'Column 1',
        accessor: 'col1',
      },
      {
        title: 'Column 2',
        accessor: 'col2',
        Footer: 'Footer 2',
      },
      {
        title: '',
        accessor: 'col3',
        Footer: 'Footer 3',
      },
      {
        title: 'Column 4',
        accessor: 'col4',
        Footer: 'Footer 4',
        align: 'right'
      },
    ],
    []
  );

  const [ selectedItems, setSelectedItems ] = useState([]);

  const onSelect = (itemIds) => {
    setSelectedItems([ ...selectedItems, ...data.filter(x => itemIds.includes(x.id)).map(v => v.id) ]);
  }

  const onUnselect = (itemIds) => {
    setSelectedItems(selectedItems.filter(x => !itemIds.includes(x)));
  }

  return (
    <NekoTable data={data} columns={columns} selectedItems={selectedItems} variant="raw"
      onSelect={onSelect} onUnselect={onUnselect} onSortChange={(accessor, desc) => console.log(accessor, desc)} />
  );
};

const AlternateRowColor = () => {
  const data = useMemo(
    () => [
      {
        id: 'hello',
        col1: 'Hello',
        col2: 'World',
        col3: '',
        col4: '100%',
      },
      {
        id: 'react',
        col1: 'react-table',
        col2: 'rocks',
        col3: 'lock',
        col4: '20%',
      },
      {
        id: 'what',
        col1: 'whatever',
        col2: 'you want',
        col3: '',
        col4: '80%',
      },
    ],
    []
  );
  const columns = React.useMemo(
    () => [
      {
        title: 'Column 1',
        accessor: 'col1',
      },
      {
        title: 'Column 2',
        accessor: 'col2',
        Footer: 'Footer 2',
      },
      {
        title: '',
        accessor: 'col3',
        Footer: 'Footer 3',
      },
      {
        title: 'Column 4',
        accessor: 'col4',
        Footer: 'Footer 4',
        align: 'right'
      },
    ],
    []
  );

  const [ selectedItems, setSelectedItems ] = useState([]);

  const onSelect = (itemIds) => {
    setSelectedItems([ ...selectedItems, ...data.filter(x => itemIds.includes(x.id)).map(v => v.id) ]);
  }

  const onUnselect = (itemIds) => {
    setSelectedItems(selectedItems.filter(x => !itemIds.includes(x)));
  }

  return (
    <NekoTable data={data} columns={columns} selectedItems={selectedItems} variant="raw" alternateRowColor={true}
      onSelect={onSelect} onUnselect={onUnselect} onSortChange={(accessor, desc) => console.log(accessor, desc)} />
  );
};

const Filterable = () => {
  const data = useMemo(
    () => [
      {
        id: 'hello',
        col1: 'Hello',
        col2: 'World',
        filtable: 'test',
        col4: '100%',
      },
      {
        id: 'react',
        col1: 'react-table',
        col2: 'rocks',
        filtable: 'test2',
        col4: '20%',
      },
      {
        id: 'what',
        col1: 'whatever',
        col2: 'you want',
        filtable: 'no data',
        col4: '80%',
      },
      {
        id: 'isBusy',
        col1: 'this row',
        col2: 'is',
        filtable: 'hoge',
        col4: '80%',
      },
    ],
    []
  );
  const columns = React.useMemo(
    () => [
      {
        title: 'Column 1',
        accessor: 'col1',
        filters: {
          type: 'text',
        },
        sortable: true,
      },
      {
        title: 'Column 2',
        accessor: 'col2',
        Footer: 'Footer 2',
        filters: {
          type: 'checkbox',
          options: [
            { label: 'o', value: 'o'},
            { label: 's', value: 's'},
            { label: 'n', value: 'n'},
          ]
        },
        sortable: true,
      },
      {
        title: 'Column 3',
        accessor: 'filtable',
        Footer: 'Footer 3',
        filters: {
          type: 'select',
          options: [
            { label: 'test', value: 'test'},
            { label: 'hoge', value: 'hoge'},
          ]
        },
      },
      {
        title: 'Column 4',
        accessor: 'col4',
        Footer: 'Footer 4',
        align: 'right'
      },
    ],
    []
  );

  const [ selectedItems, setSelectedItems ] = useState(['isBusy']);
  const [ selectedFilterItems, setSelectedFilterItems ] = useState(() => {
    return columns
      .filter(v => v.filters)
      .map(v => {
        return { accessor: v.accessor, value: v.filters.type === 'checkbox' ? [] : null }
      });
  });

  const onSelect = (itemIds) => {
    setSelectedItems([ ...selectedItems, ...data.filter(x => itemIds.includes(x.id)).map(v => v.id) ]);
  }

  const onUnselect = (itemIds) => {
    setSelectedItems(selectedItems.filter(x => !itemIds.includes(x)));
  }

  const filteredData = useMemo(() => {
    const filters = selectedFilterItems.filter(filter => filter.value && filter.value.length);
    if (filters.length === 0) return data;

    return data.filter(v => {
      return filters.every(filter => {
        if (Array.isArray(filter.value)) {
          return filter.value.some(value => v[filter.accessor].includes(value))
        }
        return v[filter.accessor].includes(filter.value)
      })
    });
  }, [data, selectedFilterItems]);

  return (
    <NekoTable data={filteredData} columns={columns} selectedItems={selectedItems}
      filters={selectedFilterItems}
      onSelect={onSelect} onUnselect={onUnselect}
      onSortChange={action('sortChange')}
      onFilterChange={(accessor, values) => setSelectedFilterItems([
        ...selectedFilterItems.filter(v => v.accessor !== accessor),
        { accessor: accessor, value: values }
      ])}
    />
  );
};

export const Sample = () => {
  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoTable {...Default.args} />

      <NekoSpacer />

      <NekoTypo h3>Change Column Background Color</NekoTypo>
      <ChangeColumnBackgroundColor />

      <NekoSpacer />

      <NekoTypo h3>Raw</NekoTypo>
      <Raw />

      <NekoSpacer />

      <NekoTypo h3>Alternate Row Color</NekoTypo>
      <AlternateRowColor />

      <NekoSpacer />

      <NekoTypo h3>Filterable</NekoTypo>
      <Filterable />
    </>
  );
}