import { Client, Collection, Partials, Routes, GatewayIntentBits } from "discord.js"
import { readdir } from "node:fs/promises";
import * as path from "node:path";
import Command from "./Command";
import Event from "./Event";
import SlashCommand from "./SlashCommand";
import Logger from "./Logger";
import SlashCommandSubCommand from "./SlashCommandSubcommand";

interface BotOptions {
    logging: boolean
}

class Bot extends Client {

    public commands = new Collection<String, Command>();
    public interactions = {
        commands: new Collection<String, SlashCommand>(),
        subcommands: new Collection<String, SlashCommandSubCommand>(),
    }
    public loaded = false;
    public botOptions: BotOptions;

    constructor(options: BotOptions) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages
            ],
            partials: [Partials.Message, Partials.Reaction],
            allowedMentions: { repliedUser: false, parse: ['roles', 'users'] }
        });
        this.botOptions = options;
    }

    async start() {

        this.commands = await this.loadCommands("commands");
        this.interactions.commands = await this.loadCommands("interactions/commands");
        this.interactions.subcommands = await this.loadCommands("interactions/subcommands");

        const botEvents = await this.loadEvents("bot");
        const restEvents = await this.loadEvents("rest");

        Logger.run(`[Bot] Loaded commands: ${this.commands.map(e => e.name).join(", ") || "None"}`, { color: "blue", ignore: !this.botOptions.logging, stringBefore: "\n" })
        Logger.run(`[Bot] Loaded slash commands: ${this.interactions.commands.map(e => e.data.name).join(", ") || "None"}`, { color: "blue", ignore: !this.botOptions.logging })
        Logger.run(`[Bot] Loaded events: ${botEvents.map(e => e.name).join(", ") || "None"}`, { color: "blue", ignore: !this.botOptions.logging })
        Logger.run(`[Bot] Loaded Discord API REST events: ${restEvents.map(e => e.name).join(", ") || "None"}\n`, { color: "blue", ignore: !this.botOptions.logging })

        this.login(process.env.BOT_TOKEN)
        .catch(err => {
            Logger.run(`[Fatal] Error when starting client:\n${err.stack ? err.stack : err}`, { color: "red" });
        })

    }

    async loadCommands(where: "commands" | "interactions/commands" | "interactions/subcommands"): Promise<Collection<any, any>> {

        const folders = await readdir(path.join(require.main?.path || "", where), { withFileTypes: true });
        const collection = new Collection<any, any>();
        for (const index in folders) {
            const folder = folders[index];
            if (!folder.isDirectory()) continue;
            const files = (await readdir(path.join(require.main?.path || "", where, folder.name))).filter(e => e.endsWith(".ts") || e.endsWith(".js"));
            for (const index in files) {
                const command = (await import(path.join(require.main?.path || "", where, folder.name, files[index]))).default;
                collection.set(where === "commands" ? command.name : command.data.name, command);
            }
        }
        return collection;

    }

    async loadEvents(where: "bot" | "rest") {

        const events: Event[] = [];
        const files = (await readdir(path.join(require.main?.path || "", `events`, where))).filter(e => e.endsWith(".ts") || e.endsWith(".js"));

        for (const index in files) {

            const event: Event = (await import(path.join(require.main?.path || "", `events`, where, files[index]))).default;
            events.push(event);

            if (where === "bot") {
                if (event.once) {
                    this.once(event.name, (...args) => event.run.apply(null, [this, ...args]));
                } else {
                    this.on(event.name, (...args) => {
                        if (!this.loaded) return;
                        event.run.apply(null, [this, ...args]);
                    });
                }
                
            }
            
            if (where === "rest") {
                if (event.once) {
                    this.rest.once(event.name, (...args) => event.run.apply(null, [this, ...args]));
                } else {
                    this.rest.on(event.name, (...args) => event.run.apply(null, [this, ...args]));
                }
            }

        }

        return events;

    }

    async registerSlashCommandsInGuilds(guilds: string[]) {

        if (!this.isReady()) throw new Error("Bot isn't ready yet.");
        if (!guilds.length) return;

        const body = this.interactions.commands.map(e => e.data.toJSON());
        if (!body.length) return Logger.run(`[Guild Slash Commands] No commands to register\n`, { color: "blue", stringBefore: "\n", ignore: !this.botOptions.logging });

        Logger.run(`[Guild Slash Commands] Registering...`, { color: "blue", stringBefore: "\n", ignore: !this.botOptions.logging });

        for (let index in guilds) {
            const guildId = guilds[index];
            const guild = this.guilds.cache.get(guildId);
            if (!guild) continue;
            const data: any = await this.rest.put(Routes.applicationGuildCommands(this.user.id, guild.id), { body });
            Logger.run(`[Guild Slash Commands] Succesfully registered ${data.length} of them in "${guild.name}" (ID: ${guild.id})`, { color: "blue", ignore: !this.botOptions.logging });
        }
        Logger.run(`[Guild Slash Commands] Done\n`, { color: "blue", ignore: !this.botOptions.logging });

    }

    async unregisterSlashCommandsInGuilds(guilds: string[]) {

        if (!this.isReady()) throw new Error("Bot isn't ready yet.");
        if (!guilds.length) return;

        Logger.run(`[Guild Slash Commands] Removing...`, { color: "blue", stringBefore: "\n", ignore: !this.botOptions.logging });
        for (let index in guilds) {
            const guildId = guilds[index];
            const guild = this.guilds.cache.get(guildId);
            if (!guild) continue;
            await this.rest.put(Routes.applicationGuildCommands(this.user.id, guild.id), { body: [] });
            Logger.run(`[Guild Slash Commands] Succesfully wiped all commands from "${guild.name}" (ID: ${guild.id})`, { color: "blue", ignore: !this.botOptions.logging });
        }
        Logger.run(`[Guild Slash Commands] Done\n`, { color: "blue", ignore: !this.botOptions.logging });

    }

    async registerGlobalSlashCommands() {

        if (!this.isReady()) throw new Error("Bot isn't ready yet.");
        const body = this.interactions.commands.map(e => e.data.toJSON());

        if (!body.length) return Logger.run(`[Global Slash Commands] No commands to register`, { color: "blue", ignore: !this.botOptions.logging });

        Logger.run(`[Global Slash Commands] Registering...`, { color: "blue", stringBefore: "\n", ignore: !this.botOptions.logging });
        const data: any = await this.rest.put(Routes.applicationCommands(this.user.id), { body });
        Logger.run(`[Global Slash Commands] Succesfully registered ${data.length} of them. Done\n`, { color: "blue", ignore: !this.botOptions.logging });

    }

    async unregisterGlobalSlashCommands() {

        if (!this.isReady()) throw new Error("Bot isn't ready yet.");

        Logger.run(`[Global Slash Commands] Removing...`, { color: "blue", stringBefore: "\n", ignore: !this.botOptions.logging });
        await this.rest.put(Routes.applicationCommands(this.user.id), { body: [] });
        Logger.run(`[Global Slash Commands] Succesfully wiped all global commands. Done\n`, { color: "blue" });

    }

}

export default Bot;