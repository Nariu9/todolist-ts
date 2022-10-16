import {TaskDomainType} from './tasks-reducer';
import {RootStateType} from '../../../Application/AppTypes';

export const selectTasks = (todolistId: string) => (state: RootStateType): TaskDomainType[] => state.tasks[todolistId]