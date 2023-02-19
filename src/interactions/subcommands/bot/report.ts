import { SlashCommandStringOption, SlashCommandSubcommandBuilder } from "discord.js";
import { botReport } from "../../../controllers/logging";
import SlashCommandSubCommand from "../../../structures/SlashSubCommand";
import * as translations from "../../../utils/translations";

const info = translations.getSlashCommandMeta("bot.report", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandSubcommandBuilder()
.addStringOption(
    new SlashCommandStringOption()
    .setName(info.options.report.name)
    .setDescription(info.options.report.description)
    .setNameLocalizations(translations.getSlashCommandMeta("bot.report.options.report.name", { lang: "all" }))
    .setDescriptionLocalizations(translations.getSlashCommandMeta("bot.report.options.report.description", { lang: "all" }))
    .setRequired(true)
)
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("bot.report.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("bot.report.description", { lang: "all" }))

export default new SlashCommandSubCommand({
    parent: translations.getSlashCommandMeta("bot.name", { lang: "default" }),
    data,
    async run(client, interaction) {

        await interaction.deferReply({ ephemeral: true });

        try {
            await botReport(interaction, interaction.options.getString(info.options.report.name, true));
        } catch (err) {
            return await interaction.editReply({
                content: translations.get("commands.bot.report.error", { lang: interaction.locale })
            });
        }

        return await interaction.editReply({
            content: translations.get("commands.bot.report.success", { lang: interaction.locale })
        });

    },
})