import {AppDispatch, RootState} from './store';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch
