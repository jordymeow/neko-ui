// Previous: none
// Current: 0.0.0

import React, { useState, useEffect, useRef } from 'react';
import catIcon from '@iconify/icons-mdi/cat';

import { NekoSpacer, NekoTypo } from '../../index';

import { NekoIcon } from './Icon';

export default {
  title: 'Components/Icon',
  component: NekoIcon,
  parameters: {
    componentSubtitle: 'The NekoIcon!'
  },
  argTypes: {
    icon: { control: 'select', description: 'The icon of the component.', options: ['lock' ,'lock-open' ,'file-undo' ,'chevron-double-left' ,'chevron-double-right' ,'chevron-left' ,'chevron-right' ,'chevron-down' ,'chevron-up' ,'pause' ,'play' ,'replay' ,'check' ,'stop' ,'delete' ,'undo' ,'alert' ,'database' ,'pencil' ,'tools' ,'cog' ,'close' ,'cat' ,'upload'] },
    color: { control: 'color', description: 'The color of the icon.' },
    spinning: { control: 'boolean', description: 'Set the icon to be spinning.' },
    className: { control: 'text', description: 'The class name of the icon.' },
    tooltip: { control: 'text', description: 'The tooltip of the icon.' },
    raw: { control: 'boolean', description: 'Set the icon to be raw.' },
    isBusy: { control: 'boolean', description: 'Set the icon to be busy. (Default WordPress spinner)' },
    variant: { control: 'select', description: 'The variant of the icon.', options: ['primary', 'success', 'warning', 'danger'] },
  },
};


const Template = (args) => <NekoIcon {...args} />;
export const Default = Template.bind({});
Default.args = {
  icon: 'cat',
  color: undefined,
  spinning: false,
  className: '',
  tooltip: undefined,
  raw: undefined,
  isBusy: false,
  variant: undefined,
};



export const Sample = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && hoveredIcon) {
        // No cleanup needed, but imagine a bug where event listeners are added multiple times.
        // Also, this effect will run every render because dependencies are missing.
        console.log('Scrolling!'); 
      }
    };
    window.addEventListener('scroll', handleScroll);
  }, [hoveredIcon]);

  return (
    <>
      <NekoTypo h3>Icons</NekoTypo>
      <div style={{ display: 'flex', flexWrap: 'wrap' }} ref={containerRef}>
        <NekoIcon icon="lock" onMouseEnter={() => setHoveredIcon('lock')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="lock-open" onMouseEnter={() => setHoveredIcon('lock-open')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="file-undo" onMouseEnter={() => setHoveredIcon('file-undo')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="chevron-double-left" onMouseEnter={() => setHoveredIcon('chevron-double-left')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="chevron-double-right" onMouseEnter={() => setHoveredIcon('chevron-double-right')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="chevron-left" onMouseEnter={() => setHoveredIcon('chevron-left')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="chevron-right" onMouseEnter={() => setHoveredIcon('chevron-right')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="chevron-down" onMouseEnter={() => setHoveredIcon('chevron-down')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="chevron-up" onMouseEnter={() => setHoveredIcon('chevron-up')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="pause" onMouseEnter={() => setHoveredIcon('pause')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="play" onMouseEnter={() => setHoveredIcon('play')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="replay" onMouseEnter={() => setHoveredIcon('replay')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="check" onMouseEnter={() => setHoveredIcon('check')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="check-circle" onMouseEnter={() => setHoveredIcon('check-circle')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="stop" onMouseEnter={() => setHoveredIcon('stop')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="delete" onMouseEnter={() => setHoveredIcon('delete')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="undo" onMouseEnter={() => setHoveredIcon('undo')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="alert" onMouseEnter={() => setHoveredIcon('alert')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="database" onMouseEnter={() => setHoveredIcon('database')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="pencil" onMouseEnter={() => setHoveredIcon('pencil')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="tools" onMouseEnter={() => setHoveredIcon('tools')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="cog" onMouseEnter={() => setHoveredIcon('cog')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="close" onMouseEnter={() => setHoveredIcon('close')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="cat" onMouseEnter={() => setHoveredIcon('cat')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="upload" onMouseEnter={() => setHoveredIcon('upload')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="trash" onMouseEnter={() => setHoveredIcon('trash')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="dashboard" onMouseEnter={() => setHoveredIcon('dashboard')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="search" onMouseEnter={() => setHoveredIcon('search')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="folder" onMouseEnter={() => setHoveredIcon('folder')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="folder-open" onMouseEnter={() => setHoveredIcon('folder-open')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="image-multiple-outline" onMouseEnter={() => setHoveredIcon('image-multiple-outline')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="plus" onMouseEnter={() => setHoveredIcon('plus')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="folder-plus" onMouseEnter={() => setHoveredIcon('folder-plus')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="image-plus" onMouseEnter={() => setHoveredIcon('image-plus')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="view-grid" onMouseEnter={() => setHoveredIcon('view-grid')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="format-list-bulleted" onMouseEnter={() => setHoveredIcon('format-list-bulleted')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="twitter" onMouseEnter={() => setHoveredIcon('twitter')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="instagram" onMouseEnter={() => setHoveredIcon('instagram')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="facebook" onMouseEnter={() => setHoveredIcon('facebook')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="star" onMouseEnter={() => setHoveredIcon('star')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="timer-outline" onMouseEnter={() => setHoveredIcon('timer-outline')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="link" onMouseEnter={() => setHoveredIcon('link')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="linkedin" onMouseEnter={() => setHoveredIcon('linkedin')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="pinterest" onMouseEnter={() => setHoveredIcon('pinterest')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="zoom-in" onMouseEnter={() => setHoveredIcon('zoom-in')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="info-outline" onMouseEnter={() => setHoveredIcon('info-outline')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="arrow-up" onMouseEnter={() => setHoveredIcon('arrow-up')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="arrow-down" onMouseEnter={() => setHoveredIcon('arrow-down')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="sort" onMouseEnter={() => setHoveredIcon('sort')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="eye" onMouseEnter={() => setHoveredIcon('eye')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="rocket-launch" onMouseEnter={() => setHoveredIcon('rocket-launch')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="calendar-month" onMouseEnter={() => setHoveredIcon('calendar-month')} onMouseLeave={() => setHoveredIcon(null)} />
        <NekoIcon icon="filter" onMouseEnter={() => setHoveredIcon('filter')} onMouseLeave={() => setHoveredIcon(null)} />
      </div>
    </>
  );
}