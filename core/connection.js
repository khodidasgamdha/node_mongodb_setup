const mongoose = require("mongoose");
const chalk = require("chalk");
const { dbURI, useNewUrlParser, useUnifiedTopology } =
    require("../config/database.json")[process.env.NODE_ENV];

mongoose
    .connect(dbURI, {
        useNewUrlParser,
        useUnifiedTopology,
    })
    .then(() => {
        console.log(chalk.green("Database Connected Successfully..."));
    })
    .catch((error) => {
        console.log(chalk.yellowBright(error));
    });
