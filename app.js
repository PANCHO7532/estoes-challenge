const configFile = require("./config/config.inc.json");
const packageFile = require("./package.json");
const helpers = require("./helpers");
const path = require("path");
const fastify = require("fastify")({logger: helpers.isDevelopment() ? true : false});
const swaggerJSDoc = require("swagger-jsdoc");
const database = require("./database");
const swaggerOptions = {
    openapi: "3.0.0",
    info: {
        title: packageFile.name,
        description: packageFile.description,
        version: packageFile.version,
        contact: {
            name: packageFile.author.name,
            email: packageFile.author.email,
            url: packageFile.author.url
        }
    },
    servers: [
        { url: "http://localhost:3000" }
    ],
    tags: [
        { name: "projects", description: "Endpoints for explore, create, modify, delete and assign projects to users." },
        { name: "users", description: "Endpoints used for explore, create, modify and delete users." }
    ],
    components: {
        schemas: {
            BaseProject: {
                type: "object",
                properties: {
                    name: { type: "string", example: "Sample Project Name" },
                    description: { type: "string", example: "This is a project description" },
                    status: { type: "boolean", example: true }
                }
            },
            ProjectWithoutRelationship: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Sample Project Name" },
                    description: { type: "string", example: "This is a project description" },
                    status: { type: "boolean", example: true }
                }
            },
            ProjectWithRelationship: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Sample Project Name" },
                    description: { type: "string", example: "This is a project description" },
                    status: { type: "boolean", example: true },
                    assignedUsers: { type: "array", items: { $ref: "#/components/schemas/UserWithoutRelationship" } },
                    assignedManagers: { type: "array", items: { $ref: "#/components/schemas/UserWithoutRelationship" } },
                }
            },
            BaseUser: {
                type: "object",
                properties: {
                    name: { type: "string", example: "John Doe" },
                    pictureURL: { type: "string", example: "/assets/defaultProfile.png" }
                }
            },
            UserWithoutRelationship: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "John Doe" },
                    pictureURL: { type: "string", example: "/assets/defaultProfile.png" }
                }
            },
            UserWithRelationship: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "John Doe" },
                    pictureURL: { type: "string", example: "/assets/defaultProfile.png" },
                    assignedUserProjects: { type: "array", items: { $ref: "#/components/schemas/ProjectWithoutRelationship" } },
                    assignedManagerProjects: { type: "array", items: { $ref: "#/components/schemas/ProjectWithoutRelationship" } }
                }
            },
            ProjectAssignment: {
                type: "object",
                properties: {
                    targetUser: { type: "integer", example: 1},
                    asManager: { type: "boolean", example: false}
                }
            }
        }
    }
}
fastify.register(require("./routes/project.routes"));
fastify.register(require("./routes/user.routes"));
fastify.register(require("@fastify/static"), { root: path.join(__dirname, 'public') });
fastify.register(require("@fastify/swagger"), {
    openapi: swaggerJSDoc({swaggerDefinition: swaggerOptions, apis: ["routes/*.routes.js"]})
});
fastify.register(require("@fastify/swagger-ui"), {
    routePrefix: "/swagger-ui",
    staticCSP: true,
    uiConfig: {
        /*docExpansion: "full",*/
        deepLinking: false
    }
});
fastify.listen({port: configFile.httpPort, host: configFile.httpHost}, async(err, addr) => {
    if(err) { console.log(`[ERROR] ${err}`); process.exit(1); }
    console.log(`[INFO] Server started at ${configFile.httpHost} in port ${configFile.httpPort}`);
    fastify.swagger();
    try {
        await database.sync({
            alter: helpers.isDevelopment() ? true : false,
            force: helpers.isDevelopment() ? true : false,
            logging: helpers.isDevelopment() ? console.log : false
        });
    } catch(e) { console.log(`[ERROR] Couldn't sync database! ${e}`); }
    if(helpers.isDevelopment()) {
        database.populateWithSampleData();
    }
});