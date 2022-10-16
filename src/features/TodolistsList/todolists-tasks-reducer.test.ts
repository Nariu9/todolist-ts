import {TodolistDomainType} from './Todolist/todolists-reducer';
import {TasksStateType} from './Todolist/Task/tasks-reducer';
import {tasksReducer} from './Todolist/Task';
import {todolistsActions, todolistsReducer} from './Todolist';

const {addTodolist} = todolistsActions

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: TodolistDomainType[] = [];

    const todolist = {id: '1', title: 'new todolist', filter: 'all', addedDate: '', order: 0}

    const action = addTodolist.fulfilled({todolist}, 'requiredId', 'new todolist');

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});

