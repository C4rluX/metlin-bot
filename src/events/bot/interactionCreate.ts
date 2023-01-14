import { BaseInteraction } from "discord.js";
import slashCommandHandler from "../../controllers/slash-command-handler";
import Event from "../../structures/Event";

export default new Event({
    name: "interactionCreate",
    once: false,
    run: async (client, interaction: BaseInteraction) => {
        if (interaction.isChatInputCommand()) slashCommandHandler(client, interaction);
    }
})