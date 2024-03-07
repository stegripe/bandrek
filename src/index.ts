import { Sequelize } from "sequelize";

const client = new Sequelize({
    dialect: "mariadb",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "youshallnotpass",
});

export default client;
