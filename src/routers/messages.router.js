import express from "express";
import { getChatPage } from "../controllers/messages.controller.js";

const routerMessages = express.Router();

routerMessages.get("/", getChatPage);

export { routerMessages as messagesRouter };