import { Message } from "discord.js";
import Bot from "../structures/Bot";
import config from "../../config.json";
import Command from "../structures/Command";
import Logger from "../structures/Logger";

const allowedToRun = (command: Command, message: Message): boolean => {

    if (config.developers.includes(message.author.id)) return true;
    if (command.developersOnly) return false;

    if (command.public) return true;

    return false;

}

export default (client: Bot, message: Message): void => {

    if (config.devMode.activated && !config.devMode.channels.includes(message.channelId)) return;
    if (!config.devMode.activated && config.devMode.channels.includes(message.channelId)) return;
    
    if (message.channel.isDMBased()) return;
    if (message.author.bot) return;

    const args = message.content.split(/ +/g);
    const prefix = config.prefixes.find(prefix => args[0].startsWith(prefix));

    if (!prefix) return;

    const cmd = args[0].slice(prefix.length);
    const command = client.commands.get(cmd) ?? client.commands.find(e => e.alias.includes(cmd));

    if (!command || !allowedToRun(command, message)) return;

    Logger.run(`${message.author.tag} (ID: ${message.author.id}) executed "${prefix}${command.name}" in #${message.channel.name} (ID: ${message.channel.id}) from the guild "${message.guild?.name}" (ID: ${message.guild?.id})`, {
        color: "cyan", ignore: !config.enable.commandsLogs, category: "Commands"
    });

    command.run(client, message, args);

}