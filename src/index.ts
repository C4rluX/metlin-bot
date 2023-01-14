import * as dotenv from "dotenv"
dotenv.config();

import exceptionCatchers from "./utils/exception-catchers";
exceptionCatchers();

import Bot from "./structures/Bot";
const bot = new Bot({ logging: true });
bot.start();

import Logger from "./structures/Logger";
import { devMode } from "../config.json";

Logger.run(devMode.activated ? `Starting in Developer Mode...` : `Starting...`, {
    color: "green", category: "Bot"
});

export default bot;