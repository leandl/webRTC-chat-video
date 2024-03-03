import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

import { SOCKET_EVENTS } from "../socket-events";
import { JoinRoom } from "../types/socket-events";

export function roomHandler(socket: Socket) {
  function createRoom() {
    const roomId = uuidV4();
    socket.join(roomId);

    socket.emit(SOCKET_EVENTS.ROOM.CREATED, {
      roomId,
    });
    console.log("user created the room");
  }

  function joinRoom({ roomId }: JoinRoom) {
    console.log(`user join the room: ${roomId}`);
  }

  socket.on(SOCKET_EVENTS.ROOM.CREATE, createRoom);
  socket.on(SOCKET_EVENTS.ROOM.JOIN, joinRoom);
}
