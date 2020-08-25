// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// eslint-disable-next-line consistent-return
exports.updateDateTask = async (req, res, admin) => {
   //req.body looks like: {docID: "073BCF", dateAccomplished: "2020-08-14"}
   // url looks like: https://chairlocations.web.app/tasks/datecomplete/CA0564  <-- req.params.id = CA0564
   if (
      res.locals.loggedInUser.role === "admin" ||
      res.locals.loggedInUser.role === "uploader" ||
      res.locals.loggedInUser.role === "maintenance"
   ) {
      const dateObj = req.body;
      // validate the input!
      let dateDoneEsc = escapeHTML(dateObj.dateAccomplished.trim().substring(0, 10));
      const validDateRegex = /^(20)[2-9]{1}[0-9]{1}-((0[1-9]{1})|(1[0-2]{1}))-((0[1-9]{1})|([12]{1}[0-9]{1})|(3[01]{1}))$/gi;
      let valid_dateDone = dateDoneEsc.match(validDateRegex);
      if(valid_dateDone) {
         admin
         .firestore()
         .collection("tasks")
         .doc(`${req.params.id}`)
         .update({
            dateDone: valid_dateDone[0],
         })
         .then(() => {
            firebaseApp
               .auth()
               .signOut()
               .then(() => {
                  console.log(`Logged out`);
               })
               .catch((err) => {
                  const firstLine =
                     "0197: Couldn't log user out: " + err.message.split("\n")[0];
                  const errCode = err.code;
                  res.status(500).render("500", { firstLine, errCode });
                  console.log(`${firstLine} ${err}`);
               });
            console.log(`Updated task completion date for [${req.params.id}] to [${valid_dateDone[0]}]`);
            res.append("Cache-Control", "no-cache, must-revalidate");
            return res.status(200).json({
               message: `Updated task completion date for [${req.params.id}] to [${valid_dateDone[0]}]`,
            });
         })
         .catch((err) => {
            const firstLine =
               "0594: Update task completion error: " +
               err.message.split("\n")[0];
            const errCode = err.code;
            res.status(400).render("400", { firstLine, errCode });
            console.log(`${firstLine} ${err}`);
         });
      } else {
         return res.status(400).json({
            message: `0596: Invalid task completion date ${dateDoneEsc}`,
         });
      }
   } else {
      return res.status(401).json({
         message: `Not authorized: ${res.locals.loggedInUser.emailAddress} with role ${res.locals.loggedInUser.role}.`,
      });
   }
};
