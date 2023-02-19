import { SlashCommandSubcommandBuilder } from "discord.js";
import * as database from "../../../database";
import SlashCommandSubCommand from "../../../structures/SlashSubCommand";
import { defaultEmbed } from "../../../utils/embeds";
import * as translations from "../../../utils/translations";

const info = translations.getSlashCommandMeta("bot.ping", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandSubcommandBuilder()
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("bot.ping.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("bot.ping.description", { lang: "all" }))

export default new SlashCommandSubCommand({
    parent: translations.getSlashCommandMeta("bot.name", { lang: "default" }),
    data,
    async run(client, interaction) {

        const description = [
            translations.get("commands.bot.ping.discord", {
                lang: interaction.locale,
                variables: { value: client.ws.ping }
            }),
            translations.get("commands.bot.ping.database", {
                lang: interaction.locale,
                variables: { value: (await database.ping()).toFixed(2), databaseName: database.connection.getDialect() }
            }),
            translations.get("commands.bot.ping.messagesCalculating", {
                lang: interaction.locale
            })
        ]
        
        const timestamp = Date.now();

        const embed = defaultEmbed()
        .setTitle(translations.get("commands.bot.ping.title", { lang: interaction.locale }))
        .setDescription(description.join("\n"))
        .setThumbnail(client.user?.displayAvatarURL({ extension: "png", size: 128 }) ?? "")

        await interaction.reply({ embeds: [embed] });

        description[2] = translations.get("commands.bot.ping.messages", {
            lang: interaction.locale,
            variables: { value: Date.now() - timestamp }
        });

        embed.setDescription(description.join("\n"));
        return await interaction.editReply({ embeds: [embed] });

    },
})