import { WebSocketServer } from 'ws';
import { handleClientData } from './client-data-handler';

const PORT = 3000;

export const wss = new WebSocketServer({ port: PORT });

export const startWss = () => {
  wss.on('connection', (ws) => {
    console.log('New connection');

    ws.on('message', (message) => {
      handleClientData(message, ws);
    });

    ws.on('close', () => {
      console.log('Connection close');
    });
  });
};
