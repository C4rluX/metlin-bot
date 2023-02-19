import { Collection, PermissionFlagsBits, PermissionsBitField, PermissionsString } from "discord.js";
import { readdir, readFile } from "fs/promises";
import path from "node:path";
import Logger from "../structures/Logger";
import * as strings from "./string-related";
import * as json from "./json-related";
import { getConfig } from "./configuration";
import permissionsCategories from "../resources/constants/permissions-categories.json";

interface LoadTranslationsOptions {
    logging: boolean
}

const translations = new Collection<string, any>();

export async function load(options: LoadTranslationsOptions) {

    const folders = await readdir(path.join(require.main?.path ?? "", "resources", "translations"), { withFileTypes: true });

    for (const index in folders) {
        if (!folders[index].isDirectory()) continue;
        const language = folders[index].name;
        const files = await readdir(path.join(require.main?.path ?? "", "resources", "translations", language));
        const data = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(require.main?.path ?? "", "resources", "translations", language, file);
                return JSON.parse(await readFile(filePath, { encoding: "utf-8" }));
            })
        )
        translations.set(language, Object.assign({}, ...data));
    }

    Logger.run(`Loaded: ${[...translations.keys()].join(", ")}\n`, {
        color: "blue", ignore: !options.logging, stringBefore: "\n", category: "Translations"
    });

}

function validate(language: string) {
    const langByLocale = [...translations.keys()].find(key => {
        const data = translations.get(key);
        return data.general.locales.includes(language);
    });
    if (langByLocale) return langByLocale;
    return translations.has(language) ? language : getConfig().defaults.lang;
}

interface GetStringOptions {
    lang?: string,
    variables?: any
}

export function get(name: string, options?: GetStringOptions): any {

    const lang = validate(options?.lang ?? "");
    const object = translations.get(lang);
    let data = json.accessByString(name, object);

    if (!data) {
        Logger.run(`Not found: ${name} (from language "${lang}")\n`, {
            color: "yellow", ignore: !getConfig().enable.translationsLogs, category: "Translations", stringBefore: "\n"
        });
    }

    if (options?.variables && data) {
        data = typeof data === "string" ? strings.parseVariables(data, options?.variables) : json.parseVariables(data, options?.variables);
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

export function getSlashCommandMeta(name: string, options: GetSlashCommandMetaOptions): any {

    if (options.lang === "default") {
        const data = translations.get(getConfig().defaults.lang);
        const meta = json.accessByString(`commands.slashCommandsMeta.${name}`, data);
        return meta;
    }

    const result: any = {};
    translations.forEach((data) => {
        const meta = json.accessByString(`commands.slashCommandsMeta.${name}`, data);
        data.general.locales.forEach((locale: string) => { result[locale] = meta; });
    });
    return result;

}

interface SecondsToReadableOptions {
    lang?: string,
    usingMiliseconds?: boolean 
}

export function secondsToReadable(secs: number, options?: SecondsToReadableOptions) {
    
    secs = Math.abs(Math.round(options?.usingMiliseconds ? secs / 1000 : secs));
    let timeData = {};

    if (secs < 3600) {

        const minutes = Math.floor(secs / 60);
        const seconds = secs - 60 * minutes;
        timeData = { minute: minutes, second: seconds }

    } else {

        const minutesRest = Math.floor(secs / 60);

        const hours = Math.floor(minutesRest / 60);
        const minutes = minutesRest - 60 * hours;
        const seconds = secs - (60 * minutes) - hours * 60 * 60;

        timeData = { hour: hours, minute: minutes, second: seconds }

    }

    const strings = get("general.time", { lang: options?.lang });

    return languageBasedJoin(
        Object.keys(timeData)
        .filter(e => timeData[e as keyof typeof timeData])
        .map(e => `${timeData[e as keyof typeof timeData]} ${
            (timeData[e as keyof typeof timeData] == 1) ?
            strings[e].word.toLowerCase() :
            strings[e].plural.toLowerCase()
        }`),
        { lang: options?.lang }
    );
    
}

interface LanguageBasedJoinOptions {
    lang?: string
}

export function languageBasedJoin(array: string[], options?: LanguageBasedJoinOptions) {
    if (array.length < 2) { return array.join(""); }
    else {
        const last = array.pop();
        return `${array.join(", ")} ${get("general.misc.and", { lang: options?.lang })} ${last}`;
    }
}

interface GetPermissionsNamesOptions {
    lang?: string,
    withCategories?: boolean
}

export function getPermissionsNames(permissions: PermissionsString[], options?: GetPermissionsNamesOptions): string[] {
    return permissions.map(permission => {
        if (options?.withCategories) {
            return `(${get(`general.permissionsCategories.${permissionsCategories[permission]}`, { lang: options?.lang })}) ` +
            get(`general.permissionsFlags.${permission}`, { lang: options?.lang });
        }
        return get(`general.permissionsFlags.${permission}`, { lang: options?.lang });
    });
}