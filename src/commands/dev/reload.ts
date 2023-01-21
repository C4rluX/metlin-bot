import config from "../../../config";
import * as translations from "../../utils/translations";
import databaseInitialize from "../../database/initialize";
import Command from "../../structures/Command";
import Logger from "../../structures/Logger";

export default new Command({
    name: "reload",
    alias: [],
    developersOnly: true,
    run: async (client, message, args) => {

        Logger.run(`Reloading...`, {
            color: "yellow", ignore: !config.enable.reloadLogs, stringBefore: "\n", category: "Bot"
        });
        
        await databaseInitialize({ logging: config.enable.reloadLogs });
        await translations.load({ logging: config.enable.reloadLogs });
        await client.load({ logging: config.enable.reloadLogs });

        Logger.run(`Bot reloaded. Done\n`, {
            color: "yellow", ignore: !config.enable.reloadLogs, category: "Bot"
        });

        return await message.reply({
            content: "Bot reloaded successfully (Commands, Slash Commands, Events, Discord API REST Events, Database, Translations)."
        });

    }
})