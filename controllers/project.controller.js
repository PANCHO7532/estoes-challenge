const Sequelize = require("sequelize");
const projectDatabase = require("../database/models/project.db");
const userDatabase = require("../database/models/user.db");
exports.get = async(req, res, next) => {
    const amountOfProjects = await projectDatabase.count();
    if(amountOfProjects == 0) {
        await res.code(404).send({ error: "No projects on database." });
        return;
    }
    if(!!req.params.id && req.params.id != "") {
        // search by id
        const requestedProject = await projectDatabase.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: userDatabase,
                    as: "assignedUsers",
                    through: { attributes: [] }
                },
                {
                    model: userDatabase,
                    as: "assignedManagers",
                    through: { attributes: [] }
                }
            ]
        });
        if(!requestedProject) { await res.code(404).send({error: "Couldn't find the requested project."}); return; }
        await res.send(requestedProject);
        return;
    }
    if(!!req.query.name && req.query.name != "") {
        // search by project name
        if(amountOfProjects > 10) {
            const requestedProjects = await projectDatabase.findAndCountAll({
                where: {
                    name: {
                        [Sequelize.Op.like]: "%" + req.query.name + "%"
                    }
                },
                include: [
                    {
                        model: userDatabase,
                        as: "assignedUsers",
                        through: { attributes: [] }
                    },
                    {
                        model: userDatabase,
                        as: "assignedManagers",
                        through: { attributes: [] }
                    }
                ],
                offset: (!!req.query.page && !isNaN(req.query.page)) && req.query.page > 0 ? (parseInt(req.query.page) - 1) * 10 : 0,
                limit: 10
            });
            if(!requestedProjects || requestedProjects.count == 0) { await res.code(404).send({error: "Couldn't find the requested project(s)."}); return; }
            if(requestedProjects.rows.length == 0) { await res.code(404).send({ error: "The requested page does not exist." }); return; }
            await res.send(requestedProjects.rows);
            return;
        } else {
            const requestedProjects = await projectDatabase.findAll({
                where: {
                    name: {
                        [Sequelize.Op.like]: "%" + req.query.name + "%"
                    }
                },
                include: [
                    {
                        model: userDatabase,
                        as: "assignedUsers",
                        through: { attributes: [] }
                    },
                    {
                        model: userDatabase,
                        as: "assignedManagers",
                        through: { attributes: [] }
                    }
                ]
            });
            if(!!req.query.page && parseInt(req.query.page) > 1) { await res.code(404).send({ error: "The requested page does not exist." }); return; }
            if(!requestedProjects) { await res.code(404).send({error: "Couldn't find the requested project(s)."}); return; }
            await res.send(requestedProjects);
            return;
        }
    }
    // default action without any parameters, just the project list.
    // if there are more than 10 projects we start paginating them.
    if(amountOfProjects > 10) {
        const requestedProjects = await projectDatabase.findAndCountAll({
            include: [
                {
                    model: userDatabase,
                    as: "assignedUsers",
                    through: { attributes: [] }
                },
                {
                    model: userDatabase,
                    as: "assignedManagers",
                    through: { attributes: [] }
                }
            ],
            offset: (!!req.query.page && !isNaN(req.query.page)) && req.query.page > 0 ? (parseInt(req.query.page) - 1) * 10 : 0,
            limit: 10
        });
        if(!requestedProjects) { await res.code(404).send({error: "Couldn't find the requested project(s)."}); return; }
        if(requestedProjects.rows.length == 0) { await res.code(404).send({ error: "The requested page does not exist." }); return; }
        await res.send(requestedProjects.rows);
        return;
    } else if(amountOfProjects < 11 && parseInt(req.query.page) > 1) {
        await res.code(404).send({ error: "The requested page does not exist." }); return;
    }
    const listOfProjects = await projectDatabase.findAll({
        include: [
            {
                model: userDatabase,
                as: "assignedUsers",
                through: { attributes: [] }
            },
            {
                model: userDatabase,
                as: "assignedManagers",
                through: { attributes: [] }
            }
        ]
    });
    await res.send(listOfProjects);
    return;
}
exports.create = async(req, res, next) => {
    if(!req.body.name || req.body.name == "") { await res.code(400).send({ error: "You have to specify a 'name' parameter." }); return; }
    if(await projectDatabase.findOne({ where: { name: req.body.name } })) {
        await res.code(409).send({ error: "There's already an project with this name." });
        return;
    }
    if(await projectDatabase.create({
        name: req.body.name,
        description: !!req.body.description && req.body.description != "" ? req.body.description : "[No description given]",
        status: (req.body.status != undefined) && typeof req.body.status === "boolean" ? req.body.status : true
    })) {
        await res.send({ message: "Project created successfully!" });
    } else {
        await res.code(500).send({ error: "Failed while creating a new project, please contact the owner of this site." });
    }
    return;
}
exports.modify = async(req, res, next) => {
    if((!req.params.id || req.params.id == "") || (isNaN(req.params.id) || req.params.id < 1)) {
        await res.code(400).send({ error: "You have to specify an valid ID of the project you want to modify." });
        return;
    }
    const projectToModify = await projectDatabase.findOne({ where: { id: req.params.id } });
    if(projectToModify) {
        !!req.body.name && req.body.name != "" ? projectToModify.name = req.body.name : null;
        !!req.body.description && req.body.description != "" ? projectToModify.description = req.body.description : null;
        (req.body.status != undefined) && typeof req.body.status === "boolean" ? projectToModify.status = req.body.status : null;
        await projectToModify.save();
        await res.send({ message: "Project modified successfully!" });
    } else {
        await res.code(500).send({ error: "Failed while modifying this project, please make sure it exists and try again, or contact the owner of this site." });
    }
    return;
}
exports.assign = async(req, res, next) => {
    if((!req.params.id || req.params.id == "") || (isNaN(req.params.id) || req.params.id < 1)) {
        await res.code(400).send({ error: "You have to specify an valid ID of the project you want to assign an user to." });
        return;
    }
    if(!req.body.targetUser || typeof req.body.targetUser !== "number") { await res.code(400).send({ error: "You have to specify a 'targetUser' parameter with the User ID you want to assign the project to." }); return; }
    if((req.body.asManager == undefined) || typeof req.body.asManager !== "boolean") { await res.code(400).send({ error: "You have to specify an 'asManager' parameter as boolean." }); return; }
    const targetProject = await projectDatabase.findOne({ where: { id: req.params.id, status: true } });
    if(!targetProject) { await res.code(404).send({ error: "Couldn't find the requested project or it's not active." }); return; }
    const targetUser = await userDatabase.findOne({ where: { id: req.body.targetUser } });
    if(!targetUser) { await res.code(404).send({ error: "Couldn't find the targeted user." }); return; }
    if(req.body.asManager) {
        await targetProject.addAssignedManagers(targetUser)
            ? await res.send({ message: "The requested user was successfully assigned to this project." })
            : await res.code(500).send({ error: "The requested user couldn't be assigned to this project, please contact the owner of this site for more information." })
    } else {
        await targetProject.addAssignedUsers(targetUser)
            ? await res.send({ message: "The requested user was successfully assigned to this project." })
            : await res.code(500).send({ error: "The requested user couldn't be assigned to this project, please contact the owner of this site for more information." })
    }
    return;
}
exports.unassign = async(req, res, next) => {
    if((!req.params.id || req.params.id == "") || (isNaN(req.params.id) || req.params.id < 1)) {
        await res.code(400).send({ error: "You have to specify an valid ID of the project you want to unassign an user to." });
        return;
    }
    if(!req.body.targetUser || typeof req.body.targetUser !== "number") { await res.code(400).send({ error: "You have to specify a 'targetUser' parameter with the User ID you want to unassign the project to." }); return; }
    if((req.body.asManager == undefined) || typeof req.body.asManager !== "boolean") { await res.code(400).send({ error: "You have to specify an 'asManager' parameter as boolean." }); return; }
    const targetProject = await projectDatabase.findOne({ where: { id: req.params.id, status: true } });
    if(!targetProject) { await res.code(404).send({ error: "Couldn't find the requested project or it's not active." }); return; }
    const targetUser = await userDatabase.findOne({ where: { id: req.body.targetUser } });
    if(!targetUser) { await res.code(404).send({ error: "Couldn't find the targeted user." }); return; }
    if(req.body.asManager) {
        await targetProject.removeAssignedManagers(targetUser)
            ? await res.send({ message: "The requested user was successfully removed from this project." })
            : await res.code(500).send({ error: "The requested user couldn't be removed from this project, please check if it's assigned to this project and try again." })
    } else {
        await targetProject.removeAssignedUsers(targetUser)
            ? await res.send({ message: "The requested user was successfully removed from this project." })
            : await res.code(500).send({ error: "The requested user couldn't be removed from this project, please check if it's assigned to this project and try again." })
    }
    return;
}
exports.delete = async(req, res, next) => {
    if((!req.params.id || req.params.id == "") || (isNaN(req.params.id) || req.params.id < 1)) {
        await res.code(400).send({ error: "You have to specify an valid ID of the project you want to delete." });
        return;
    }
    if(await projectDatabase.destroy({ where: { id: req.params.id } })) {
        await res.send({ message: "Project deleted successfully!" });
    } else {
        await res.code(500).send({ error: "Failed while trying to delete this project, please make sure it exists and try again, or contact the owner of this site." });
    }
    return;
}