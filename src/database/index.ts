import { Sequelize } from "sequelize";

const connection = new Sequelize({
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

export default connection;