import { createWriteStream, writeFile } from "node:fs";
import * as path from "node:path";
import { stringifyAny } from "../utils/string-related";

interface ConsoleColors {
    default: string,
    green: string,
    red: string,
    yellow: string,
    cyan: string,
    magenta: string,
    blue: string
}

interface LoggerOptions {
    color?: keyof ConsoleColors,
    stringBefore?: string,
    hideHour?: boolean,
    ignore?: boolean,
    category?: string
}

export default class Logger {

    public static colors: ConsoleColors = {
        default: "\x1b[0m",
        green: "\x1b[32m",
        red: "\x1b[31m",
        yellow: "\x1b[33m",
        cyan: "\x1b[36m",
        magenta: "\x1b[35m",
        blue: "\x1b[34m",
    }

    private static logPath = path.join(process.cwd(), "output.log");
    private static output = createWriteStream(this.logPath, { flags: 'a', autoClose: true })

    /**
        @param {string} message 
    */
    public static run(message: any, options: LoggerOptions = {}) {

        if (!message) return;
        if (options.ignore) return; // Convenient option to just ignore this function, to make code with a lot of loggers more cleaner

        if (
            this.lastMessage.endsWith("\n\n") ||
            (options.stringBefore?.startsWith("\n") && this.lastMessage.endsWith("\n"))
        ) options.stringBefore = options.stringBefore?.trimStart();

        const stringified = (options.category ? `[${options.category}] ` : "") + stringifyAny(message);

        const color = options.color ? this.colors[options.color] : this.colors.default;
        const beforeString = options.stringBefore ? color + options.stringBefore + this.colors.default : '';
        const time = `${new Date().toLocaleTimeString("en-US", { hour12: true })} - `;

        const output = beforeString + (options.hideHour ? "" : color + time + this.colors.default) + stringified.split(/\r?\n/g).map(line => color + line + this.colors.default).join("\n");
        const cleanOutput = (options.stringBefore || "") + time + stringified;

        console.log(output);
        this.output.write(cleanOutput + "\n");
        this.lastMessage = cleanOutput;

    }

    public static lastMessage: string = "";

    public static clearFile() {
        writeFile(this.logPath, "", (err) => {
            if (err) this.run(err?.stack, { color: "red" });
        });
    }

}