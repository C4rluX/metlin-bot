import { EmbedBuilder } from "discord.js";
import { embeds } from "../../config.json";
import bot from "../index";

export function randomColor() {
    return embeds.colors[Math.floor(Math.random() * embeds.colors.length)];
}

export function getFooter() {
    return embeds.footer
    .replaceAll("<botname>", bot.user?.username ?? "")
}

export function defaultEmbed() {
    return new EmbedBuilder()
    .setColor(randomColor())
    .setTimestamp()
    .setFooter({ text: getFooter() })
}