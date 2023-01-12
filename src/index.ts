import * as dotenv from "dotenv"
dotenv.config();

import exceptionCatchers from "./utils/exception-catchers";
exceptionCatchers();

import Bot from "./structures/Bot";
const bot = new Bot({ logging: true });
bot.start();

import Logger from "./structures/Logger";
Logger.run("[Bot] Starting...", { color: "green" });

export default bot;