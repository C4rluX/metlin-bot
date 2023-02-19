import Event from "../../structures/Event";
import Logger from "../../structures/Logger";
import { upperCaseByIndexes } from "../../utils/string-related";
import * as canvasPreloads from "../../utils/preloads";
import * as logging from "../../controllers/logging";
import { startPresenceUpdater } from "../../controllers/presense";
import { getConfig } from "../../utils/configuration";

export default new Event({
    name: "ready",
    once: true,
    run: async (client) => {

        if (getConfig().enable.slashCommandsGlobalRegistering) {
            await client.registerGlobalSlashCommands();
        }

        if (getConfig().devMode.slashCommandsTestingGuildsRegistering) {
            await client.registerSlashCommandsInGuilds(getConfig().devMode.guilds);
        }

        await canvasPreloads.load({ logging: getConfig().enable.preloadsLogs });
        
        startPresenceUpdater();
        await logging.loadChannels();
        client.loaded = true;

        const configEnabled = getConfig().enable; // This is only for the typeofs to work

        Logger.run(`Environment enabled (by config): ${
            Object.keys(getConfig().enable)
            .filter(key => getConfig().enable[key as keyof typeof configEnabled])
            .map(string => upperCaseByIndexes(string, [0]))
            .join(", ")
        }`, { color: "blue", stringBefore: "\n", category: "Bot" });

        Logger.run(`Environment disabled (by config): ${
            Object.keys(getConfig().enable)
            .filter(key => !getConfig().enable[key as keyof typeof configEnabled])
            .map(string => upperCaseByIndexes(string, [0]))
            .join(", ")
        }\n`, { color: "blue", category: "Bot" });

        Logger.run(`Started succesfully as: ${client.user?.tag}\n`, {
            color: "green", stringBefore: "\n", category: "Bot"
        });

    }
})