import { useEffect, useRef } from "react"
import { videoObserver } from "../../contexts/device-context";

import "./video-player.styles.scss"


export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => videoObserver.subscribe(stream => {
    if (!videoRef.current) {
      return
    }

    videoRef.current.srcObject = stream
  }), [])

  return (
    <div className="video-player">
      <video ref={videoRef} autoPlay muted />
    </div>
  )
}