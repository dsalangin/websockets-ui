import { WebSocket } from 'ws';

export const wsSend = (
  ws: WebSocket,
  type: string,
  data: Record<string, unknown>,
) => {
  const answer = {
    type,
    data: JSON.stringify(data),
    id: 0,
  };

  ws.send(JSON.stringify(answer));
};
