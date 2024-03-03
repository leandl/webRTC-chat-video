export enum EventPeer {
  ADD = "ADD_PEER",
  REMOVE = "REMOVE_PEER",
}

export function addPeerAction(peerId: string, stream: MediaStream) {
  return {
    type: EventPeer.ADD,
    payload: {
      peerId,
      stream,
    },
  };
}

export function removePeerAction(peerId: string) {
  return {
    type: EventPeer.REMOVE,
    payload: {
      peerId,
    },
  };
}
