const {Sequelize} = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_CONNECTION,
        port: process.env.DB_PORT,
    }
);

module.exports = sequelize;