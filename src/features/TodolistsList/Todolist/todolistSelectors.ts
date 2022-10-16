import {TodolistDomainType} from './todolists-reducer';
import {RootStateType} from '../../Application/AppTypes';

export const selectTodolists = (state: RootStateType):TodolistDomainType[] => state.todolists