import { readdir } from "node:fs/promises";
import path from "node:path";
import { Sequelize } from "sequelize";
import Logger from "../structures/Logger";
import uncacheModule from "../utils/uncache-module";

export const connection = new Sequelize({
    dialect: "mariadb",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD ?? undefined,
    database: process.env.DB_NAME,
    dialectOptions: {
        connectTimeout: 5000
    },
    logging: () => {}
});


interface InitializeConnectionOptions {
    logging: boolean
}

export async function initialize(options: InitializeConnectionOptions) {

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

export async function ping() {
    const time = performance.now();
    await connection.authenticate();
    return performance.now() - time;
}