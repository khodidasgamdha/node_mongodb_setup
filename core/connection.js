const mongoose = require("mongoose");
const chalk = require("chalk");
const { 
    dbURI, 
    useNewUrlParser, 
    useUnifiedTopology 
} = require("../config/database.json")[process.env.NODE_ENV];

mongoose
    .connect(dbURI, {
        useNewUrlParser,
        useUnifiedTopology,
    })
    .then(() => {
        console.log(chalk.green("Databse Connection Successful"));
    })
    .catch((err) => {
        console.log(chalk.yellowBright(err));
    });
