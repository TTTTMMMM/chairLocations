// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// ----------------------------------------------------------------
// add chair to chairs collection
// ----------------------------------------------------------------
exports.addChair = async (req, res, admin) => {
   if (res.locals.loggedInUser.role === "admin") {
      const theChair = req.body;
      // validate the input!
      if (theChair) {
         let cName = escapeHTML(
            theChair.chair.trim().substring(0, 11).toUpperCase()
         );
         const validChairRegex = /^[A-Z0-9_\-]{7,11}$/;
         let valid_Chair = cName.match(validChairRegex);
         let raName = escapeHTML(
            theChair.rentalagent.trim().substring(0, 59).toUpperCase()
         );
         const validRentalAgentRegex = /^[A-Z0-9'&#;,.\- \(\)]{3,50}$/gi;
         let valid_RentalAgent = raName.match(validRentalAgentRegex);
         let created = escapeHTML(theChair.created.trim().substring(0, 10));
         const validCreatedRegex = /^[0-9\-]{10}$/gi;
         let valid_Created = created.match(validCreatedRegex);
         if (
            valid_Chair != null &&
            valid_RentalAgent != null &&
            valid_Created != null
         ) {
            let docName = valid_Chair[0];
            let chairField = valid_Chair[0];
            let rentalAgentField = valid_RentalAgent[0]
               .replace("&amp;", "&")
               .replace("&AMP;", "&")
               .replace("&#39;", "'"); // eliminate whitespace and correct for ampersand and apostrophe
            let chairObj = {};
            chairObj.chair = chairField;
            chairObj.rentalagent = rentalAgentField;
            chairObj.created = valid_Created[0];
            try {
               await admin
                  .firestore()
                  .collection("chairDeployments")
                  .doc(docName)
                  .set(chairObj);
               try {
                  await firebaseApp.auth().signOut();
                  let msg = `Added ${docName} to 'chairDeployments'`;
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
               const msg = `0421 Error: ${docName} couldn't be added to 'chairDeployments' collection`;
               console.log(msg);
               res.status(500).json({
                  message: `${msg} \n${err}`,
               });
            }
         } else {
            firstLine = `0494: Invalid chair label [${theChair.chair}] [${
               cName.match(validChairRegex)[0]
            }] or rental agent [${theChair.rentalagent}] [${raName.match(
               validRentalAgentRegex[0]
            )}] or
               creation date [${theChair.created}]
            `;
            console.log(`${firstLine}`);
            return res.status(400).json({
               message: `${firstLine}`,
            });
         }
      } else {
         return res
            .status(400)
            .json({ message: `0493: Invalid chair/rental object` });
      }
   } else {
      return res.status(401).json({
         message: `Not authorized: ${res.locals.loggedInUser.emailAddress} with role ${res.locals.loggedInUser.role}.`,
      });
   }
};
