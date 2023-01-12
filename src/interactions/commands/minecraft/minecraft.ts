import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../structures/SlashCommand";

import profileSubcommand from "../../subcommands/minecraft/perfil";
import serverSubcommand from "../../subcommands/minecraft/servidor";

const data = new SlashCommandBuilder()
.setName("minecraft")
.addSubcommand(profileSubcommand.data)
.addSubcommand(serverSubcommand.data)
.setDescription("Comandos relacionados a Minecraft");

export default new SlashCommand({
    data,
    async run(client, interaction) { },
})