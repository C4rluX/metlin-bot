import { Message } from "discord.js";
import Bot from "./Bot";

interface CommandData {
    name: string,
    alias: Array<string>,
    developersOnly?: boolean,
    public?: boolean,
    run: (client: Bot, message: Message, args: Array<string>) => void
}

export default class Command {

    public name: CommandData["name"];
    public alias: CommandData["alias"];
    public developersOnly: CommandData["developersOnly"];
    public public: CommandData["public"];
    public run: CommandData["run"];

    constructor (data: CommandData) {
        this.name = data.name;
        this.alias = data.alias;
        this.run = data.run;
        this.developersOnly = data.developersOnly || false;
        this.public = data.public || false;
    }

}