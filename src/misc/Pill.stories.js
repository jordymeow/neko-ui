// Previous: none
// Current: 0.0.0

import React from 'react';

import { NekoTypo } from '../../index';

import { NekoPill } from './Pill';

export default {
    title: 'Components/Pill',
    component: NekoPill,
    parameters: {
        componentSubtitle: 'The NekoPill!'
    },
    argTypes: {
        className: { control: 'select', options: ['primary', 'secondary', 'danger', 'warning', 'success'], description: 'The class name of the pill.' },
        children: { description: 'Content placed inside the pill.' },
        onClick: { description: 'The function to be called when the pill is clicked.' },
        led: { control: 'boolean', description: 'The led of the pill.' },
        extender_children: { description: 'Content placed inside the extender of the pill.' },
        extender_label: { description: 'The label of the extender of the pill.' },
    },
};


const Template = ({ children, ...args }) => <NekoPill {...args}>{children}</NekoPill>;

export const Default = Template.bind({});
Default.args = {
    className: 'primary',
    children: 'Pill',
    onClick: () => { },
    led: true,
    extender_children: 'Extender',
    extender_label: 'Extender',
};

export const Sample = () => {
    return (
        <>
            <NekoTypo h3>Default</NekoTypo>
            <Default {...Default.args} />
        </>
    );
};

