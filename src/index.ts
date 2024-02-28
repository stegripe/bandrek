import { Sequelize } from "sequelize";

const client = new Sequelize({
    dialect: "mariadb",
    host: "localhost",
    password: "youshallnotpass",
    username: "root",
    port: 3306,
});
