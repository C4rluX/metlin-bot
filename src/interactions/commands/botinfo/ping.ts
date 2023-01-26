import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../structures/SlashCommand";
import { defaultEmbed } from "../../../utils/embeds";
import * as translations from "../../../utils/translations";

const info = translations.getSlashCommandMeta("ping", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandBuilder()
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("ping.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("ping.description", { lang: "all" }))

export default new SlashCommand({
    data,
    async run(client, interaction) {

        const description = [
            translations.get("commands.ping.discord", {
                lang: interaction.locale,
                variables: { value: client.ws.ping }
            }),
            translations.get("commands.ping.messagesCalculating", { lang: interaction.locale })
        ]
        
        const timestamp = Date.now();

        const embed = defaultEmbed()
        .setTitle(translations.get("commands.ping.title", { lang: interaction.locale }))
        .setDescription(description.join("\n"))
        .setThumbnail(client.user?.displayAvatarURL({ extension: "png", size: 128 }) ?? "")

        await interaction.reply({ embeds: [embed], ephemeral: true });

        description[1] = translations.get("commands.ping.messages", {
            lang: interaction.locale,
            variables: { value: Date.now() - timestamp }
        });

        embed.setDescription(description.join("\n"));
        return await interaction.editReply({ embeds: [embed] });

    },
})