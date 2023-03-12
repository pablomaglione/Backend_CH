import express from "express";
import { Auth} from "../utils/auth.js";
import { getChatPage } from "../controllers/messages.controller.js";

const routerMessages = express.Router();

routerMessages.get("/", Auth("user"), getChatPage);

export { routerMessages as messagesRouter };