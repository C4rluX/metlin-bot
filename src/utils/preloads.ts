import { Collection } from "discord.js";
import { registerFont, loadImage, Image } from "canvas";
import { readdir, readFile } from "node:fs/promises";
import * as path from "node:path";
import Logger from "../structures/Logger";

const resources = new Collection<string, any>();

interface PreloadsOptions {
    logging: boolean
}

export async function load(options: PreloadsOptions) {

    const folders = await readdir(path.join(require.main?.path || "", "resources"), { withFileTypes: true });
    const loaded: string[] = [];

    for (const index in folders) {

        const folder = folders[index];
        if (!folder.isDirectory()) continue;
        const files = await readdir(path.join(require.main?.path || "", "resources", folder.name));

        for (let index in files) {

            const file = path.join(require.main?.path || "", "resources", folder.name, files[index]);
            const name = files[index].slice(0, files[index].lastIndexOf("."));
            const extension = files[index].slice(files[index].lastIndexOf("."));
    
            if (extension === ".ttf") {
                registerFont(file, { family: name });
                registerFont(file, { family: `${name}1` });
                // Registering the same font twice with a different family name made italics and bold
                // styles work later (idk exactly why). So yea, i'll just keep this xd
            }
    
            if (extension === ".png" || extension === ".jpg") {
                const resource = await loadImage(file);
                resources.set(name, resource);
            }
    
            if (extension === ".html") {
                const resource = await readFile(file);
                resources.set(name, resource);
            }

            loaded.push(files[index]);
    
        }

    }

    Logger.run(`[Preloads] Loaded: ${loaded.join(", ") || "None"}\n`, { color: "blue", ignore: !options.logging, stringBefore: "\n" });

}

export function get(name: string): Image | Buffer | null {
    return resources.get(name) ?? null;
}