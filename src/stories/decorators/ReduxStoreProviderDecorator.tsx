import {Provider} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {applyMiddleware, combineReducers, legacy_createStore} from 'redux';
import {tasksReducer} from '../../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../../features/TodolistsList/todolists-reducer';
import {colorThemesReducer} from '../../app/colorThemes-reducer';
import {v1} from 'uuid';
import {TaskPriorities, TaskStatuses} from '../../api/todolists-api';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    colorThemes: colorThemesReducer
})

const initialState: AppRootStateType = {
    tasks: {/*
        ['todolistID_1']: [
            {
                id: v1(),
                title: 'HTML&CSS',
                description: '',
                todoListId: 'todolistID_1',
                status: TaskStatuses.Completed,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: ''
            },
            {
                id: v1(),
                title: 'JS',
                description: '',
                todoListId: 'todolistID_1',
                status: TaskStatuses.Completed,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: ''
            },
            {
                id: v1(),
                title: 'ReactJS',
                description: '',
                todoListId: 'todolistID_1',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: ''
            },
            {
                id: v1(),
                title: 'Redux',
                description: '',
                todoListId: 'todolistID_1',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: ''
            }
        ],
        ['todolistID_2']: [
            {
                id: v1(),
                title: 'Milk',
                description: '',
                todoListId: 'todolistID_2',
                status: TaskStatuses.Completed,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: ''
            },
            {
                id: v1(),
                title: 'Bread',
                description: '',
                todoListId: 'todolistID_2',
                status: TaskStatuses.Completed,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: ''
            },
            {
                id: v1(),
                title: 'Honey',
                description: '',
                todoListId: 'todolistID_2',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: ''
            },
            {
                id: v1(),
                title: 'Butter',
                description: '',
                todoListId: 'todolistID_2',
                status: TaskStatuses.New,
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: ''
            }
        ]*/
    },
    todolists: [
        /*{id: 'todolistID_1', title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: 'todolistID_2', title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
    ],
    colorThemes: {
        colorTheme: 'light'
    }
}

export const storyBookStore = legacy_createStore(rootReducer, initialState, applyMiddleware(thunk))

export const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

/*
export const ReduxStoreProviderDecorator = (StoryFn: React.ElementType) => {
    return <Provider store={store}><StoryFn/></Provider>
}*/