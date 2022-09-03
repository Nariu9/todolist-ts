import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {ReduxStoreProviderDecorator} from './decorators/ReduxStoreProviderDecorator';
import {Todolist} from '../features/TodolistsList/Todolist/Todolist';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolists/Todolist',
    component: Todolist,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof Todolist>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Todolist> = (args) => <Todolist {...args}/>;

export const TodolistStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TodolistStory.args = {
    todolist: {
        id: 'todolistID_1',
        title: 'What to learn',
        filter: 'all',
        addedDate: '',
        order: 0,
        entityStatus: 'idle'
    },
    demo: true
}