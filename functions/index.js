// Server-side code follows:
const firebase = require("firebase");
const { firebaseConfig } = require("./public/lib/js/configs/firebaseconfig");

const functions = require("firebase-functions");
const express = require("express");
const engines = require("consolidate");
const admin = require("firebase-admin");
const formidableMiddleware = require("express-formidable");
const path = require("path");

// const { verifyGoogleToken,} = require("./public/lib/js/authStuff/verifyGoogleToken");
// const { addChair } = require("./public/lib/js/handlers/addChair");
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

// api.use((req, res, next) => {
//    verifyGoogleToken(req, res, next);
// });
let CURR_DIR = path.resolve(__dirname);
console.log(`CURR_DIR: ${CURR_DIR}`);

api.get("/aaa", (req, res) => {
   res.send(`
     <h2>With <code>"express"</code> npm package</h2>
     <form action="/chair" enctype="multipart/form-data" method="post">
       <div>Text field title: <input type="text" name="title" /></div>
       <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
       <input type="submit" value="Upload" />
     </form>
   `);
});

api.post("/chair", (req, res) => {
   console.log(`In chair route`);
   addChair(req, res, admin);
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
