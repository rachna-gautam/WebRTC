import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    socketId: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["online", "offline"], // Defining the possible statuses
        default: "offline", // Default value is "offline"
      },      
    lastSeen: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String,
        default: null,
    },
},{ timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;