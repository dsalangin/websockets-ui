import { WebSocket } from 'ws';

export type CustomWebSocket = WebSocket & { id?: string };

export type Position = {
  x: number;
  y: number;
};

export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export type Ship = {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
};

export type Game = {
  id: number | string;
  players: {
    [key: string]: Player;
  };
  currentPlayer: number | string;
};

export type Player = {
  ships: Ship[];
  attacks: Position[];
  ws: CustomWebSocket;
  shipPositions: Record<string, Ship>;
};

export type ShipsData = {
  gameId: number | string;
  ships: Ship[];
  indexPlayer: number | string;
};

export type WebSocketMessageData = Buffer | ArrayBuffer | Buffer[];

export type Attack = {
  gameId: number | string;
  x: number;
  y: number;
  indexPlayer: number | string;
};

type RegUserDataWithWs = RegUserData & { ws: CustomWebSocket };

export type RoomType = {
  roomId: number | string;
  roomUsers: RegUserData[];
};

export type RoomTypeWithWs = {
  roomId: number | string;
  roomUsers: RegUserDataWithWs[];
};

export type User = {
  name: string;
  password: string;
  index: string;
};

export type UserData = {
  name: string;
  password: string;
};

export type RegUserData = {
  name: string;
  index: string;
};

export type Winners = {
  name: string;
  wins: number;
};
