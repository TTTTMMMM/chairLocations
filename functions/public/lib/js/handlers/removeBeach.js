// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// ----------------------------------------------------------------
// remove beach from beaches collection
// ----------------------------------------------------------------
exports.removeBeach = async (req, res, admin) => {
   if (res.locals.loggedInUser.role === "admin") {
      const theBeach = req.body;
      // validate the input!
      if (theBeach) {
         let bName = escapeHTML(
            theBeach.beach.trim().substring(0, 49).toUpperCase()
         );
         const validBeachRegex = /^[A-Z',.\- ]{3,50}$/gi;
         let valid_Beach = bName.match(validBeachRegex);
         if (valid_Beach != null) {
            let docName = valid_Beach[0].replace(/\s+/g, "");
            let beachObj = {};
            beachObj.beach = valid_Beach[0];
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
               let msg = `Removed ${beachObj.beach}`;
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
            firstLine = `0792: Invalid beach name [${theBeach.beach}]`;
            console.log(`${firstLine}`);
            return res.status(400).json({
               message: `0792:  Invalid beach name [${theBeach.beach}]`,
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
