import { Guild } from "discord.js";
import { enteredGuild } from "../../controllers/logging";
import Event from "../../structures/Event";

export default new Event({
    name: "guildCreate",
    once: false,
    run: async (client, guild: Guild) => {
        enteredGuild(guild);
    }
})