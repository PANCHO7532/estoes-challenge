const Sequelize = require("sequelize");
const databaseManager = require("../index");
const Users = require("./user.db");
const Projects = databaseManager.define("projects", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    status: Sequelize.BOOLEAN
});
module.exports = Projects;