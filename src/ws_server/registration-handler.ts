import { userDB } from './user-bd';
import { wsSend } from './utility';
import { rooms } from './rooms/rooms';
import { wss } from '.';
import { CustomWebSocket, UserData } from './types';

export const handleRegistration = (data: UserData, ws: CustomWebSocket) => {
  const user = userDB.registerUser(data);
  ws.id = user.index;
  wsSend(ws, 'reg', user);

  wss.clients.forEach((client: CustomWebSocket) => {
    if (client.readyState === client.OPEN) {
      wsSend(client, 'update_room', rooms.getAvailableRooms(client.id));
    }
  });
};
