import { WebSocket } from 'ws';
import { userDB, type UserData } from './user-bd';
import { wsSend } from './utilite';

export const handleRegistration = (data: UserData, ws: WebSocket) => {
  const user = userDB.registerUser(data);
  wsSend(ws, 'reg', user);
};
