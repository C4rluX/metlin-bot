import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import Bot from "./Bot";

interface SlashCommandSubCommandData {
    parent: string,
    data: SlashCommandSubcommandBuilder,
    run: (client: Bot, interaction: ChatInputCommandInteraction) => void
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