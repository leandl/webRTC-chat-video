import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

import { SOCKET_EVENTS } from "../socket-events";
import { JoinRoom } from "../types/socket-events";

const rooms: Record<string, Set<string>> = {};

export function roomHandler(socket: Socket) {
  function createRoom() {
    const roomId = uuidV4();
    rooms[roomId] = new Set<string>();

    socket.emit(SOCKET_EVENTS.ROOM.CREATED, {
      roomId,
    });
    console.log("user created the room");
  }

  function leaveRoom({ roomId, peerId }: JoinRoom) {
    console.log("user left the room", roomId, peerId);

    if (!rooms[roomId]) {
      return;
    }

    rooms[roomId].delete(peerId);
    socket.to(roomId).emit(SOCKET_EVENTS.ROOM.USER_DISCONNECTED, peerId);
  }

  function joinRoom({ roomId, peerId }: JoinRoom) {
    console.log(`user join the room: ${roomId}, peer: ${peerId}`);

    if (!rooms[roomId]) {
      return;
    }

    rooms[roomId].add(peerId);
    console.log(SOCKET_EVENTS.ROOM.USER_JOINED);
    socket.broadcast
      .to(roomId)
      .emit(SOCKET_EVENTS.ROOM.USER_JOINED, { peerId });
    socket.emit(SOCKET_EVENTS.ROOM.GET_USERS, {
      roomId,
      participants: Array.from(rooms[roomId]),
    });

    socket.on("disconnect", () => leaveRoom({ roomId, peerId }));
  }

  socket.on(SOCKET_EVENTS.ROOM.CREATE, createRoom);
  socket.on(SOCKET_EVENTS.ROOM.JOIN, joinRoom);
}
