import express from "express";
import { loginHandler, registerHandler } from "./auth.handlers.js";
import { validateData } from "../common/common.middlewares.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";

const authRouter = express.Router();

authRouter.post("/register",validateData(registerSchema), registerHandler);

authRouter.post("/login",validateData(loginSchema),loginHandler);

export default authRouter;