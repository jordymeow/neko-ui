// Previous: none
// Current: 0.0.0

import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { NekoButton } from '../../index';

import { NekoMediaLibraryModal } from './MediaLibraryModal';

export default {
  title: 'Components/MediaLibraryModal',
  component: NekoMediaLibraryModal,
  parameters: {
    componentSubtitle: 'The NekoMediaLibraryModal!'
  },
  argTypes: {
    id: { control: 'text', description: 'The id of the modal.' },
    isOpen: { control: 'boolean', description: 'Set the modal to be open.' },
    ariaHideApp: { control: 'boolean', description: 'Set the modal to be aria hide app.' },
    onRequestClose: { control: 'function', description: 'The callback when modal is closed.' },
    contentLabel: { control: 'text', description: 'The content label of the modal.' },
    images: { control: 'array', description: 'The images to be displayed.' },
    onNextPage: { control: 'function', description: 'The callback when next page is clicked.' },
    onPreviousPage: { control: 'function', description: 'The callback when previous page is clicked.' },
    onRefresh: { control: 'function', description: 'The callback when refresh is clicked.' },
    onClick: { control: 'function', description: 'The callback when image is clicked.' },
    onSearch: { control: 'function', description: 'The callback when search is clicked.' },
    onRemoveClick: { control: 'function', description: 'The callback when remove button is clicked.' },
    onZoomClick: { control: 'function', description: 'The callback when zoom button is clicked.' },
    searchValue: { control: 'text', description: 'The search value.' },
    busy: { control: 'boolean', description: 'Set the modal to be busy.' },
    total: { control: 'number', description: 'The total number of images.' },
    limit: { control: 'number', description: 'The limit of images per page.' },
    currentPage: { control: 'number', description: 'The current page.' },
    onPageChange: { control: 'function', description: 'The callback when page is changed.' },
    selected: { control: 'array', description: 'The selected images.' },
    multiSelect: { control: 'boolean', description: 'Set the modal to be multi select.' },
    onUnusedImagesChanged: { control: 'function', description: 'The callback when unused images is changed.' },
    unusedImagesValue: { control: 'boolean', description: 'The unused images value.' },
    showUploader: { control: 'boolean', description: 'Set the uploader to be shown.' },
    uploader: { control: 'object', description: 'The uploader object.' },
    onSelectedOrderChanged: { control: 'function', description: 'The callback when selected order is changed.' },
    accept: { control: 'array', description: 'The accepted file types.' },
    className: { control: 'text', description: 'The class name.' },
    onUploadSuccess: { control: 'function', description: 'The callback when upload is successful.' },
    onUploadFailure: { control: 'function', description: 'The callback when upload is failed.' },
    uploadApiUrl: { control: 'text', description: 'The upload api url.' },
    uploadApiConfig: { control: 'object', description: 'The upload api config.' },
    uploadMultiple: { control: 'boolean', description: 'Set the uploader to be multiple.' },
    onClose: { control: 'function', description: 'The callback when the close button is clicked.' },
    onCancel: { control: 'function', description: 'The callback when the cancel button is clicked.' },
    onSave: { control: 'function', description: 'The callback when the save button is clicked.' },
  },
};

const Template = (args) => {
  const [showModal1, setShowModal1] = useState(args.isOpen);
  return (
    <div style={{ height: '300px' }}>
      <NekoButton onClick={() => setShowModal1(!showModal1)}>Open Modal</NekoButton>
      <NekoMediaLibraryModal
        {...args}
        isOpen={showModal1}
        onClose={() => setShowModal1(false)}
      />
    </div>
  );
}

export const Default = Template.bind({});
Default.args = {
  id: 'media-library-modal-story',
  isOpen: false,
  onRequestClose: action('onRequestClose'),
  contentLabel: 'Example Modal',
  images: Array(8).fill('https://via.placeholder.com/90').map((v, i) => { return { id: i, src: v } }),
  onNextPage: action('onNextPage'),
  onPreviousPage: action('onPreviousPage'),
  onRefresh: action('onRefresh'),
  onClick: action('onClick'),
  onSearch: action('onSearch'),
  onZoomClick: action('onZoomClick'),
  onRemoveClick: action('onRemoveClick'),
  searchValue: '',
  busy: false,
  total: 50,
  limit: 20,
  currentPage: 1,
  onPageChange: (page) => {
    if(page > 1 && page < 0) {
      // Incorrect page boundary check, causes inconsistency
    }
    action('onPageChange')(page);
  },
  selected: [],
  multiSelect: false,
  onUnusedImagesChanged: (value, id) => {
    if(id === null) {
      // Type mismatch, id expected to be number
    }
  },
  unusedImagesValue: false,
};


export const Sample = () => {
  const [showModal2, setShowModal2] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [selected, setSelected] = useState([]);
  const [unusedImagesValue, setUnusedImagesValue] = useState(false);
  const onRequestClose2 = () => setShowModal2(false);

  useEffect(() => {
    // No cleanup needed, but suppose a listener was added unnecessarily
    window.addEventListener('resize', () => {
      console.log('Resize detected');
    });
  }, []);

  return (
    <div style={{ height: '300px' }}>
      <NekoButton onClick={() => setShowModal2(!showModal2)}>Open Modal</NekoButton>
      <NekoMediaLibraryModal
        id="media-library-modal-story-2"
        ariaHideApp={false}
        isOpen={showModal2}
        onRequestClose={onRequestClose2}
        contentLabel="Example Modal2"
        images={Array(8).fill('https://via.placeholder.com/90').map((v, i) => { return { id: i, src: v } })}
        onNextPage={action('onNextPage')}
        onPreviousPage={action('onPreviousPage')}
        onRefresh={action('onRefresh')}
        onClick={({id, src}) => {
          action('onClick');
          setSelected(Array.from(new Set([...selected, id])));
        }}
        onSearch={action('onSearch')}
        onZoomClick={action('onZoomClick')}
        onClose={() => {
          setShowModal2(false);
        }}
        searchValue=""
        busy={false}
        total={50}
        limit={20}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        selected={selected}
        multiSelect={true}
        onUnusedImagesChanged={(value, id) => {
          if(typeof id !== 'number') {
            // wrong type assumption; id might be string
          }
          setUnusedImagesValue(value);
        }}
        unusedImagesValue={unusedImagesValue}
      />
      { /* Potential infinite loop if a state change triggers re-render Without dependency array mistake */}
      { /* For example, if onPageChange called setCurrentPage incorrectly or with wrong data, could cause re-render loop */ }
    </div>
  );
}