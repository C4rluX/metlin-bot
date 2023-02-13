import Event from "../../structures/Event";
import config from "../../../config";
import Logger from "../../structures/Logger";
import { upperCaseByIndexes } from "../../utils/string-related";
import * as canvasPreloads from "../../utils/preloads";
import * as logging from "../../controllers/logging";
import { startPresenceUpdater } from "../../controllers/presense";

export default new Event({
    name: "ready",
    once: true,
    run: async (client) => {

        if (config.enable.slashCommandsGlobalRegistering) {
            await client.registerGlobalSlashCommands();
        }

        if (config.devMode.slashCommandsTestingGuildsRegistering) {
            await client.registerSlashCommandsInGuilds(config.devMode.guilds);
        }

        await canvasPreloads.load({ logging: config.enable.preloadsLogs });
        
        startPresenceUpdater(client);
        await logging.loadChannels(client);
        client.loaded = true;

        Logger.run(`Environment enabled (by config): ${
            Object.keys(config.enable)
            .filter(key => config.enable[key as keyof typeof config.enable])
            .map(string => upperCaseByIndexes(string, [0]))
            .join(", ")
        }`, { color: "blue", stringBefore: "\n", category: "Bot" });

        Logger.run(`Environment disabled (by config): ${
            Object.keys(config.enable)
            .filter(key => !config.enable[key as keyof typeof config.enable])
            .map(string => upperCaseByIndexes(string, [0]))
            .join(", ")
        }\n`, { color: "blue", category: "Bot" });

        Logger.run(`Started succesfully as: ${client.user?.tag}\n`, {
            color: "green", stringBefore: "\n", category: "Bot"
        });

    }
})