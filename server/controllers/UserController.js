import User from "../models/UserSchema.js";
import { io } from "../app.js";

// Create or update a user on initial connection
export const createUser = async (req, res) => {
  const { name, email, socketId } = req.body;

  if (!name || !email || !socketId) {
    return res
      .status(400)
      .json({ message: "Name, email, and socketId are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      user.name = name;
      user.socketId = socketId;
      user.status = "online";
      user.lastSeen = new Date();
      await user.save();
      return res.status(200).json({ message: "User updated", user });
    } else {
      const newUser = new User({
        name,
        email,
        socketId,
        status: "online",
        lastSeen: new Date(),
      });
      await newUser.save();
      //emit new user event
      // Emit to all connected clients
      io.emit("user:added", {
        id: newUser._id,
        name: newUser.name,
        image: newUser.image,
        status: newUser.status,
      });

      return res.status(201).json({ message: "User created", user: newUser });
    }
  } catch (error) {
    console.error("Error in createUser:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get a user by email
export const getUser = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getUser:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Update user socketId and status (used on reconnect, disconnect, etc.)
export const updateUser = async (req, res) => {
  const { email, name, socketId, image, status } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          ...(name && { name }),
          ...(image && { image }),
          ...(socketId && { socketId }),
          status: status || "online",
          lastSeen: new Date()
        }
      },
    );

    return res.status(200).json({ message: "User updated", user });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


//get list of all available users
export const getAllUsers = async (req, res) => {
  try {
    // Find all users but exclude the socketId field
    const users = await User.find({}, { socketId: 0 }); // { socketId: 0 } means excluding the socketId field

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
