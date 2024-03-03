import { EventPeer } from "./peerActions";

export type PeerState = Record<string, { stream: MediaStream }>;
export type PeerAction =
  | {
      type: EventPeer.ADD;
      payload: { peerId: string; stream: MediaStream };
    }
  | {
      type: EventPeer.REMOVE;
      payload: { peerId: string };
    };

export function peerRecuder(state: PeerState, action: PeerAction): PeerState {
  if (action.type === EventPeer.ADD) {
    return {
      ...state,
      [action.payload.peerId]: { stream: action.payload.stream },
    };
  }

  if (action.type === EventPeer.REMOVE) {
    const { [action.payload.peerId]: _deleted, ...rest } = state;
    return rest;
  }

  return state;
}
