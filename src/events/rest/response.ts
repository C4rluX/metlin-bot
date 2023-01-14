import Event from "../../structures/Event";
import Logger from "../../structures/Logger";
import config from "../../../config.json";
import { cut } from "../../utils/string-related";

export default new Event({
    name: "response",
    once: false,
    run: (client, response) => {

        Logger.run([
            `[Discord API] ${response.method} ${response.path} - 200 OK - Retries: ${response.retries}`,
            `Body: ${JSON.stringify(response.data.body || {})}`
        ].join("\n"), {
            color: "blue", ignore: !config.enable.discordApiRequestsLogs
        });
        
    }
})