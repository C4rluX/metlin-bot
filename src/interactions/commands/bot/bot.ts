import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../structures/SlashCommand";
import * as translations from "../../../utils/translations";
import pingSubcommand from "../../subcommands/bot/ping";
import infoSubcommand from "../../subcommands/bot/info";
import suggestionSubcommand from "../../subcommands/bot/suggestion";
import reportSubcommand from "../../subcommands/bot/report";

const info = translations.getSlashCommandMeta("bot", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandBuilder()
.addSubcommand(pingSubcommand.data)
.addSubcommand(infoSubcommand.data)
.addSubcommand(suggestionSubcommand.data)
.addSubcommand(reportSubcommand.data)
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("bot.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("bot.description", { lang: "all" }))

export default new SlashCommand({
    data,
    async run(client, interaction) { },
})