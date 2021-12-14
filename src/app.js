require("dotenv").config();
global.setup = {};
require("../core/connection");
require("../core/function");
require("../core/services");
require("../config/multer");
const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const path = require("path");
const Confirm = require("prompt-confirm");
const fp = require("find-free-port");
const routes = require("../core/routes");
const crons = require("../core/cron");
const config = require("../config/config.json");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// logging
let morganBody = "";
const { allowBody, allowHeaders } = config;

morgan.token("header", (req) => JSON.stringify(req.headers));
morgan.token("body", (req) => Object.keys(req.body).length == 0 ? "" : JSON.stringify(req.body));

if (allowBody && allowHeaders) {
    morganBody = ':remote-addr - ":method :url HTTP/:http-version" :status :res[content-length] [:date[clf]] :body :header ';
} else if (allowBody || allowHeaders) {
    morganBody = `:remote-addr - ":method :url HTTP/:http-version" :status :res[content-length] [:date[clf]] ${allowBody ? ":body" : ":header"}`;
} else {
    morganBody = ':remote-addr - ":method :url HTTP/:http-version" :status :res[content-length] [:date[clf]]';
}

// create a write stream (in append mode)
var logStream = fs.createWriteStream(path.join(__dirname, "..", "app.log"), {
    flags: "a",
});

// log details
app.use(morgan(morganBody, { stream: logStream }));

// Crons
app.use((req, res, next) => {
    crons.forEach((cron) => {
        cron();
    });
    next();
});

// Routes
for (let route of routes) {
    app[route.method](route.path, route.middlewares, route.action);
}

// If no routes was matched show 404 not found error
app.use((req, res, next) => {
    const error = new Error("Page Not Found");
    error.statusCode = 404;
    next(error);
});

// Express Error Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).json({
        error: message,
    });
});

let PORT = parseInt(process.env.PORT);

// check for free port if existing port is in use
process.on("uncaughtException", (error) => {
    if (error.code === "EADDRINUSE") {
        fp(PORT).then(([freep]) => {
            new Confirm(
                `Port no ${PORT} is busy.Do you want to run it on the avalibale port (${freep})?`
            )
                .run()
                .then((answer) => {
                    if (answer) {
                        PORT = parseInt(freep);
                        listenServer();
                    } else {
                        process.exit();
                    }
                });
        });
    }
});

// listen server
const listenServer = () => {
    app.listen(PORT, () => {
        console.log(
            "🚀 Server listenining at " + chalk.blue(`http://127.0.0.1:${PORT}`)
        );
    });
};

listenServer()
