import { rooms } from './rooms';
import { wsSend } from '../utility';
import { userDB } from '../user-bd';
import { wss } from '..';
import { games } from '../games';
import type { CustomWebSocket } from '../types';

export const addUserToRoom = (
  { indexRoom }: { indexRoom: string },
  ws: CustomWebSocket,
) => {
  const userId = ws.id;

  if (!userId) {
    return;
  }

  const user = userDB.getUser(userId);
  const room = rooms.addUserToRoom(indexRoom, user, ws);

  if (room?.roomUsers.length === 2) {
    const players: { index: string; ws: CustomWebSocket }[] = [];

    room.roomUsers.forEach((user) => {
      players.push({ index: user.index, ws: user.ws });
      wsSend(user.ws, 'create_game', {
        idGame: room.roomId,
        idPlayer: user.index,
      });
    });

    games.createGame({
      gameId: indexRoom,
      players,
    });
  }

  wss.clients.forEach((client: CustomWebSocket) => {
    if (client.readyState === client.OPEN) {
      wsSend(client, 'update_room', rooms.getAvailableRooms(client.id));
    }
  });
};
