import { InteractionResponse, SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../structures/SlashCommand";
import { defaultEmbed } from "../../../utils/embeds";

const data = new SlashCommandBuilder()
.setName("ping")
.setDescription("Ver latencia del bot.");

export default new SlashCommand({
    data,
    async run(client, interaction) {

        const description = [
            `**Discord (API/WebSocket):** ${client.ws.ping} ms`,
            `**Mensajes:** Calculando...`
        ]
        
        const timestamp = Date.now();

        const embed = defaultEmbed()
        .setTitle("¡Pong!")
        .setDescription(description.join("\n"))
        .setThumbnail(client.user?.displayAvatarURL({ extension: "png", size: 128 }) ?? "")

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

        description[1] = `**Mensajes:** ${Date.now() - timestamp} ms`;
        embed.setDescription(description.join("\n"));

        return await interaction.editReply({ embeds: [embed] });

    },
})