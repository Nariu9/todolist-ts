import {Provider} from 'react-redux';
import {AppRootStateType} from '../../state/store';
import {combineReducers, legacy_createStore} from 'redux';
import {tasksReducer} from '../../state/tasks-reducer';
import {todolistsReducer} from '../../state/todolists-reducer';
import {colorThemesReducer} from '../../state/colorThemes-reducer';
import {v1} from 'uuid';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    colorThemes: colorThemesReducer
})

const initialState = {
    tasks: {
        ['todolistID_1']: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
            {id: v1(), title: 'Redux', isDone: false}
        ],
        ['todolistID_2']: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'Bread', isDone: true},
            {id: v1(), title: 'Honey', isDone: false},
            {id: v1(), title: 'Butter', isDone: false}
        ]
    },
    todolists: [
        {id: 'todolistID_1', title: 'What to learn', filter: 'All'},
        {id: 'todolistID_2', title: 'What to buy', filter: 'All'},
    ],
    colorThemes: {
        colorTheme: 'light'
    }
}

export const storyBookStore = legacy_createStore(rootReducer, initialState as AppRootStateType)

export const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

/*
export const ReduxStoreProviderDecorator = (StoryFn: React.ElementType) => {
    return <Provider store={store}><StoryFn/></Provider>
}*/