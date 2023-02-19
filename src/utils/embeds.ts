import { EmbedBuilder } from "discord.js";
import bot from "../index";
import { getConfig } from "./configuration";
import { randomRange } from "./number-related";
import { parseVariables } from "./string-related";

export function randomColor() {
    return getConfig().defaults.embeds.colors[
        randomRange(getConfig().defaults.embeds.colors.length)
    ];
}

export function getFooter() {
    return parseVariables(getConfig().defaults.embeds.footer, {
        botname: bot.user?.username ?? ""
    })
}

export function defaultEmbed() {
    return new EmbedBuilder()
    .setColor(randomColor())
    .setTimestamp()
    .setFooter({ text: getFooter() })
}