import { randomUUID } from 'crypto';
import type {
  CustomWebSocket,
  RegUserData,
  RoomType,
  RoomTypeWithWs,
} from '../types';

class Rooms {
  private rooms: RoomTypeWithWs[] = [];

  create() {
    this.rooms.push({
      roomId: randomUUID().toString(),
      roomUsers: [],
    });
  }

  getAvailableRooms(userId?: string): RoomType[] {
    const rooms = [...this.rooms].map((room) => ({
      roomId: room.roomId,
      roomUsers: room.roomUsers.map((user) => ({
        name: user.name,
        index: user.index,
      })),
    }));

    if (!userId) {
      return rooms.filter((room) => room.roomUsers.length < 2);
    }

    return rooms.filter(
      (room) =>
        room.roomUsers.length < 2 && room.roomUsers[0]?.index !== userId,
    );
  }

  addUserToRoom(
    indexRoom: string,
    userData: RegUserData,
    ws: CustomWebSocket,
  ): RoomTypeWithWs {
    const room = this.rooms.find((room) => room.roomId === indexRoom);

    if (!room) {
      throw new Error(`Room with ${indexRoom} id not exsist`);
    }

    room?.roomUsers.push({ ...userData, ws });

    return room;
  }
}

export const rooms = new Rooms();
