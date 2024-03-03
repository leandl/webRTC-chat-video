declare module "socket-events" {
  type CreatedRoom = {
    roomId: string;
  };

  type UserJoined = {
    peerId: string;
  };
}
