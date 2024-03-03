import { useEffect, useRef } from "react"
import "./video-player.styles.scss"

type VideoPlayer2 = {
  stream: MediaStream;
}


export function VideoPlayer2({ stream }: VideoPlayer2) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return
    }

    videoRef.current.srcObject = stream
  }, [stream])

  return (
    <div className="video-player">
      <video ref={videoRef} autoPlay muted />
    </div>
  )
}