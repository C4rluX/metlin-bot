import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../structures/Bot";
import config from "../../config";
import Logger from "../structures/Logger";
import * as translations from "../utils/translations";

export default async (client: Bot, interaction: ChatInputCommandInteraction) => {

    if (config.devMode.activated && !config.devMode.channels.includes(interaction.channelId)) return;
    if (!config.devMode.activated && config.devMode.channels.includes(interaction.channelId)) return;

    if (interaction.user.bot) return;

    const command = client.interactions.commands.get(interaction.commandName);
    if (!command) return;
    
    if (interaction.channel?.isDMBased() || !interaction.guild) {
        return await interaction.reply({
            content: translations.get("general.messages.invalidCommandChannel", {
                lang: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (interaction.options.getSubcommand(false)) {
        
        const subcommand = client.interactions.subcommands.find(subcmd => 
            subcmd.parent === command.data.name && subcmd.data.name === interaction.options.getSubcommand()
        );

        if (!subcommand) return;
        
        if (interaction.channel && !interaction.channel.isDMBased()) {
            Logger.run(`${interaction.user.tag} (ID: ${interaction.user.id}) executed "/${command.data.name} ${subcommand.data.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`, {
                color: "cyan", ignore: !config.enable.slashCommandsLogs, category: "Slash Commands"
            });
        }
    
        return subcommand.run(client, interaction);

    }

    if (interaction.channel && !interaction.channel.isDMBased()) {
        Logger.run(`${interaction.user.tag} (ID: ${interaction.user.id}) executed "/${command.data.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`, {
            color: "cyan", ignore: !config.enable.slashCommandsLogs, category: "Slash Commands"
        });
    }

   command.run(client, interaction);

}