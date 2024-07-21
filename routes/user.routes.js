const userController = require("../controllers/user.controller");

module.exports = function(app, opt, done) {
    /**
     * @openapi
     * /users:
     *  get:
     *      tags: [users]
     *      description: Request a list of registered users
     *      parameters:
     *          - in: query
     *            name: page
     *            schema:
     *              type: integer
     *            description: If there are more than 10 registered users, you can use this parameter to go to the next page.
     *      responses:
     *          200:
     *              description: Returns a list of users.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: array
     *                          items:
     *                              $ref: "#/components/schemas/UserWithRelationship"
     *          404:
     *              description: Returns an error message when an user wasn't found or there are no users in database.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Couldn't find the requested user.
     */
    app.get("/users", userController.get);
    /**
     * @openapi
     * /users/{id}:
     *  get:
     *      tags: [users]
     *      description: Request information for an specific user by ID
     *      parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            description: The ID of the user you want to retrieve info.
     *      responses:
     *          200:
     *              description: Returns the information of an user.
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: "#/components/schemas/UserWithRelationship"
     *          404:
     *              description: Returns an error message when an user couldn't be found.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Couldn't find the requested user.
     */
    app.get("/users/:id", userController.get);
    /**
     * @openapi
     * /users:
     *  post:
     *      tags: [users]
     *      description: Create a new user
     *      requestBody:
     *          description: \"name\" is the only parameter that's required, if not defined, pictureURL will be set at a default value.
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/BaseUser"
     *      responses:
     *          200:
     *              description: The user was created and a message is returned.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: User created successfully!
     *          400:
     *              description: This error is shown when you don't specify the \"name\" parameter.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: You have to specify a 'name' parameter.
     *          409:
     *              description: There's already an user on the database that has the requested name.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: There's already an user with this name.
     *          500:
     *              description: Returns an error message if an user couldn't be created for some reason
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Failed while creating a new user, please contact the owner of this site.
     */
    app.post("/users", userController.create);
    /**
     * @openapi
     * /users/{id}:
     *  patch:
     *      tags: [users]
     *      description: Modify an existing user
     *      parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            description: The ID of the user you want to modify.
     *      requestBody:
     *          description: If there's a missing parameter, it won't be changed and left as is.
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/BaseUser"
     *      responses:
     *          200:
     *              description: The user was modified and a message is returned.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: User modified successfully!
     *          400:
     *              description: Returns an error message if you left the \"id\" path parameter in blank.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: You have to specify an valid ID of the user you want to modify.
     *          500:
     *              description: Returns an error message if an user couldn't be modified for some reason.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Failed while modifying this user, please contact the owner of this site.
     */
    app.patch("/users/:id", userController.modify);
    /**
     * @openapi
     * /users/{id}:
     *  delete:
     *      tags: [users]
     *      description: Delete an existing user
     *      parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            description: The ID of the user you want to delete.
     *      responses:
     *          200:
     *              description: The user was deleted and a message is returned.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: User deleted successfully!
     *          400:
     *              description: Returns an error message if you left the \"id\" path parameter in blank.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: You have to specify an valid ID of the user you want to delete.
     *          500:
     *              description: Returns an error message if an user couldn't be deleted for some reason.
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                                  example: Failed while trying to delete this user, please make sure it exists and try again, or contact the owner of this site.
     */
    app.delete("/users/:id", userController.delete);
    done();
}