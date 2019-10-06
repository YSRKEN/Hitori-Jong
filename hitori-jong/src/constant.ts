export type ActionType = 'setApplicationMode';
export type ApplicationMode = 'StartForm' | 'GameForm';

export interface Action {
  type: ActionType;
  message: string;
}
