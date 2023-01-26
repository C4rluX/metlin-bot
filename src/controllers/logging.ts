import { Collection, EmbedBuilder, escapeMarkdown, Guild, TextChannel } from "discord.js";
import config from "../../config";
import Bot from "../structures/Bot";

const channels = new Collection<keyof typeof config.logsChannels, TextChannel>();

export async function loadChannels(client: Bot) {
    const keys = Object.keys(config.logsChannels);
    for (const index in keys) {
        const key = keys[index];
        const channel = await client.channels.fetch(config.logsChannels[key as keyof typeof config.logsChannels]);
        channels.set(key as keyof typeof config.logsChannels, channel as TextChannel);
    }
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

    const embed = new EmbedBuilder()
    .setTitle("I have entered in a new guild!")
    .setColor(config.colors.green)
    .setDescription(
        [
            `Name: **${escapeMarkdown(guild.name)}**`,
            `Member count: **${guild.memberCount}**`,
            `Owner: **${owner}**`,
            `Current server count: **${client.guilds.cache.size}**`
        ].join("\n")
    )
    .setTimestamp()

    return await channels.get("enteredGuilds")?.send({ embeds: [embed] });

}

export async function leftGuild(client: Bot, guild: Guild) {

    const owner = await getOwnerString(guild);

    const embed = new EmbedBuilder()
    .setTitle("I have left from a guild!")
    .setColor(config.colors.red)
    .setDescription(
        [
            `Name: **${escapeMarkdown(guild.name)}**`,
            `Member count: **${guild.memberCount}**`,
            `Owner: **${owner}**`,
            `Current server count: **${client.guilds.cache.size}**`
        ].join("\n")
    )
    .setTimestamp()

    return await channels.get("leftGuilds")?.send({ embeds: [embed] });

}