import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../structures/SlashCommand";
import * as translations from "../../../utils/translations";
import saySubcommand from "../../subcommands/message/send";

const info = translations.getSlashCommandMeta("message", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandBuilder()
.addSubcommand(saySubcommand.data)
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("message.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("message.description", { lang: "all" }))

export default new SlashCommand({
    data,
    async run(client, interaction) { },
})