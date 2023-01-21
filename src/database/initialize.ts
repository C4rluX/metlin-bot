import { access, readdir } from "node:fs/promises";
import path from "node:path";
import connection from ".";
import Logger from "../structures/Logger";
import uncacheModule from "../utils/uncache-module";

interface InitializeConnectionOptions {
    logging: boolean
}

export default async function initialize(options: InitializeConnectionOptions) {

    let models: string[] = [];
    try {
        models = await readdir(path.join(__dirname, "models"));
    } catch (err) { }
    
    for (const index in models) {
        const modelPath = path.join(__dirname, "models", models[index]);
        uncacheModule(modelPath);
        const model = (await import(modelPath)).default;
        model(connection);
    }

    await connection.sync({ alter: true });
    await connection.authenticate();

    Logger.run(`Connected and synchronized in: ${connection.getDatabaseName()} (${process.env.DB_HOST} - ${connection.getDialect()})`, {
        color: "blue", ignore: !options.logging, stringBefore: "\n", category: "Database"
    });

    const loaded = Object.keys(connection.models);
    Logger.run(`Loaded ${loaded.length} models ${loaded.length ? `(${loaded.join(", ")})` : ""}\n`, {
        color: "blue", ignore: !options.logging, category: "Database"
    });

}