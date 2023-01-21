import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../structures/SlashCommand";
import * as translations from "../../../translations";
import profileSubcommand from "../../subcommands/minecraft/perfil";
import serverSubcommand from "../../subcommands/minecraft/servidor";

const info = translations.getSlashCommandMeta("minecraft", { lang: "default" }) as translations.SlashCommandMeta;
const data = new SlashCommandBuilder()
.addSubcommand(profileSubcommand.data)
.addSubcommand(serverSubcommand.data)
.setName(info.name)
.setDescription(info.description)
.setNameLocalizations(translations.getSlashCommandMeta("minecraft.name", { lang: "all" }))
.setDescriptionLocalizations(translations.getSlashCommandMeta("minecraft.description", { lang: "all" }))

export default new SlashCommand({
    data,
    async run(client, interaction) { },
})