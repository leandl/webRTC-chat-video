import { ReactNode, createContext, useContext, useEffect } from "react";
import SocketIOClient, { Socket } from "socket.io-client"
import { SOCKET_EVENTS } from "../config/socket-events";

import SocketEvents from "socket-events"
import { useNavigate } from "react-router-dom";
import { DYNAMIC_ROUTE } from "../config/route";

type RoomContextInterface = {
  socket: Socket | null;
}


type RoomProviderProps = {
  children: ReactNode;
}

const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
const SERVER_PORT = import.meta.env.VITE_SERVER_PORT;

const URL_SERVER_WEB_SOCKET = `http://${SERVER_HOST}:${SERVER_PORT}`;
const webSocket = SocketIOClient(URL_SERVER_WEB_SOCKET)


export const RoomContext = createContext({} as RoomContextInterface);
export const RoomProvider = ({ children }: RoomProviderProps) => {
  const navigate = useNavigate();

  function enterRoom({ roomId }: SocketEvents.CreatedRoom) {
    const roomURL = DYNAMIC_ROUTE.ROOM(roomId);
    navigate(roomURL)
    console.log({ roomId })
  }


  useEffect(() => {
    webSocket.on(SOCKET_EVENTS.ROOM.CREATED, enterRoom)

    return () => {
      webSocket.off(SOCKET_EVENTS.ROOM.CREATED, enterRoom)
    }
  }, [])

  return (
    <RoomContext.Provider value={{ socket: webSocket }}>
      {children}
    </RoomContext.Provider>
  );
};


export function useRoom() {
  return useContext(RoomContext)
}