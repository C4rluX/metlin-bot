import * as dotenv from "dotenv"
dotenv.config();

import exceptionCatchers from "./utils/exception-catchers";
import * as database from "./database/connection";

import Bot from "./structures/Bot";
const bot = new Bot({ logging: true });

import Logger from "./structures/Logger";

import config from "../config";

(async () => {

    exceptionCatchers();

    Logger.run(config.devMode.activated ? `Starting in Developer Mode...` : `Starting...`, {
        color: "green", category: "Bot"
    });

    await database.authenticateConnection({ logging: config.enable.databaseLogs });
    await bot.load({ logging: true });
    await bot.start();

})();

export default bot;