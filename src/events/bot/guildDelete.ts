import { Guild } from "discord.js";
import { leftGuild } from "../../controllers/logging";
import Event from "../../structures/Event";

export default new Event({
    name: "guildDelete",
    once: false,
    run: async (client, guild: Guild) => {
        leftGuild(client, guild);
    }
})