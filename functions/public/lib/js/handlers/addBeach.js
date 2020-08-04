// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// ----------------------------------------------------------------
// add beach to beaches collection
// ----------------------------------------------------------------
exports.addBeach = async (req, res, admin) => {
   if (res.locals.loggedInUser.role === "admin") {
      const theBeach = req.body;
      // validate the input!
      if (theBeach) {
         let bName = escapeHTML(
            theBeach.beach.trim().substring(0, 59).toUpperCase()
         );
         const validBeachRegex = /^[A-Z39'&#;,.\- \(\)]{3,50}$/gi;
         let valid_Beach = bName.match(validBeachRegex);
         let raName = escapeHTML(
            theBeach.rentalagent.trim().substring(0, 59).toUpperCase()
         );
         const validRentalAgentRegex = /^[A-Z0-9'&#;,.\- \(\)]{3,50}$/gi;
         let valid_RentalAgent = raName.match(validRentalAgentRegex);
         if (valid_Beach != null && valid_RentalAgent != null) {
            let beachPart = valid_Beach[0]
               .replace(/\s+/g, "")
               .replace("&amp;", "&")
               .replace("&AMP;", "&")
               .replace("&#39;", "'"); // eliminate whitespace and correct for ampersand and apostrophe
            let rentalAgentPart = valid_RentalAgent[0]
               .replace(/\s+/g, "")
               .replace("&amp;", "&")
               .replace("&AMP;", "&")
               .replace("&#39;", "'"); // eliminate whitespace and correct for ampersand and apostrophe
            let docName = rentalAgentPart.concat("_").concat(beachPart);
            let beachField = valid_Beach[0]
               .replace("&amp;", "&")
               .replace("&AMP;", "&")
               .replace("&#39;", "'");
            let rentalAgentField = valid_RentalAgent[0]
               .replace("&amp;", "&")
               .replace("&AMP;", "&")
               .replace("&#39;", "'");
            let beachObj = {};
            beachObj.beach = beachField;
            beachObj.rentalagent = rentalAgentField;
            try {
               await admin
                  .firestore()
                  .collection("beaches")
                  .doc(docName)
                  .set(beachObj);
               try {
                  await firebaseApp.auth().signOut();
                  let msg = `Added ${docName}`;
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
            firstLine = `0794: Invalid beach name [${theBeach.beach}] [${
               bName.match(validBeachRegex)[0]
            }] or rental agent [${theBeach.rentalagent}] [${raName.match(
               validRentalAgentRegex[0]
            )}]`;
            console.log(`${firstLine}`);
            return res.status(400).json({
               message: `${firstLine}`,
            });
         }
      } else {
         return res
            .status(400)
            .json({ message: `0793: Invalid beach/rental object` });
      }
   } else {
      return res.status(401).json({
         message: `Not authorized: ${res.locals.loggedInUser.emailAddress} with role ${res.locals.loggedInUser.role}.`,
      });
   }
};
