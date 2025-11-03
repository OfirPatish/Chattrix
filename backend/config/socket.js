import { Server } from "socket.io";
import { socketCorsOptions } from "./cors.js";

export const createSocketServer = (httpServer) => {
  return new Server(httpServer, {
    cors: socketCorsOptions,
  });
};
