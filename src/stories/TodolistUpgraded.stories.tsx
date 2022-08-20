import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {ReduxStoreProviderDecorator} from './decorators/ReduxStoreProviderDecorator';
import {TodolistUpgraded} from '../TodolistUpgraded';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolists/TodolistUpgraded',
    component: TodolistUpgraded,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof TodolistUpgraded>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TodolistUpgraded> = (args) => <TodolistUpgraded {...args}/>;

export const TodolistUpgradedStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TodolistUpgradedStory.args = {
    title: 'What to learn',
    filter: 'all',
    todolistId: 'todolistID_1'
}

