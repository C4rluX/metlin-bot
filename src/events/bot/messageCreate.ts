import { Message } from "discord.js";
import Event from "../../structures/Event";
import commandHandler from "../../controllers/command-handler";

export default new Event({
    name: "messageCreate",
    once: false,
    run: async (client, message: Message) => {
        commandHandler(client, message);
    }
})