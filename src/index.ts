import * as dotenv from "dotenv";
dotenv.config();

import * as database from "./database";
import exceptionCatchers from "./utils/exception-catchers";

import Bot from "./structures/Bot";
const bot = new Bot({ logging: true });

import * as translations from "./utils/translations";
import Logger from "./structures/Logger";
import * as configuration from "./utils/configuration";

(async () => {

    exceptionCatchers();
    await configuration.load();

    Logger.run(configuration.getConfig().devMode.activated ? `Starting in Developer Mode...` : `Starting...`, {
        color: "green", category: "Bot"
    });

    await database.initialize({ logging: configuration.getConfig().enable.databaseLogs });
    await translations.load({ logging: configuration.getConfig().enable.translationsLogs });
    await bot.load({ logging: true });
    await bot.start();

})();

export default bot;