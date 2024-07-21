const Sequelize = require("sequelize");
const databaseManager = require("../index");
const Users = databaseManager.define("users", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    pictureURL: Sequelize.STRING
});
module.exports = Users;