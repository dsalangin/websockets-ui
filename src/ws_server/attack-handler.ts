import { games } from './games';
import type { Attack } from './types';

export const handleAttack = (data: Attack) => {
  games.attack(data);
};
