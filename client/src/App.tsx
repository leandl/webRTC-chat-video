import { BrowserRouter, Route, Routes } from "react-router-dom"


import { RoomProvider } from "./contexts/room-context";
import { Home } from "./pages/home/home";
import { Room } from "./pages/room/room";
import { ROUTE } from "./config/route";


export function App() {
  return (
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          <Route path={ROUTE.HOME} element={<Home />} />
          <Route path={ROUTE.ROOM} element={<Room />} />
        </Routes>
      </RoomProvider>
    </BrowserRouter>
  );
}

