import express from "express";
import { loginHandler, registerHandler } from "./auth.handlers.js";

const authRouter = express.Router();

authRouter.post("/register", registerHandler);

authRouter.post("/login",loginHandler);

export default authRouter;