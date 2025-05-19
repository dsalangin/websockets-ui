import { WebSocket } from 'ws';
import { handleRegistration } from './registration-handler';
import { showMessage, wsSend } from './utility';
import { createRoom } from './rooms/createRoom';
import { addUserToRoom } from './rooms/addUserToRoom';
import { addShips } from './addShips';
import type { WebSocketMessageData } from './types';
import { handleAttack } from './attack-handler';

export const handleClientData = (
  message: WebSocketMessageData,
  ws: WebSocket,
) => {
  try {
    showMessage('Incoming message', message.toString());

    const objMessage = JSON.parse(message.toString());

    if (!objMessage.hasOwnProperty('type')) {
      throw new Error('Property type not found');
    }

    const { type } = objMessage;
    const data = objMessage.data ? JSON.parse(objMessage.data) : '';

    switch (type) {
      case 'reg':
        handleRegistration(data, ws);
        break;

      case 'create_room':
        createRoom();
        break;

      case 'add_user_to_room':
        addUserToRoom(data, ws);
        break;

      case 'add_ships':
        addShips(data);
        break;

      case 'attack':
        handleAttack(data);
        break;

      default:
        throw new Error(`Invalid type ${type}`);
    }
  } catch (err) {
    console.log(err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const data = {
      name: '',
      index: '',
      error: true,
      errorText: errorMessage,
    };

    wsSend(ws, 'err', data);
  }
};
