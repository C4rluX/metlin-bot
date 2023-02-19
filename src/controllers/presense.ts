import Logger from "../structures/Logger";
import { parseVariables } from "../utils/json-related";
import { randomRange } from "../utils/number-related";
import bot from "../index";
import { getConfig } from "../utils/configuration";

let lastPresenceIndex = -1;
let intervalId: any = null; // If someone knows how to import 'NodeJS.Timer', it would be very appreciated :)

export function getRandomIndex() {
    let index: number;
    do {
        index = randomRange(0, getConfig().presence.list.length);
    } while (index == lastPresenceIndex);
    lastPresenceIndex = index;
    return index;
}

export function startPresenceUpdater() {

    if (intervalId !== null) clearInterval(intervalId);
    if (!getConfig().enable.presence) return;

    function interval() {
        const index = getRandomIndex();
        bot.user?.setPresence(
            parseVariables(getConfig().presence.list.at(index), {
                serversCount: bot.guilds.cache.size,
                usersCount: bot.users.cache.size
            })
        );
        Logger.run(`Changed to index ${index}`, {
            color: "cyan", ignore: !getConfig().enable.presenceLogs, category: "Presence"
        });
    }

    intervalId = setInterval(() => interval(), getConfig().presence.updateInterval);
    interval();

}