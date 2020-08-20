// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// ----------------------------------------------------------------
// remove task from tasks collection
// ----------------------------------------------------------------
exports.removeTask = async (req, res, admin) => {
   if (
      res.locals.loggedInUser.role === "admin" ||
      res.locals.loggedInUser.role === "uploader"
   ) {
      const theTask = req.body;
      // validate the input!
      if (theTask) {
         let docID = escapeHTML(
            theTask.docID.trim().substring(0, 6).toUpperCase()
         );
         const validDocIDRegex = /^T{0,1}[A-F0-9]{5,6}$/gi;
         let valid_docID = docID.match(validDocIDRegex);
         if (valid_docID != null) {
            let docName = valid_docID[0];
            try {
               await admin
                  .firestore()
                  .collection("tasks")
                  .doc(docName)
                  .delete();
            } catch (err) {
               let msg = `Error removing task ${docName}: ${err.code}`;
               console.log(msg);
               return res.status(400).json({
                  message: `${msg}`,
               });
            }
            try {
               await firebaseApp.auth().signOut();
               let msg = `Removed task with docID: ${docName}`;
               console.log(msg);
               console.log(`Logged out`);
               res.append("Cache-Control", "no-cache, must-revalidate");
               return res.status(200).json({
                  message: `${msg}`,
               });
            } catch (err) {
               const firstLine =
                  "0195: Couldn't log user out: " + err.message.split("\n")[0];
               const errCode = err.code;
               res.status(500).render("500", { firstLine, errCode });
               console.log(`${firstLine} ${err}`);
            }
         } else {
            firstLine = `0753: Invalid task [${docName}]`;
            console.log(`${firstLine}`);
            return res.status(400).json({
               message: `0753:  Invalid task [${docName}]`,
            });
         }
      } else {
         return res.status(400).json({ message: `0754: Invalid task` });
      }
   } else {
      return res.status(401).json({
         message: `Not authorized: ${res.locals.loggedInUser.emailAddress} with role ${res.locals.loggedInUser.role}.`,
      });
   }
};
