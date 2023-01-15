import Event from "../../structures/Event";
import config from "../../../config";
import Logger from "../../structures/Logger";
import { upperCaseByIndexes } from "../../utils/string-related";
import * as canvasPreloads from "../../utils/preloads";
import { startPresenceUpdater } from "../../utils/presense";

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
        
        Logger.run(`Started succesfully as: ${client.user?.tag}`, {
            color: "green", stringBefore: "\n", category: "Bot"
        });
        
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

        startPresenceUpdater(client);
        client.loaded = true;

    }
})