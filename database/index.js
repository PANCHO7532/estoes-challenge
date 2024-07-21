const Sequelize = require("sequelize");
const configFile = require("../config/config.inc.json");
if(!configFile.mysqlHost) { console.log("[ERROR] No database hostname specified in your server configuration"); process.exit(1);}
if(!configFile.mysqlUsername) { console.log("[ERROR] No database username specified in your server configuration"); process.exit(1);}
if(!configFile.mysqlPassword) { console.log("[ERROR] No database password specified in your server configuration"); process.exit(1);}
if(!configFile.mysqlDatabaseName) { console.log("[ERROR] No database name specified in your server configuration"); process.exit(1);}
const sequelizeInstance = new Sequelize(configFile.mysqlDatabaseName, configFile.mysqlUsername, configFile.mysqlPassword, {
    host: configFile.mysqlHost,
    port: configFile.mysqlPort || 3306,
    dialect: "mysql",
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
module.exports = sequelizeInstance;
const Projects = require("./models/project.db");
const Users = require("./models/user.db");
Projects.belongsToMany(Users, { through: "userProjects", as: "assignedUsers" });
Projects.belongsToMany(Users, { through: "managerProjects", as: "assignedManagers" });
Users.belongsToMany(Projects, { through: "userProjects", as: "assignedUserProjects" });
Users.belongsToMany(Projects, { through: "managerProjects", as: "assignedManagerProjects" });

// auto populate with sample data
module.exports.populateWithSampleData = async function() {
    for(let a = 0; a < 15; a++) {
        let b = await Projects.create({ name: "Project" + (a+1), description: "[No description given]", status: true });
        let c = await Users.create({ name: "User" + (a+1), pictureURL: "/assets/defaultProfile.png" });
        b.addAssignedUsers(c);
        b.addAssignedManagers(c);
    }
};