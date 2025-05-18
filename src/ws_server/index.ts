import { WebSocketServer } from 'ws';
import { handleClientData } from './client-data-handler';

const PORT = 3000;

export const wss = new WebSocketServer({ port: PORT });

export const startWss = () => {
  wss.on('connection', (ws) => {
    log('New connection');

    ws.on('message', (data) => {
      handleClientData(data, ws);
    });

    ws.on('close', () => {
      log('Connection close');
    });
  });
};
