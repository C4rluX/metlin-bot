import { ActionRowBuilder, Client, Collection, EmbedBuilder, GatewayIntentBits, Partials, REST, Routes, TextChannel, User } from "discord.js";
import { readdir } from "node:fs/promises";
import { Dirent } from "node:fs";
import * as path from "node:path";
import uncacheModule from "../utils/uncache-module";
import Command from "./Command";
import Event from "./Event";
import Logger from "./Logger";
import SlashCommand from "./SlashCommand";
import SlashCommandSubCommand from "./SlashCommandSubcommand";
import config from "../../config";

interface BotOptions {
    logging: boolean
}

interface LoadBotOptions {
    logging?: boolean
}

export interface SimpleMessagePayload {
    content?: string,
    embeds?: EmbedBuilder[],
    components: ActionRowBuilder[],
    ephemeral?: boolean
}

class Bot extends Client {

    public commands = new Collection<string, Command>();
    public interactions = {
        commands: new Collection<string, SlashCommand>(),
        subcommands: new Collection<string, SlashCommandSubCommand>(),
    }
    public botOptions: BotOptions;
    public owners: User[] = [];
    public startedAt: number = 0;

    private _loaded: boolean = false;

    get loaded() {
        return this._loaded;
    }

    set loaded(x: boolean) {
        if (x) this.startedAt = Date.now();
        this._loaded = x;
    }

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
        this.rest.setToken(process.env.BOT_TOKEN ?? "")
        this.botOptions = options;
    }

    async load(options: LoadBotOptions) {

        this.removeAllListeners();

        this.commands = await this.loadModules("commands") as Collection<string, Command>;
        this.interactions.commands = await this.loadModules("interactions/commands") as Collection<string, SlashCommand>;
        this.interactions.subcommands = await this.loadModules("interactions/subcommands") as Collection<string, SlashCommandSubCommand>;

        const botEvents = await this.loadEvents("bot");
        const restEvents = await this.loadEvents("rest");

        Logger.run(`Loaded commands: ${this.commands.map(e => e.name).join(", ") || "None"}`, {
            color: "blue", ignore: !options.logging, stringBefore: "\n", category: "Bot"
        });

        Logger.run(`Loaded slash commands: ${this.interactions.commands.map(e => e.data.name).join(", ") || "None"}`, {
            color: "blue", ignore: !options.logging, category: "Bot"
        });

        Logger.run(`Loaded events: ${botEvents.map(e => e.name).join(", ") || "None"}`, {
            color: "blue", ignore: !options.logging, category: "Bot"
        });

        Logger.run(`Loaded Discord API REST events: ${restEvents.map(e => e.name).join(", ") || "None"}`, {
            color: "blue", ignore: !options.logging, category: "Bot"
        });

        this.owners = await Promise.all(
            config.developers.map(id => this.users.fetch(id))
        )

        Logger.run(`Loaded owners: ${this.owners.map(e => e.tag) || "None"}`, {
            color: "blue", ignore: !options.logging, category: "Bot"
        });

    }

    async start() {
        this.login(process.env.BOT_TOKEN)
        .then(() => { this.startedAt = Date.now() })
        .catch(err => {
            Logger.run(`Error when starting client:\n${err.stack ? err.stack : err}`, {
                color: "red", category: "Fatal"
            });
            process.exit();
        });
    }

    async loadModules(where: "commands" | "interactions/commands" | "interactions/subcommands" | "interactions/buttons"): Promise<Collection<any, any>> {

        let folders: Dirent[] = [];
        const collection = new Collection<any, any>();
        try {
            folders = await readdir(path.join(require.main?.path || "", where), { withFileTypes: true });
        } catch (err) { return collection; }
        for (const index in folders) {
            const folder = folders[index];
            if (!folder.isDirectory()) continue;
            const files = (await readdir(path.join(require.main?.path || "", where, folder.name))).filter(e => e.endsWith(".ts") || e.endsWith(".js"));
            for (const index in files) {
                const filePath = path.join(require.main?.path || "", where, folder.name, files[index]);
                uncacheModule(filePath);
                const module = (await import(filePath)).default;
                collection.set(module.name ? module.name : module.data.name, module);
            }
        }
        return collection;

    }

    async loadEvents(where: "bot" | "rest") {

        const events: Event[] = [];
        let files: string[] = [];
        try {
            files = (await readdir(path.join(require.main?.path || "", `events`, where)))
            .filter(e => e.endsWith(".ts") || e.endsWith(".js"));
        } catch (err) { return events; }
        
        for (const index in files) {

            const filePath = path.join(require.main?.path || "", `events`, where, files[index]);
            uncacheModule(filePath);
            const event: Event = (await import(filePath)).default;
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
        if (!body.length) {
            return Logger.run(`No commands to register\n`, {
                color: "blue", stringBefore: "\n", ignore: !this.botOptions.logging, category: "Guild Slash Commands"
            });
        }

        Logger.run(`Registering...`, {
            color: "blue", stringBefore: "\n", ignore: !this.botOptions.logging, category: "Guild Slash Commands"
        });

        for (let index in guilds) {
            const guildId = guilds[index];
            const guild = this.guilds.cache.get(guildId);
            if (!guild) continue;
            const data: any = await this.rest.put(Routes.applicationGuildCommands(this.user.id, guild.id), { body });
            Logger.run(`Succesfully registered ${data.length} of them in "${guild.name}" (ID: ${guild.id})`, {
                color: "blue", ignore: !this.botOptions.logging, category: "Guild Slash Commands"
            });
        }
        Logger.run(`Done\n`, {
            color: "blue", ignore: !this.botOptions.logging, category: "Guild Slash Commands"
        });

    }

    async unregisterSlashCommandsInGuilds(guilds: string[]) {

        if (!this.isReady()) throw new Error("Bot isn't ready yet.");
        if (!guilds.length) return;

        Logger.run(`Removing...`, {
            color: "blue", stringBefore: "\n", ignore: !this.botOptions.logging, category: "Guild Slash Commands"
        });

        for (let index in guilds) {
            const guildId = guilds[index];
            const guild = this.guilds.cache.get(guildId);
            if (!guild) continue;
            await this.rest.put(Routes.applicationGuildCommands(this.user.id, guild.id), { body: [] });
            Logger.run(`Succesfully removed all commands from "${guild.name}" (ID: ${guild.id})`, {
                color: "blue", ignore: !this.botOptions.logging, category: "Guild Slash Commands"
            });
        }

        Logger.run(`Done\n`, {
            color: "blue", ignore: !this.botOptions.logging, category: "Guild Slash Commands"
        });

    }

    async registerGlobalSlashCommands() {

        if (!this.isReady()) throw new Error("Bot isn't ready yet.");
        const body = this.interactions.commands.map(e => e.data.toJSON());

        if (!body.length) {
            return Logger.run(`No commands to register`, {
                color: "blue", ignore: !this.botOptions.logging, category: "Global Slash Commands"
            });
        }

        Logger.run(`Registering...`, {
            color: "blue", stringBefore: "\n", ignore: !this.botOptions.logging, category: "Global Slash Commands"
        });

        const data: any = await this.rest.put(Routes.applicationCommands(this.user.id), { body });
        Logger.run(`Succesfully registered ${data.length} of them. Done\n`, {
            color: "blue", ignore: !this.botOptions.logging, category: "Global Slash Commands"
        });

    }

    async unregisterGlobalSlashCommands() {

        if (!this.isReady()) throw new Error("Bot isn't ready yet.");

        Logger.run(`Removing...`, {
            color: "blue", stringBefore: "\n", ignore: !this.botOptions.logging, category: "Global Slash Commands"
        });

        await this.rest.put(Routes.applicationCommands(this.user.id), { body: [] });
        Logger.run(`Succesfully removed all global commands. Done\n`, {
            color: "blue", category: "Global Slash Commands"
        });

    }

}

export default Bot;