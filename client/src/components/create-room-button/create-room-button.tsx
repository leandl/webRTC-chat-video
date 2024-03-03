import { SOCKET_EVENTS } from "../../config/socket-events";
import { useRoom } from "../../contexts/room-context"
import { Button } from "../button/button";


export function CreateButton() {

  const { socket } = useRoom();

  function createRoom() {
    socket?.emit(SOCKET_EVENTS.ROOM.CREATE);
  }

  return (
    <Button onClick={createRoom} >
      Iniciar Sala
    </Button>
  )
}