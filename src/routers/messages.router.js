import express from "express";
import { authPolicies } from "../utils/auth.js";
import { getChatPage } from "../controllers/messages.controller.js";

const routerMessages = express.Router();

routerMessages.get("/", authPolicies("user"), getChatPage);

export { routerMessages as messagesRouter };