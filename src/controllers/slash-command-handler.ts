import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../structures/Bot";
import config from "../../config.json";
import Logger from "../structures/Logger";

export default async (client: Bot, interaction: ChatInputCommandInteraction): Promise<void> => {

    const command = client.interactions.commands.get(interaction.commandName);
    if (!command) return;
    
    if (interaction.channel?.isDMBased() || !interaction.guild) {
        await interaction.reply({
            content: "¡Los comandos del bot no pueden ser ejecutados desde mensajes directos o canales que no pertenezcan a servidores!",
            ephemeral: true
        });
        return;
    }

    if (interaction.options.getSubcommand(false)) {
        
        const subcommand = client.interactions.subcommands.find(subcmd => 
            subcmd.parent === command.data.name && subcmd.data.name === interaction.options.getSubcommand()
        );

        if (!subcommand) return;
        
        if (interaction.channel && !interaction.channel.isDMBased()) {
            Logger.run(`[Slash Commands] ${interaction.user.tag} (ID: ${interaction.user.id}) executed "/${command.data.name} ${subcommand.data.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`, {
                color: "cyan", ignore: !config.disable.slashCommandsLogs
            });
        }
    
        return subcommand.run(client, interaction);

    }

    if (interaction.channel && !interaction.channel.isDMBased()) {
        Logger.run(`[Slash Commands] ${interaction.user.tag} (ID: ${interaction.user.id}) executed "/${command.data.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`, {
            color: "cyan", ignore: !config.disable.slashCommandsLogs
        });
    }

   command.run(client, interaction);

}