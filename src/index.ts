import { Sequelize } from "sequelize";

const client = new Sequelize({
    dialect: "mariadb",
    port: 3306,
    host: "localhost",
    username: "root",
    password: "youshallnotpass"
});

export default client;
