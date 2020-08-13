// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// ----------------------------------------------------------------
// remove task from tasks collection
// ----------------------------------------------------------------
exports.removeTask = async (req, res, admin) => {
   if (res.locals.loggedInUser.role === "admin") {
      const theBeach = req.body;
      // validate the input!
      if (theBeach) {
         let bName = escapeHTML(
            theBeach.beach.trim().substring(0, 59).toUpperCase()
         );
         const validBeachRegex = /^[A-Z_39'&#;,.\- \(\)]{3,50}$/gi;
         let valid_Beach = bName.match(validBeachRegex);
         if (valid_Beach != null) {
            let docName = valid_Beach[0]
               .replace(/\s+/g, "")
               .replace("&amp;", "&")
               .replace("&AMP;", "&")
               .replace("&#39;", "'");
            try {
               await admin
                  .firestore()
                  .collection("beaches")
                  .doc(docName)
                  .delete();
            } catch (err) {
               let msg = `Error removing beach ${docName}: ${err.code}`;
               console.log(msg);
               return res.status(400).json({
                  message: `${msg}`,
               });
            }
            try {
               await firebaseApp.auth().signOut();
               let msg = `Removed ${docName}`;
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
            firstLine = `0792: Invalid beach name [${docName}]`;
            console.log(`${firstLine}`);
            return res.status(400).json({
               message: `0792:  Invalid beach name [${docName}]`,
            });
         }
      } else {
         return res.status(400).json({ message: `0791: Invalid beach` });
      }
   } else {
      return res.status(401).json({
         message: `Not authorized: ${res.locals.loggedInUser.emailAddress} with role ${res.locals.loggedInUser.role}.`,
      });
   }
};
