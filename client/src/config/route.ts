export const ROUTE = {
  HOME: "/",
  ROOM: "/room/:roomId",
};

function replacePath(url: string, params: Record<string, string>) {
  return Object.keys(params).reduce(
    (acc, param) => acc.replace(`:${param}`, params[param]),
    url
  );
}

export const DYNAMIC_ROUTE = {
  ROOM: (roomId: string) => replacePath(ROUTE.ROOM, { roomId }),
};
