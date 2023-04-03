import express from "express"
import { getLoggerTest } from "../controllers/logger.controller.js";

const router = express.Router();

router.get('/', getLoggerTest);

export {router as loggerRouter}