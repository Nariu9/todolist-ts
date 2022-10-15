import {AppDispatch, RootStateType} from './store';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {ActionCreatorsMapObject, bindActionCreators} from 'redux';
import {useMemo} from 'react';


export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
    const dispatch = useAppDispatch()

    return useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [actions, dispatch])
}