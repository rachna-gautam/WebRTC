import callHandlers from "./callHandler.js";
import chatHandlers from "./chatHandlers.js";
import userStatusHandlers from "./userStatusHandlers.js";


export function registerSocketHandlers(socket, io) {
  callHandlers(socket, io);
  chatHandlers(socket, io);
  userStatusHandlers(socket, io);
}
