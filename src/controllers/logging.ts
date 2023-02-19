import { ChatInputCommandInteraction, Collection, escapeMarkdown, Guild, MessageCreateOptions, TextChannel } from "discord.js";
import bot from "../index";
import Bot from "../structures/Bot";
import Logger from "../structures/Logger";
import { getConfig } from "../utils/configuration";
import { defaultEmbed } from "../utils/embeds";
import * as translations from "../utils/translations";

const logsChannels = getConfig().logsChannels; // This is only for the typeofs to work
const channels = new Collection<keyof typeof logsChannels, TextChannel>();

export async function loadChannels() {

    const keys = Object.keys(getConfig().logsChannels);
    for (const index in keys) {
        const key = keys[index];
        try {
            const id = getConfig().logsChannels[key as keyof typeof logsChannels];
            if (!id) throw new Error();
            const channel = await bot.channels.fetch(id);
            channels.set(key as keyof typeof logsChannels, channel as TextChannel);
        } catch (err) {}
    }

    Logger.run(`Loaded:`, {
        category: "Logs Channels", color: "blue", stringBefore: "\n", ignore: !getConfig().enable.logsChannelsLogs
    });

    keys.forEach(key => {

        const channel = channels.has(key as keyof typeof logsChannels) ?
        `#${channels.get(key as keyof typeof logsChannels)?.name} (ID: ${channels.get(key as keyof typeof logsChannels)?.id})`
        : "Couldn't load.";

        Logger.run(`${key}: ${channel}`, {
            category: "Logs Channels", color: "blue", ignore: !getConfig().enable.logsChannelsLogs
        });

    });

}

export async function send(name: keyof typeof logsChannels, payload: MessageCreateOptions) {

    if (!channels.has(name)) return Logger.run(`No log channel for: ${name}\n`, {
        category: "Logs Channels", color: "yellow", stringBefore: "\n", ignore: !getConfig().enable.logsChannelsLogs
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

export async function enteredGuild(guild: Guild) {

    const owner = await getOwnerString(guild);

    const embed = defaultEmbed()
    .setTitle("I have entered in a new guild!")
    .setColor(getConfig().colors.green)
    .setDescription(
        [
            `**Name:** ${escapeMarkdown(guild.name)}`,
            `**ID:** ${guild.id}`,
            `**Member** count: ${guild.memberCount}`,
            `**Owner:** ${owner}`,
            `**Current server count:** ${bot.guilds.cache.size}`
        ].join("\n")
    )

    return await send("enteredGuilds", { embeds: [embed] });

}

export async function leftGuild(guild: Guild) {

    const owner = await getOwnerString(guild);

    const embed = defaultEmbed()
    .setTitle("I have left from a guild!")
    .setColor(getConfig().colors.red)
    .setDescription(
        [
            `**Name:** ${escapeMarkdown(guild.name)}`,
            `**ID:** ${guild.id}`,
            `**Member count:** ${guild.memberCount}`,
            `**Owner:** ${owner}`,
            `**Current server count:** ${bot.guilds.cache.size}`
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