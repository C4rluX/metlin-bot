import { SlashCommandStringOption, SlashCommandSubcommandBuilder } from "discord.js";
import { botSuggestion } from "../../../controllers/logging";
import SlashCommandSubCommand from "../../../structures/SlashSubCommand";
import * as translations from "../../../utils/translations";

const info = translations.getSlashCommandMeta("bot.suggestion", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandSubcommandBuilder()
.addStringOption(
    new SlashCommandStringOption()
    .setName(info.options.suggestion.name)
    .setDescription(info.options.suggestion.description)
    .setNameLocalizations(translations.getSlashCommandMeta("bot.suggestion.options.suggestion.name", { lang: "all" }))
    .setDescriptionLocalizations(translations.getSlashCommandMeta("bot.suggestion.options.suggestion.description", { lang: "all" }))
    .setRequired(true)
)
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("bot.suggestion.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("bot.suggestion.description", { lang: "all" }))

export default new SlashCommandSubCommand({
    parent: translations.getSlashCommandMeta("bot.name", { lang: "default" }),
    data,
    async run(client, interaction) {

        await interaction.deferReply({ ephemeral: true });

        try {
            await botSuggestion(interaction, interaction.options.getString(info.options.suggestion.name, true));
        } catch (err) {
            return await interaction.editReply({
                content: translations.get("commands.bot.suggestion.error", { lang: interaction.locale })
            });
        }

        return await interaction.editReply({
            content: translations.get("commands.bot.suggestion.success", { lang: interaction.locale })
        });
        
    },
})