
export default function userStatusHandlers(socket, io) {
  socket.on("user_connected", async ({ email, name }) => {
    try {
      io.emit("connection_successful", { email, name });
    } catch (err) {
      console.error("DB error while connecting user:", err);
       // Emit error to the same socket
       socket.emit("connection_failed", {
        message: "Failed to connect user",
        error: err.message,
      });
    }
  });
}
