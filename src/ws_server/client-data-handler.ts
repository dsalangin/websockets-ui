import { WebSocket } from 'ws';
import { handleRegistration } from './registration-handler ';
import { wsSend } from './utilite';

type WebSocketMessageData = Buffer | ArrayBuffer | Buffer[];

export const handleClientData = (data: WebSocketMessageData, ws: WebSocket) => {
  try {
    const objData = JSON.parse(data.toString());

    if (objData.hasOwnProperty('type') && objData.type === 'reg') {
      handleRegistration(JSON.parse(objData.data), ws);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const data = {
      name: '',
      index: '',
      error: true,
      errorText: errorMessage,
    };

    wsSend(ws, 'reg', data);
  }
};
