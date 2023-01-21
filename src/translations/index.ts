import { Collection } from "discord.js";
import { readdir, readFile } from "fs/promises";
import path from "path";
import config from "../../config";
import Logger from "../structures/Logger";
import * as strings from "../utils/string-related";
import * as json from "../utils/json-related";

interface LoadTranslationsOptions {
    logging: boolean
}

const translations = new Collection<string, any>();

export async function load(options: LoadTranslationsOptions) {

    const folders = await readdir(path.join(__dirname), { withFileTypes: true });

    for (const index in folders) {
        if (!folders[index].isDirectory()) continue;
        const language = folders[index].name;
        const files = await readdir(path.join(__dirname, language));
        const data = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(__dirname, language, file);
                return JSON.parse(await readFile(filePath, { encoding: "utf-8" }));
            })
        )
        translations.set(language, Object.assign({}, ...data));
    }

    Logger.run(`Loaded: ${[...translations.keys()].join(", ")}\n`, {
        color: "blue", ignore: !options.logging, stringBefore: "\n", category: "Translations"
    });

}

export function validate(language: string) {
    const langByLocale = [...translations.keys()].find(key => {
        const data = translations.get(key);
        return data.general.locales.includes(language);
    });
    if (langByLocale) return langByLocale;
    return translations.has(language) ? language : config.defaults.lang;
}

interface GetStringOptions {
    lang?: string,
    variables?: any,
    slashCommandMeta?: "default" | "all"
}

export function get(name: string, options?: GetStringOptions): any {

    const lang = validate(options?.lang ?? "");
    const object = translations.get(lang);
    let data = json.accessByString(name, object);

    if (!data) {
        Logger.run(`Not found: ${name} (from language "${lang}")`, {
            color: "blue", ignore: !config.enable.translationsLogs, category: "Translations"
        });
    }

    if (options?.variables && data) {
        data = typeof data === "string" ? strings.parseVariables(data, options.variables) : json.parseVariables(data, options.variables);
    }

    return data;

}

export interface SlashCommandMeta {
    name: string,
    description: string,
    options?: any
}

interface GetSlashCommandMetaOptions {
    lang: "all" | "default"
}

export function getSlashCommandMeta(name: string, options: GetSlashCommandMetaOptions) {

    if (options.lang === "default") {
        const data = translations.get(config.defaults.lang);
        const meta = json.accessByString(`commands.slashCommandsMeta.${name}`, data);
        console.log({ meta });
        return meta;
    }

    const result: any = {};
    translations.forEach((data) => {
        const meta = json.accessByString(`commands.slashCommandsMeta.${name}`, data);
        data.general.locales.forEach((locale: string) => { result[locale] = meta; });
    });
    console.log({ result });
    return result;

}