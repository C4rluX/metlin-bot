import { EmbedBuilder } from "discord.js";
import config from "../../config.json";
import bot from "../index";
import { randomRange } from "./number-related";

export function randomColor() {
    return config.defaults.embeds.colors[
        randomRange(config.defaults.embeds.colors.length)
    ];
}

export function getFooter() {
    return config.defaults.embeds.footer
    .replaceAll("<botname>", bot.user?.username ?? "")
}

export function defaultEmbed() {
    return new EmbedBuilder()
    .setColor(randomColor())
    .setTimestamp()
    .setFooter({ text: getFooter() })
}