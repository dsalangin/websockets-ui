import { rooms } from './rooms';
import { wsSend } from '../utility';
import { wss } from '..';
import { CustomWebSocket } from '../types';

export const createRoom = () => {
  rooms.create();

  wss.clients.forEach((client: CustomWebSocket) => {
    if (client.readyState === client.OPEN) {
      wsSend(client, 'update_room', rooms.getAvailableRooms(client.id));
    }
  });
};
