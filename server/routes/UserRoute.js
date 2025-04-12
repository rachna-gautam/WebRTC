import express from "express";
import {  createUser, getAllUsers, getUser, updateUser } from "../controllers/UserController.js";

const router = express.Router();

router.get("/", getUser);
router.put("/", updateUser);
router.post("/", createUser);
router.get("/all", getAllUsers)




export const UserRoute = router;