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
   verifyGoogleToken(req, res, next);
});

api.get("/users", (req, res) => {
   return res.status(200).json(res.locals.loggedInUser);
});

api.post("/users", (req, res) => {
   addUser(req, res, admin);
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

api.get("/chairheaders", (req, res) => {
   getKeptChairHeaders(req, res, admin);
});

api.post("/chairheaders", (req, res) => {
   addChairHeaders(req, res, admin);
});

api.put("/chairheaders/keep/:id", (req, res) => {
   updateChairHeader(req, res, admin);
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
