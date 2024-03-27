import { create } from "zustand";
import io, { Socket } from 'socket.io-client';
import Cookies from "js-cookie";

const userCookie = Cookies.get("jwttoken");

interface SocketState {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  connect: (role: string) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  setSocket: (socket: any) => set({ socket }),
  connect: (role : string) =>
    set((state) => {
      if (state.socket == null) {
        const newSocket = io("http://localhost:4000");
        newSocket.emit("userConnection", { userCookie, role: role });
        return { socket: newSocket };  // Return the new state
      }
      return {};  // Return an empty object if the socket is not null
    }),
  disconnect: () =>
    set((state) => {
      if (state.socket != null) {
        state.socket.disconnect();
        return { socket: null };  // Return the new state
      }
      return {};  // Return an empty object if the socket is null
    }),
}));