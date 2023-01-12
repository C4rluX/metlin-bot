import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";

interface SlashCommandData {
    data: SlashCommandBuilder,
    run: (client: Client, interaction: ChatInputCommandInteraction) => void
}

export default class SlashCommand {

    public data: SlashCommandData["data"];
    public run: SlashCommandData["run"];

    constructor (data: SlashCommandData) {
        this.data = data.data;
        this.run = data.run;
    }

}