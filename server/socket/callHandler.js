import User from "../models/UserSchema.js";

export default function callHandlers(socket, io) {
  socket.on("call_user", async ({ from, to }) => {
    console.log("call_user event", from, to)
    const receiver = await User.findOne({ email: to });
    const caller = await User.findOne({ email: from })
    if (receiver?.socketId && receiver.status === "online") {
      io.to(receiver.socketId).emit("incoming_call", { from, image: caller.image, name: caller.name });
    }
  });
  socket.on("call_accept", async ({ from, to }) => {
    const caller = await User.findOne({ email: to })
    if (caller?.socketId && caller.status === "online") {
      io.to(caller.socketId).emit("call:accepted", { from });
    }
  })

  
}
