import { Sequelize } from "sequelize";
import Logger from "../structures/Logger";

const connection = new Sequelize({
    dialect: "mariadb",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

interface AuthenticateConnectionOptions {
    logging: boolean
}

export async function authenticateConnection(options: AuthenticateConnectionOptions) {
    await connection.authenticate();
    Logger.run(`Authenticated and connected\n`, {
        color: "blue", ignore: !options.logging, stringBefore: "\n", category: "Database"
    });
}

export function getConnection() {
    return connection;
}