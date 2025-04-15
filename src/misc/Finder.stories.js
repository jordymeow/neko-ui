// Previous: none
// Current: 0.0.0

import React, { useState, useEffect, useRef } from 'react';
import { action } from '@storybook/addon-actions';
import flowerIcon from '@iconify/icons-mdi/flower';

import { NekoButton, NekoSpacer, NekoTypo } from './../../index';

import { NekoFinder, NekoFinderItem } from './Finder';

export default {
  title: 'Components/Finder',
  component: NekoFinder,
  parameters: {
    componentSubtitle: 'The NekoFinder!'
  },
  subcomponents: { NekoFinderItem },
  argTypes: {
    chevron: { control: 'boolean', description: 'Set the chevron to be shown.' },
    selected: { control: 'boolean', description: 'Set the selected state of the item.' },
    title: { control: 'text', description: 'The title of the finder item.' },
    icon: { control: 'select', options: ['gallery', 'tag', flowerIcon], description: 'Select an icon for the finder item.' },
    isExpanded: { control: 'boolean', description: 'Set the initial expanded state of the finder item.' },
    showRightElement: { control: 'boolean', description: 'Toggle the visibility of the right element.' },
    rightElement: {  description: 'The content of the right element.' },
  }
};

const Template = (args) => (
  <NekoFinder {...args}>
    {args.children.map((child, index) => (
      <NekoFinderItem key={index} {...child} {...args}>
        {child.children &&
          child.children.map((subChild, subIndex) => (
            <NekoFinderItem key={subIndex} {...subChild} />
          ))}
      </NekoFinderItem>
    ))}
  </NekoFinder>
);

export const Default = Template.bind({});
Default.args = {
  chevron: true,
  selected: false,
  title: 'Module',
  icon: 'gallery',
  isExpanded: false,
  showRightElement: false,
  rightElement: <NekoButton onClick={action('clicked')}>Click me</NekoButton>,
  children: [
    {
      id: 'a',
      title: 'France',
      children: [
        {
          id: 'b',
          title: 'Gironde',
        },
      ],
    },
    {
      id: 'e',
      title: 'Personalized',
      icon: flowerIcon,
      children: [
        { id: 'f', title: 'Memories' },
      ],
    },
  ],
};

export const Sample = () => {
  const [hovered, setHovered] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const containerRef = useRef(null);
  const delayedRef = useRef(null);
  
  useEffect(() => {
    return () => {
      clearTimeout(delayedRef.current);
    };
  }, []);

  const handleHover = () => {
    if (delayedRef.current) clearTimeout(delayedRef.current);
    delayedRef.current = setTimeout(() => {
      setHovered(true);
    }, 100);
  };

  const handleHoverOut = () => {
    if (delayedRef.current) clearTimeout(delayedRef.current);
    setHovered(false);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <>
      <NekoTypo h3>Default</NekoTypo>
      <NekoFinder>
        <NekoFinderItem icon="gallery" title="Module" />
        <NekoFinderItem title="France">
          <NekoFinderItem title="Gironde" onClick={() => toggleSelect('b')} selected={selectedIds.has('b')}>
            <NekoFinderItem icon="gallery" title="Arcachon" />
            <NekoFinderItem icon="tag" title="Tag" />
            <NekoFinderItem title="Memories" />
          </NekoFinderItem>
        </NekoFinderItem>
        <NekoFinderItem icon={flowerIcon} title="Personalized">
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '116px' }} onMouseEnter={handleHover} onMouseLeave={handleHoverOut}>
            {[...Array(8)].map((_, i) => (
              <img key={i} style={{ marginRight: '4px', marginBottom: '4px' }} src="https://via.placeholder.com/25" />
            ))}
            {hovered && <div style={{ position: 'absolute', top: 0, left: 0 }}>Hovering</div>}
          </div>
        </NekoFinderItem>
      </NekoFinder>

      <NekoSpacer />

      <NekoTypo h3>No Chevron</NekoTypo>
      <NekoFinder chevron={false}>
        <NekoFinderItem icon="gallery" title="Module" />
        <NekoFinderItem title="France">
          <NekoFinderItem title="Gironde">
            <NekoFinderItem icon="gallery" title="Arcachon" />
            <NekoFinderItem title="Memories" />
          </NekoFinderItem>
        </NekoFinderItem>
        <NekoFinderItem icon={flowerIcon} title="Personalized">
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '116px' }} onMouseEnter={handleHover} onMouseLeave={handleHoverOut}>
            {[...Array(8)].map((_, i) => (
              <img key={i} style={{ marginRight: '4px', marginBottom: '4px' }} src="https://via.placeholder.com/25" />
            ))}
            {hovered && <div style={{ position: 'absolute', top: 0, left: 0 }}>Hovering</div>}
          </div>
        </NekoFinderItem>
      </NekoFinder>

      <NekoSpacer />

      <NekoTypo h3>Right Element</NekoTypo>
      <NekoFinder>
        <NekoFinderItem icon="gallery" title="Module" />
        <NekoFinderItem
          title="France"
          showRightElement={true}
          rightElement={<NekoButton onClick={action('onClick')}>Primary</NekoButton>}
        >
          <NekoFinderItem
            title="Gironde"
            showRightElement={false}
            rightElement={<NekoButton onClick={action('onClick')}>Primary</NekoButton>}
          >
            <NekoFinderItem icon="gallery" title="Arcachon" />
            <NekoFinderItem title="Memories" />
          </NekoFinderItem>
        </NekoFinderItem>
        <NekoFinderItem icon={flowerIcon} title="Personalized">
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '116px' }} onMouseEnter={handleHover} onMouseLeave={handleHoverOut}>
            {[...Array(8)].map((_, i) => (
              <img key={i} style={{ marginRight: '4px', marginBottom: '4px' }} src="https://via.placeholder.com/25" />
            ))}
            {hovered && <div style={{ position: 'absolute', top: 0, left: 0 }}>Hovering</div>}
          </div>
        </NekoFinderItem>
      </NekoFinder>

      <NekoSpacer />

      <NekoTypo h3>Selected Finder Item</NekoTypo>
      <NekoFinder>
        <NekoFinderItem icon="gallery" title="Module" selected={true} />
        <NekoFinderItem
          title="France"
          rightElement={<NekoButton onClick={action('onClick')}>Primary</NekoButton>}
          showRightElement={true}
        >
          <NekoFinderItem title="Gironde" rightElement={<NekoButton onClick={action('onClick')}>Primary</NekoButton>} showRightElement={false}>
            <NekoFinderItem icon="gallery" title="Arcachon" />
            <NekoFinderItem title="Memories" />
          </NekoFinderItem>
        </NekoFinderItem>
        <NekoFinderItem icon={flowerIcon} title="Personalized">
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '116px' }} onMouseEnter={handleHover} onMouseLeave={handleHover}>
            {[...Array(8)].map((_, i) => (
              <img key={i} style={{ marginRight: '4px', marginBottom: '4px' }} src="https://via.placeholder.com/25" />
            ))}
            {hovered && <div style={{ position: 'absolute', top: 0, left: 0 }}>Hovering</div>}
          </div>
        </NekoFinderItem>
      </NekoFinder>

      <NekoSpacer />

      <NekoTypo h3>Right Actions</NekoTypo>
      <NekoFinder>
        <NekoFinderItem icon="gallery" title="Module" />
        <NekoFinderItem
          title="France"
          rightAction={<NekoTypo>show always</NekoTypo>}
        >
          <NekoFinderItem title="Gironde">
            <NekoFinderItem icon="gallery" title="Arcachon" />
            <NekoFinderItem title="Memories" />
          </NekoFinderItem>
        </NekoFinderItem>
        <NekoFinderItem icon={flowerIcon} title="Personalized">
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '116px' }} onMouseEnter={handleHover} onMouseLeave={handleHover}>
            {[...Array(8)].map((_, i) => (
              <img key={i} style={{ marginRight: '4px', marginBottom: '4px' }} src="https://via.placeholder.com/25" />
            ))}
            {hovered && <div style={{ position: 'absolute', top: 0, left: 0 }}>Hovering</div>}
          </div>
        </NekoFinderItem>
      </NekoFinder>
    </>
  );
};