import { games } from './games';
import type { Ship, ShipsData } from './types';

export const addShips = (data: ShipsData) => {
  games.addShips(data);
};
