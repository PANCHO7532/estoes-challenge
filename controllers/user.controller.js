const projectDatabase = require("../database/models/project.db");
const userDatabase = require("../database/models/user.db");
exports.get = async(req, res, next) => {
    const amountOfUsers = await userDatabase.count();
    if(amountOfUsers == 0) {
        await res.code(404).send({ error: "No users on database." });
        return;
    }
    if(!!req.params.id && req.params.id != "") {
        const requestedUser = await userDatabase.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: projectDatabase,
                    as: "assignedUserProjects",
                    through: { attributes: [] }
                },
                {
                    model: projectDatabase,
                    as: "assignedManagerProjects",
                    through: { attributes: [] }
                }
            ]
        });
        if(!requestedUser) { await res.code(404).send({error: "Couldn't find the requested user."}); return; }
        await res.send(requestedUser);
        return;
    }
    if(amountOfUsers > 10) {
        const listOfUsers = await userDatabase.findAndCountAll({
            include: [
                {
                    model: projectDatabase,
                    as: "assignedUserProjects",
                    through: { attributes: [] }
                },
                {
                    model: projectDatabase,
                    as: "assignedManagerProjects",
                    through: { attributes: [] }
                }
            ],
            limit: 10,
            offset: (!!req.query.page && !isNaN(req.query.page)) && req.query.page > 0 ? (parseInt(req.query.page) - 1) * 10 : 0
        });
        if(listOfUsers.rows.length == 0) { await res.code(404).send({ error: "The requested page does not exist." }); return; }
        await res.send(listOfUsers.rows);
        return;
    } else if(amountOfUsers < 11 && parseInt(req.query.page) > 1) {
        await res.code(404).send({ error: "The requested page does not exist" }); return;
    }
    const listOfUsers = await userDatabase.findAll({
        include: [
            {
                model: projectDatabase,
                as: "assignedUserProjects",
                through: { attributes: [] }
            },
            {
                model: projectDatabase,
                as: "assignedManagerProjects",
                through: { attributes: [] }
            }
        ]
    });
    await res.send(listOfUsers);
    return;
}
exports.create = async(req, res, next) => {
    if(!req.body.name || req.body.name == "") { await res.code(400).send({ error: "You have to specify a 'name' parameter." }); return; }
    if(await userDatabase.findOne({ where: { name: req.body.name } })) {
        await res.code(409).send({ error: "There's already an user with this name." });
        return;
    }
    if(await userDatabase.create({
        name: req.body.name,
        pictureURL: !!req.body.pictureURL && req.body.pictureURL != "" ? req.body.pictureURL : "/assets/defaultProfile.png"
    })) {
        await res.send({ message: "User created successfully!" });
    } else {
        await res.code(500).send({ error: "Failed while creating a new user, please contact the owner of this site." });
    }
    return;
}
exports.modify = async(req, res, next) => {
    if((!req.params.id || req.params.id == "") || (isNaN(req.params.id) || req.params.id < 1)) {
        await res.code(400).send({ error: "You have to specify an valid ID of the user you want to modify." });
        return;
    }
    const userToModify = await userDatabase.findOne({ where: { id: req.params.id } });
    if(userToModify) {
        !!req.body.name && req.body.name != "" ? userToModify.name = req.body.name : null;
        !!req.body.pictureURL && req.body.pictureURL != "" ? userToModify.pictureURL = req.body.pictureURL : null;
        await userToModify.save();
        await res.send({ message: "User modified successfully!" });
    } else {
        await res.code(500).send({ error: "Failed while modifying this user, please make sure it exists and try again, or contact the owner of this site." });
    }
    return;
}
exports.delete = async(req, res, next) => {
    if((!req.params.id || req.params.id == "") || (isNaN(req.params.id) || req.params.id < 1)) {
        await res.code(400).send({ error: "You have to specify an valid ID of the user you want to delete." });
        return;
    }
    if(await userDatabase.destroy({ where: { id: req.params.id } })) {
        await res.send({ message: "User deleted successfully!" });
    } else {
        await res.code(500).send({ error: "Failed while trying to delete this user, please make sure it exists and try again, or contact the owner of this site." });
    }
    return;
}