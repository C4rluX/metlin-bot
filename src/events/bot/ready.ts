import Event from "../../structures/Event";
import config from "../../../config.json";
import Logger from "../../structures/Logger";
import { upperCaseByIndexes } from "../../utils/string-related";
import * as canvasPreloads from "../../utils/preloads";

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
        
        Logger.run(`[Bot] Started succesfully as: ${client.user?.tag}`, { color: "green", stringBefore: "\n" });
        
        Logger.run(`[Bot] Environment enabled (by config.json): ${
            Object.keys(config.enable)
            .filter(key => config.enable[key as keyof typeof config.enable])
            .map(string => upperCaseByIndexes(string, [0]))
            .join(", ")
        }`, { color: "blue", stringBefore: "\n" });

        Logger.run(`[Bot] Environment disabled (by config.json): ${
            Object.keys(config.enable)
            .filter(key => !config.enable[key as keyof typeof config.enable])
            .map(string => upperCaseByIndexes(string, [0]))
            .join(", ")
        }\n`, { color: "blue" });

        client.loaded = true;

    }
})