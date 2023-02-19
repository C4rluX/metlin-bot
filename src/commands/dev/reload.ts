import * as translations from "../../utils/translations";
import * as database from "../../database";
import Command from "../../structures/Command";
import Logger from "../../structures/Logger";
import * as configuration from "../../utils/configuration";
import * as logging from "../../controllers/logging";
import { startPresenceUpdater } from "../../controllers/presense";

export default new Command({
    name: "reload",
    alias: [],
    developersOnly: true,
    run: async (client, message, args) => {

        await message.channel.sendTyping();

        Logger.run(`Reloading...`, {
            color: "yellow", ignore: !configuration.getConfig().enable.reloadLogs, stringBefore: "\n", category: "Bot"
        });
        
        await configuration.load();
        await database.initialize({ logging: configuration.getConfig().enable.reloadLogs });
        await translations.load({ logging: configuration.getConfig().enable.reloadLogs });
        await client.load({ logging: configuration.getConfig().enable.reloadLogs });
        await logging.loadChannels();
        await startPresenceUpdater();

        Logger.run(`Bot reloaded. Done\n`, {
            color: "yellow", ignore: !configuration.getConfig().enable.reloadLogs, category: "Bot", stringBefore: "\n"
        });

        return await message.reply({
            content: "Bot reloaded successfully (Commands, Slash Commands, Events, Discord API REST Events, Database, Translations, Configuration, Presence Updater)."
        });

    }
})