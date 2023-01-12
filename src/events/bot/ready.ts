import Event from "../../structures/Event";
import config from "../../../config.json";
import Logger from "../../structures/Logger";
import { upperCaseByIndexes } from "../../utils/string-related";
import * as canvasPreloads from "../../utils/preloads";

export default new Event({
    name: "ready",
    once: true,
    run: async (client) => {
        
        if (!config.disable.slashCommandsGlobalRegistering) {
            await client.registerGlobalSlashCommands();
        }

        if (!config.disable.slashCommandsTestingGuildRegistering) {
            await client.registerSlashCommandsInGuilds(config.testingGuilds);
        }

        await canvasPreloads.load({ logging: !config.disable.preloadsLogs });

        client.loaded = true;
        Logger.run(`[Bot] Started succesfully as: ${client.user?.tag}`, { color: "green", stringBefore: "\n" });
        Logger.run(`[Bot] Environment disabled (by config.json): ${
            Object.keys(config.disable)
            .filter(key => config.disable[key as keyof typeof config.disable])
            .map(string => upperCaseByIndexes(string, [0]))
            .join(", ")
        }\n`, { color: "blue" });

    }
})