import { ChatInputCommandInteraction, Client, SlashCommandSubcommandBuilder } from "discord.js";

interface SlashCommandSubCommandData {
    parent: string,
    data: SlashCommandSubcommandBuilder,
    run: (client: Client, interaction: ChatInputCommandInteraction) => void
}

export default class SlashCommandSubCommand {

    public parent: SlashCommandSubCommandData["parent"];
    public data: SlashCommandSubCommandData["data"];
    public run: SlashCommandSubCommandData["run"];

    constructor (data: SlashCommandSubCommandData) {
        this.parent = data.parent;
        this.data = data.data;
        this.run = data.run;
    }

}