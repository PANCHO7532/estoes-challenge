const projectController = require("../controllers/project.controller");

module.exports = function(app, opt, done) {
    /**
     * @openapi
     * /projects:
     *  get:
     *      tags: [projects]
     *      description: Request a list of projects
     *      parameters:
     *          - in: query
     *            name: name
     *            schema:
     *              type: string
     *            description: Search an project by name
     *          - in: query
     *            name: page
     *            schema:
     *              type: integer
     *            description: If there are more than 10 projects, you can use this parameter to go to the next page.
     *      responses:
     *          200:
     *              description: Returns a list of projects.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: array
     *                          items:
     *                              $ref: "#/components/schemas/ProjectWithRelationship"
     *          404:
     *              description: Returns an error message either if there are no projects that match the request, or you requested an invalid page
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Couldn't find the requested project.
     */
    app.get("/projects", projectController.get);
    /**
     * @openapi
     * /projects/{id}:
     *  get:
     *      tags: [projects]
     *      description: Request information of an specific project by ID
     *      parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            description: The ID of the project you want to retrieve info.
     *      responses:
     *          200:
     *              description: Returns the information of the requested project
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: "#/components/schemas/ProjectWithRelationship"
     *          404:
     *              description: Returns an error message when the requested project couldn't be found.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Couldn't find the requested project.
     */
    app.get("/projects/:id", projectController.get);
    /**
     * @openapi
     * /projects:
     *  post:
     *      tags: [projects]
     *      description: Create a new project
     *      requestBody:
     *          description: \"name\" is the only parameter that's required, if not defined, description and status will take a default value.
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/BaseProject"
     *      responses:
     *          200:
     *              description: The project was created and a message is returned.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Project created successfully!
     *          400:
     *              description: This error is shown when you don't specify the \"name\" parameter.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: You have to specify a \"name\" parameter.
     *          409:
     *              description: There's already an project on the database that has the requested name.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: There's already an project with this name.
     *          500:
     *              description: Returns an error message if an project couldn't be created for some reason
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Failed while creating a new project, please contact the owner of this site.
     */
    app.post("/projects", projectController.create);
    /**
     * @openapi
     * /projects/{id}:
     *  post:
     *      tags: [projects]
     *      description: Modify an existing project
     *      parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            description: The ID of the project you want to modify.
     *      requestBody:
     *          description: If there's a missing parameter, it won't be changed and left as is.
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/BaseProject"
     *      responses:
     *          200:
     *              description: The project was modified and a message is returned.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Project modified successfully!
     *          400:
     *              description: Returns an error message if you left the \"id\" path parameter in blank.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: You have to specify an valid ID of the project you want to modify.
     *          500:
     *              description: Returns an error message if an project couldn't be modified either by not existing, or by an unknown reason.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Failed while modifying this project, please make sure it exists and try again, or contact the owner of this site.
     */
    app.post("/projects/:id", projectController.modify);
    /**
     * @openapi
     * /projects/assign/{id}:
     *  post:
     *      tags: [projects]
     *      description: Assign an user to a project
     *      parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            description: The ID of the project you want to assign an user. The project must have an \"active\" status upon assigning users.
     *      requestBody:
     *          description: \"targetUser\" is the ID of the user you want to assign this project to. If \"asManager\" is set to true, this user will be added as Project Manager to the project.
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/ProjectAssignment"
     *      responses:
     *          200:
     *              description: The user was assigned to this project and a message is returned.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: The requested user was successfully assigned to this project.
     *          400:
     *              description: Returns an error message if you left the path parameter \"id\" or the JSON parameters \"targetUser\" or \"asManager\" parameter in blank.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: You have to specify an valid ID of the project you want to assign an user to.
     *          404:
     *              description: Returns an error message if the project or the target user couldn't be found in the database and if the project is not active.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Couldn't find the requested project or it's not active.
     *          500:
     *              description: Returns an error message if an project couldn't be assigned to the user
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: The requested user couldn't be assigned to this project, please contact the owner of this site for more information.
     */
    app.post("/projects/assign/:id", projectController.assign);
    /**
     * @openapi
     * /projects/unassign/{id}:
     *  post:
     *      tags: [projects]
     *      description: Remove (unassign) an user from a project
     *      parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            description: The ID of the project you want to unassign an user. The project must have an \"active\" status upon removing users.
     *      requestBody:
     *          description: \"targetUser\" is the ID of the user you want to unassign this project to. If \"asManager\" is set to true, the system will remove the user as Project Manager instead.
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/ProjectAssignment"
     *      responses:
     *          200:
     *              description: The user was removed from this project and a message is returned.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: The requested user was successfully removed from this project.
     *          400:
     *              description: Returns an error message if you left the path parameter \"id\" or the JSON parameters \"targetUser\" or \"asManager\" parameter in blank.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: You have to specify an valid ID of the project you want to unassign an user to.
     *          404:
     *              description: Returns an error message if the project or the target user couldn't be found in the database and if the project is not active.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Couldn't find the requested project or it's not active.
     *          500:
     *              description: Returns an error message if an user couldn't be unassigned from the project or if there's not a relationship between the requested user and the project.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: The requested user couldn't be removed from this project, please check if it's assigned to this project and try again.
     */
    app.post("/projects/unassign/:id", projectController.unassign);
    /**
     * @openapi
     * /projects/{id}:
     *  delete:
     *      tags: [projects]
     *      description: Delete an existing project
     *      parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            description: The ID of the project you want to delete.
     *      responses:
     *          200:
     *              description: The project was deleted and a message is returned.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Project deleted successfully!
     *          400:
     *              description: Returns an error message if you left the \"id\" path parameter in blank.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: You have to specify an valid ID of the project you want to delete.
     *          500:
     *              description: Returns an error message if an project couldn't be deleted for some reason.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Failed while trying to delete this project, please make sure it exists and try again, or contact the owner of this site.
     */
    app.delete("/projects/:id", projectController.delete);
    done();
}