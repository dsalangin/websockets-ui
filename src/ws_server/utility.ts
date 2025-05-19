import { EOL } from 'os';
import { WebSocket } from 'ws';
import { CustomWebSocket } from './types';

export const wsSend = (
  ws: WebSocket | CustomWebSocket,
  type: string,
  data: unknown,
) => {
  const answer = {
    type,
    data: JSON.stringify(data),
    id: 0,
  };

  const jsonAnswer = JSON.stringify(answer);

  showMessage('Outgoing message', jsonAnswer);

  ws.send(jsonAnswer);
};

export const showMessage = (type: string, message: string) => {
  console.log(`${type}:${EOL}${message}${EOL}`);
};
