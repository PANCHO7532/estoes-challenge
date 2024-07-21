# estoes-challenge
Backend API for managing projects 

## Requirements
- Node.JS, preferably the latest LTS version (v20 at this date) shown here: [https://nodejs.org/en/download/prebuilt-binaries](https://nodejs.org/en/download/prebuilt-binaries) - Other LTS versions like v12 and v18 should work fine as well, but they were not tested.

- MySQL/MariaDB database

## Setup instructions
- Once you've installed Node.JS and setup properly your PATH environment variable for node, open a terminal at the same folder where `app.js` is located.

- Execute the command `npm run setup` for downloading all the required dependencies

- Modify the `config.inc.json` located inside the `config` folder on this project, and fill up all the necessary data like database credentials and the port where the app will be listening connections.

- Run `npm run start` for start the app on production mode, or `npm run dev` for starting the app on development mode (keep in mind for this last one you have to run beforehand `npm run setupdev` for installing developement dependencies)

- Go to [http://localhost:3000/api-docs](http://localhost:3000/api-docs) where you can test all the API endpoints using Swagger.