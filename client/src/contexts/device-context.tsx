import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { createObserver } from "../utils/createObserver";


type DeviceContextInterface = {
  activeAudio: boolean;
  activeVideo: boolean;
}


type DeviceProviderProps = {
  children: ReactNode;
}


export const onlyAudioObserver = createObserver<MediaStream>();
export const videoObserver = createObserver<MediaStream>();

export const DeviceContext = createContext({} as DeviceContextInterface);
export const DeviceProvider = ({ children }: DeviceProviderProps) => {
  const [activeAudio, _setActiveAudio] = useState<boolean>(true);
  const [activeVideo, _setActiveVideo] = useState<boolean>(true);

  useEffect(() => {
    const observerMediaStream = !activeVideo ? onlyAudioObserver : videoObserver;

    try {
      navigator.mediaDevices.getUserMedia({
        audio: activeAudio,
        video: activeVideo
      }).then(observerMediaStream.publish)
    } catch (error) {
      console.error(error)
    }


  }, [activeAudio, activeVideo])

  return (
    <DeviceContext.Provider value={{
      activeAudio,
      activeVideo
    }}>
      {children}
    </DeviceContext.Provider>
  );
};

export function useDevice() {
  return useContext(DeviceContext)
}