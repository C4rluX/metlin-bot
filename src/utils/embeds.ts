import { EmbedBuilder } from "discord.js";
import config from "../../config";
import bot from "../index";
import { randomRange } from "./number-related";
import { parseVariables } from "./string-related";

export function randomColor() {
    return config.defaults.embeds.colors[
        randomRange(config.defaults.embeds.colors.length)
    ];
}

export function getFooter() {
    return parseVariables(config.defaults.embeds.footer, {
        botname: bot.user?.username ?? ""
    })
}

export function defaultEmbed() {
    return new EmbedBuilder()
    .setColor(randomColor())
    .setTimestamp()
    .setFooter({ text: getFooter() })
}