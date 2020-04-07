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

const { addTableHeaders } = require("./public/lib/js/handlers/addTableHeaders");
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

api.post("/chair", (req, res) => {
   console.log(`In chair route, but addChair handler is not complete...`);
   addChair(req, res, admin);
});

api.post("/tableheaders", (req, res) => {
   addTableHeaders(req, res, admin);
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
