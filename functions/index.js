// Server-side code follows:
const firebase = require("firebase");
const { firebaseConfig } = require("./public/lib/js/configs/firebaseconfig");

const functions = require("firebase-functions");
const express = require("express");
const engines = require("consolidate");
const admin = require("firebase-admin");
const {
   verifyGoogleToken,
} = require("./public/lib/js/authStuff/verifyGoogleToken");
const path = require("path");

const { addChairHeaders } = require("./public/lib/js/handlers/addChairHeaders");

// const {
//    grantCustomClaims,
// } = require("./public/lib/js/handlers/grantCustomClaims");

const { addUser } = require("./public/lib/js/handlers/addUser");
const { removeUser } = require("./public/lib/js/handlers/removeUser");

const {
   getKeptChairHeaders,
} = require("./public/lib/js/handlers/getKeptChairHeaders");

const {
   updateChairHeader,
} = require("./public/lib/js/handlers/updateChairHeader");

const { addChairLoc } = require("./public/lib/js/handlers/addChairLoc");
const { addChairLoc1 } = require("./public/lib/js/handlers/addChairLoc1");

const { addBeach } = require("./public/lib/js/handlers/addBeach");
const { removeBeach } = require("./public/lib/js/handlers/removeBeach");

const { addTask } = require("./public/lib/js/handlers/addTask");
const { removeTask } = require("./public/lib/js/handlers/removeTask");
const {
   updateDateTask,
} = require("./public/lib/js/handlers/updateDateTask");

const { addChair } = require("./public/lib/js/handlers/addChair");
const { removeChair } = require("./public/lib/js/handlers/removeChair");

const { addReportEntry } = require("./public/lib/js/handlers/addReportEntry");

const { render404 } = require("./public/lib/js/renderings/render404");

// -----------------------------------------------------------------------

const api = new express();

admin.initializeApp(firebaseConfig);
firebaseApp = firebase.initializeApp(firebaseConfig);

api.engine("hbs", engines.handlebars);
api.set("views", "./views");
api.set("view engine", "hbs");

require("log-timestamp")(() => {
   return `api [${new Date().toLocaleString()}]`;
});

api.use((req, res, next) => {
   verifyGoogleToken(req, res, admin, next);
});

api.get("/users", (req, res) => {
   return res.status(200).json(res.locals.loggedInUser);
});

api.post("/users", (req, res) => {
   addUser(req, res, admin, functions);
});

api.delete("/users", (req, res) => {
   removeUser(req, res, admin);
});

// api.post("/customclaims", (req, res) => {
//    grantCustomClaims(req, res, functions, admin);
// });

api.post("/chairloc", (req, res) => {
   addChairLoc(req, res, admin);
});

// api.post("/viaAPI", (req, res) => {
//    addChairLoc1(req, res, admin);
// });

api.get("/chairheaders", (req, res) => {
   getKeptChairHeaders(req, res, admin);
});

api.post("/chairheaders", (req, res) => {
   addChairHeaders(req, res, admin);
});

api.put("/chairheaders/keep/:id", (req, res) => {
   updateChairHeader(req, res, admin);
});

api.post("/beaches", (req, res) => {
   addBeach(req, res, admin);
});

api.delete("/beaches", (req, res) => {
   removeBeach(req, res, admin);
});

api.post("/tasks", (req, res) => {
   addTask(req, res, admin);
});

api.delete("/tasks", (req, res) => {
   removeTask(req, res, admin);
});

api.put("/tasks/datecomplete/:id", (req, res) => {
   updateDateTask(req, res, admin);
});

api.delete("/chairs", (req, res) => {
   removeChair(req, res, admin);
});

api.post("/chairs", (req, res) => {
   addChair(req, res, admin);
});

api.post("/reportentry", (req, res) => {
   addReportEntry(req, res, admin);
});

api.get("*", (req, res) => {
   render404(req, res);
});

api.delete("*", (req, res) => {
   render404(req, res);
});

api.put("*", (req, res) => {
   render404(req, res);
});

api.post("*", (req, res) => {
   render404(req, res);
});

exports.api = functions.https.onRequest(api);
