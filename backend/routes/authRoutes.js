import express from "express";
import { register, login, getUsers } from "../controllers/authController.js";
import { userAuth } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", userAuth, getUsers);

export default router;
