import { useParams } from "react-router-dom"
import { useRoom } from "../../contexts/room-context";
import { useEffect } from "react";
import { SOCKET_EVENTS } from "../../config/socket-events";
import { VideoPlayer } from "../../components/video-player/video-player";

import "./room.styles.scss"
import { VideoPlayer2 } from "../../components/video-player/video-player2";

type RoomParams = {
  roomId: string;
}

function getBreakPoint(numberElements: number) {
  if (numberElements === 1) {
    return 1;
  }

  if (numberElements <= 4) {
    return 2;
  }

  if (numberElements <= 6 || numberElements === 9) {
    return 3;
  }

  return 4;
}


export function Room() {
  const params = useParams<RoomParams>();
  const { socket, peer, peers } = useRoom();

  useEffect(() => {
    if (!socket || !peer) {
      return;
    }

    socket.emit(SOCKET_EVENTS.ROOM.JOIN, {
      roomId: params.roomId,
      peerId: peer.id
    })
  }, [params.roomId, socket, peer]);

  const n = Object.keys(peers).length

  const breakPoint = getBreakPoint(n);
  const contentClassName = `content element-${breakPoint}`


  return (
    <div className="page-room">
      <p>Room id: {params.roomId}</p>

      <div className={contentClassName}>
        <div className="child">
          <VideoPlayer />
        </div>

        {Object.entries(peers).map(([peerId, peer]) => (
          <div className="child" key={peerId}>
            <VideoPlayer2 stream={peer.stream} />
          </div>
        ))}
      </div>
    </div>
  )
}