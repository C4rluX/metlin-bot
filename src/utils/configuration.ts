import path from "node:path";
import config from "../../config";
import uncacheModule from "./uncache-module";

const filePath = path.join(process.cwd(), "config")
let data: typeof config | null = null;

export async function load() {
    uncacheModule(filePath);
    data = (await import(filePath)).default as typeof config;
}

export function getConfig() {
    if (!data) throw new Error("Config is not loaded.");
    return data;
}