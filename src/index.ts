import * as dotenv from "dotenv";
dotenv.config();

import databaseInitialize from "./database/initialize";
import exceptionCatchers from "./utils/exception-catchers";

import Bot from "./structures/Bot";
const bot = new Bot({ logging: true });

import config from "../config";
import * as translations from "./utils/translations";
import Logger from "./structures/Logger";

(async () => {

    exceptionCatchers();

    Logger.run(config.devMode.activated ? `Starting in Developer Mode...` : `Starting...`, {
        color: "green", category: "Bot"
    });

    await databaseInitialize({ logging: config.enable.databaseLogs });
    await translations.load({ logging: config.enable.translationsLogs });
    await bot.load({ logging: true });
    await bot.start();

})();

export default bot;