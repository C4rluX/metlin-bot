import { ChatInputCommandInteraction, Collection, escapeMarkdown, Guild, MessageCreateOptions, TextChannel } from "discord.js";
import config from "../../config";
import Bot from "../structures/Bot";
import Logger from "../structures/Logger";
import { defaultEmbed } from "../utils/embeds";
import * as translations from "../utils/translations";

const channels = new Collection<keyof typeof config.logsChannels, TextChannel>();

export async function loadChannels(client: Bot) {

    const keys = Object.keys(config.logsChannels);
    for (const index in keys) {
        const key = keys[index];
        try {
            const id = config.logsChannels[key as keyof typeof config.logsChannels];
            if (!id) throw new Error();
            const channel = await client.channels.fetch(id);
            channels.set(key as keyof typeof config.logsChannels, channel as TextChannel);
        } catch (err) {}
    }

    Logger.run(`Loaded:`, {
        category: "Logs Channels", color: "blue", stringBefore: "\n", ignore: !config.enable.logsChannelsLogs
    });

    keys.forEach(key => {

        const channel = channels.has(key as keyof typeof config.logsChannels) ?
        `#${channels.get(key as keyof typeof config.logsChannels)?.name} (ID: ${channels.get(key as keyof typeof config.logsChannels)?.id})`
        : "Couldn't load.";

        Logger.run(`${key}: ${channel}`, {
            category: "Logs Channels", color: "blue", ignore: !config.enable.logsChannelsLogs
        });

    });

}

export async function send(name: keyof typeof config.logsChannels, payload: MessageCreateOptions) {

    if (!channels.has(name)) return Logger.run(`No log channel for: ${name}\n`, {
        category: "Logs Channels", color: "yellow", stringBefore: "\n", ignore: !config.enable.logsChannelsLogs
    });

    return await channels.get(name)?.send(payload); 

}

async function getOwnerString(guild: Guild) {
    try {
        const fetched = await guild.fetchOwner();
        return `${escapeMarkdown(fetched.user.tag)} | ${fetched.toString()}`;
    } catch (err) {
        return `<@${guild.ownerId}>`;
    }
}

export async function enteredGuild(client: Bot, guild: Guild) {

    const owner = await getOwnerString(guild);

    const embed = defaultEmbed()
    .setTitle("I have entered in a new guild!")
    .setColor(config.colors.green)
    .setDescription(
        [
            `**Name:** ${escapeMarkdown(guild.name)}`,
            `**ID:** ${guild.id}`,
            `**Member** count: ${guild.memberCount}`,
            `**Owner:** ${owner}`,
            `**Current server count:** ${client.guilds.cache.size}`
        ].join("\n")
    )

    return await send("enteredGuilds", { embeds: [embed] });

}

export async function leftGuild(client: Bot, guild: Guild) {

    const owner = await getOwnerString(guild);

    const embed = defaultEmbed()
    .setTitle("I have left from a guild!")
    .setColor(config.colors.red)
    .setDescription(
        [
            `**Name:** ${escapeMarkdown(guild.name)}`,
            `**ID:** ${guild.id}`,
            `**Member count:** ${guild.memberCount}`,
            `**Owner:** ${owner}`,
            `**Current server count:** ${client.guilds.cache.size}`
        ].join("\n")
    )

    return await send("leftGuilds", { embeds: [embed] });

}

function getLanguageName(lang: string) {
    const name = translations.get("general.name", { lang });
    if (!name.en) return name.native;
    return `${name.native} (${name.en})`;
}

export async function botSuggestion(interaction: ChatInputCommandInteraction, suggestion: string) {

    const embed = defaultEmbed()
    .setTitle("A new suggestion is here!")
    .setDescription(
        [
            `**User:** ${escapeMarkdown(interaction.user.tag)} | ${interaction.user.toString()}`,
            `**User language:** ${getLanguageName(interaction.locale)}`,
            `**Channel:** #${escapeMarkdown((interaction.channel as TextChannel).name)} | ${interaction.channel?.toString()}`,
            `**Guild:** ${escapeMarkdown(interaction.guild?.name ?? "")} (ID: ${interaction.guildId})`,
        ].join("\n")
    )
    .setFields([
        { name: "Suggestion:", value: suggestion }
    ])

    return await send("botSuggestions", { embeds: [embed] });

}

export async function botReport(interaction: ChatInputCommandInteraction, report: string) {

    const embed = defaultEmbed()
    .setTitle("A new report is here!")
    .setDescription(
        [
            `**User:** ${escapeMarkdown(interaction.user.tag)} | ${interaction.user.toString()}`,
            `**User language:** ${getLanguageName(interaction.locale)}`,
            `**Channel:** #${escapeMarkdown((interaction.channel as TextChannel).name)} | ${interaction.channel?.toString()}`,
            `**Guild:** ${escapeMarkdown(interaction.guild?.name ?? "")} (ID: ${interaction.guildId})`,
        ].join("\n")
    )
    .setFields([
        { name: "Report:", value: report }
    ])

    return await send("botReports", { embeds: [embed] });

}