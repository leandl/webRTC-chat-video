import { useParams } from "react-router-dom"
import { useRoom } from "../../contexts/room-context";
import { useEffect } from "react";
import { SOCKET_EVENTS } from "../../config/socket-events";

type RoomParams = {
  roomId: string;
}


export function Room() {
  const params = useParams<RoomParams>();
  const { socket } = useRoom();

  useEffect(() => {
    socket?.emit(SOCKET_EVENTS.ROOM.JOIN, {
      roomId: params.roomId
    })
  }, [params.roomId])

  return (
    <>Room id: {params.roomId}</>
  )
}