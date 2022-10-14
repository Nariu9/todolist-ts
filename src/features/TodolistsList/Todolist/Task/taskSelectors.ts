import {RootStateType} from '../../../../app/store';
import {TaskDomainType} from './tasks-reducer';

export const selectTasks = (todolistId: string) => (state: RootStateType): TaskDomainType[] => state.tasks[todolistId]