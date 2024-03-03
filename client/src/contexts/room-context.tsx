import { ReactNode, createContext, useContext, useEffect, useReducer, useState } from "react";
import SocketIOClient, { Socket } from "socket.io-client"
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";


import { SOCKET_EVENTS } from "../config/socket-events";

import SocketEvents from "socket-events"
import { useNavigate } from "react-router-dom";
import { DYNAMIC_ROUTE } from "../config/route";
import { onlyAudioObserver, videoObserver } from "./device-context";
import { PeerState, peerRecuder } from "./peerRecucer";
import { addPeerAction } from "./peerActions";

type RoomContextInterface = {
  socket: Socket | null;
  peer: Peer | null;
  peers: PeerState
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
  const [me, setMe] = useState<Peer | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [peers, dispatch] = useReducer(peerRecuder, {})
  const navigate = useNavigate();

  function enterRoom({ roomId }: SocketEvents.CreatedRoom) {
    const roomURL = DYNAMIC_ROUTE.ROOM(roomId);
    navigate(roomURL)
  }

  function getUsers({ participants }: { participants: string[] }) {
    console.log(participants)
  }


  useEffect(() => {
    const meId = uuidV4();
    const mePeer = new Peer(meId, {
      host: SERVER_HOST,
      port: 9090,
      path: "/myapp"
    })
    setMe(mePeer)

    webSocket.on(SOCKET_EVENTS.ROOM.CREATED, enterRoom)
    webSocket.on(SOCKET_EVENTS.ROOM.GET_USERS, getUsers)

    const unsubscribeVideo = videoObserver.subscribe(setStream)
    const unsubscribeAudio = onlyAudioObserver.subscribe(setStream)
    return () => {
      webSocket.off(SOCKET_EVENTS.ROOM.CREATED, enterRoom)
      webSocket.on(SOCKET_EVENTS.ROOM.GET_USERS, getUsers)

      unsubscribeVideo()
      unsubscribeAudio()
    }
  }, []);



  useEffect(() => {
    if (!me || !stream) {
      return;
    }

    function handleUserJoined({ peerId }: SocketEvents.UserJoined) {
      console.log("Oi", peerId)
      const call = me!.call(peerId, stream!)
      call.on("stream", () => {
        dispatch(addPeerAction(peerId, stream!))
      })
    }

    me.on("call", (call) => {
      call.answer(stream)
      call.on("stream", () => {
        dispatch(addPeerAction(call.peer, stream))
      })
    })

    webSocket.on(SOCKET_EVENTS.ROOM.USER_JOINED, handleUserJoined)
    return () => {
      webSocket.off(SOCKET_EVENTS.ROOM.USER_JOINED, handleUserJoined)
    }
  }, [me, stream])

  return (
    <RoomContext.Provider value={{ socket: webSocket, peer: me, peers }}>
      {children}
    </RoomContext.Provider>
  );
};


export function useRoom() {
  return useContext(RoomContext)
}