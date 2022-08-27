import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Task} from '../features/TodolistsList/Todolist/Task/Task';
import {ReduxStoreProviderDecorator} from './decorators/ReduxStoreProviderDecorator';
import {useSelector} from 'react-redux';
import {AppRootStateType} from '../app/store';
import {TaskPriorities, TaskStatuses, TaskType} from '../api/todolists-api';


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolists/Task',
    component: Task,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Task> = (args) => <Task {...args}/>;

export const TaskIsDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsDoneStory.args = {
    task: {
        id: '1', title: 'JS', description: '',
        todoListId: 'todolistID_1',
        status: TaskStatuses.Completed,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        addedDate: ''
    },
    todolistId: 'todolistID_1'
}

export const TaskIsNotDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsNotDoneStory.args = {
    task: {
        id: '2', title: 'Honey', description: '',
        todoListId: 'todolistID_2',
        status: TaskStatuses.New,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        addedDate: ''
    },
    todolistId: 'todolistID_2'
}

const TaskWithRedux = () => {
    const task = useSelector<AppRootStateType, TaskType>(state => state.tasks['todolistID_1'][0])
    return <Task task={task} todolistId={'todolistID_1'}/>
}
const Template1: ComponentStory<typeof TaskWithRedux> = () => {
    return <TaskWithRedux/>
};
export const TaskWithReduxStory = Template1.bind({});
