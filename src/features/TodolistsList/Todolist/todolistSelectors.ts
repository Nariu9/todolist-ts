import {RootStateType} from '../../../app/store';
import {TodolistDomainType} from './todolists-reducer';

export const selectTodolists = (state: RootStateType):TodolistDomainType[] => state.todolists