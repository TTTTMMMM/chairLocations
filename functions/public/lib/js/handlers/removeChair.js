// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// ----------------------------------------------------------------
// remove chair from chairs collection
// ----------------------------------------------------------------
exports.removeChair = async (req, res, admin) => {
   if (res.locals.loggedInUser.role === "admin") {
      const theChair = req.body;
      // validate the input!
      if (theChair) {
         let cLabel = escapeHTML(
            theChair.chair.trim().substring(0, 16).toUpperCase()
         ).toUpperCase();
         const validChairRegex = /^[A-Z0-9 _'\-]{3,15}$/;
         let valid_Chair = cLabel.match(validChairRegex);
         if (valid_Chair != null) {
            let docName = valid_Chair[0];
            try {
               await admin
                  .firestore()
                  .collection("chairDeployments")
                  .doc(docName)
                  .delete();
            } catch (err) {
               let msg = `Error removing chair ${docName}: ${err.code}`;
               console.log(msg);
               return res.status(400).json({
                  message: `${msg}`,
               });
            }
            try {
               await firebaseApp.auth().signOut();
               let msg = `Removed ${docName} from 'chairDeployments' collection`;
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
            firstLine = `0492: Invalid chair label [${cLabel}]`;
            console.log(`${firstLine}`);
            return res.status(400).json({
               message: `0492:  Invalid chair label [${cLabel}]`,
            });
         }
      } else {
         return res
            .status(400)
            .json({ message: `0491: Invalid chair label [${theChair}]` });
      }
   } else {
      return res.status(401).json({
         message: `Not authorized: ${res.locals.loggedInUser.emailAddress} with role ${res.locals.loggedInUser.role}.`,
      });
   }
};
