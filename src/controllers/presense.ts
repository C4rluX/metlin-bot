import { Client } from "discord.js";
import config from "../../config";
import Logger from "../structures/Logger";
import { parseVariables } from "../utils/json-related";
import { randomRange } from "../utils/number-related";
import bot from "../index";

let lastPresenceIndex = -1;
export function getRandomPresenceIndex() {
    let index: number;
    do {
        index = randomRange(0, config.presence.list.length);
    } while (index == lastPresenceIndex);
    lastPresenceIndex = index;
    return index;
}

export function startPresenceUpdater(client: Client) {

    if (!config.enable.presence) return;

    function interval() {
        const index = getRandomPresenceIndex();
        client.user?.setPresence(
            parseVariables(config.presence.list.at(index) ?? {}, {
                serversCount: bot.guilds.cache.size,
                usersCount: bot.users.cache.size
            })
        );
        Logger.run(`Changed to index ${index}`, {
            color: "cyan", ignore: !config.enable.presenceLogs, category: "Presence"
        });
    }

    setInterval(() => interval(), config.presence.updateInterval);
    interval();   

}