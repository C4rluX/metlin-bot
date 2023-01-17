import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "./Bot";

interface SlashCommandData {
    data: SlashCommandBuilder,
    run: (client: Bot, interaction: ChatInputCommandInteraction) => void
}

export default class SlashCommand {

    public data: SlashCommandData["data"];
    public run: SlashCommandData["run"];

    constructor (data: SlashCommandData) {
        this.data = data.data;
        this.run = data.run;
    }

}