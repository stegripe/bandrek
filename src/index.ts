import { Sequelize } from "@sequelize/core";

const client = new Sequelize({
    dialect: "mariadb",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    dialectOptions: {
        supportBigNumbers: true,
        connectTimeout: 60000000,
        queryTimeout: 60000000,
    },
});

export default client;
