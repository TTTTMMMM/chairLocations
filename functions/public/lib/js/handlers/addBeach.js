// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");
const {
   addUsernameToValidUsers,
} = require("./helpers/addUsernameToValidUsers");

// ----------------------------------------------------------------
// add beach to beaches collection
// ----------------------------------------------------------------
exports.addBeach = async (req, res, admin) => {
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
                  .set(beachObj);
               try {
                  await firebaseApp.auth().signOut();
                  let msg = `Added ${beachObj.beach}`;
                  console.log(msg);
                  console.log(`Logged out`);
                  res.append("Cache-Control", "no-cache, must-revalidate");
                  return res.status(200).json({
                     message: `${msg}`,
                  });
               } catch (err) {
                  const firstLine =
                     "0195: Couldn't log user out: " +
                     err.message.split("\n")[0];
                  const errCode = err.code;
                  res.status(500).render("500", { firstLine, errCode });
                  console.log(`${firstLine} ${err}`);
               }
            } catch (err) {
               const msg = `0221 Error: ${docName} couldn't be added to beaches collection`;
               console.log(msg);
               res.status(500).json({
                  message: `${msg} \n${err}`,
               });
            }
         } else {
            firstLine = `0794: Invalid beach name [${theBeach.beach}]`;
            console.log(`${firstLine}`);
            return res.status(400).json({
               message: `0794:  Invalid beach name [${theBeach.beach}]`,
            });
         }
      } else {
         return res.status(400).json({ message: `0793: Invalid beach` });
      }
   } else {
      return res.status(401).json({
         message: `Not authorized: ${res.locals.loggedInUser.emailAddress} with role ${res.locals.loggedInUser.role}.`,
      });
   }
};
