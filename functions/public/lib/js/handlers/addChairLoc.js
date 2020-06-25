// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// eslint-disable-next-line consistent-return
exports.addChairLoc = async (req, res, admin) => {
   if (res.locals.loggedInUser.canAccess.chairLocsWrite) {
      const chairLoc = req.body;
      let newChairLoc = {};
      let theAssetLabel = {};
      let theRentalAgent = {};
      // perform data validation on input
      Object.keys(chairLoc).forEach((x) => {
         newChairLoc[x] = escapeHTML(chairLoc[x].trim().substring(0, 59));
      });
      // grab the assetlabel field to eventually store in the "uniqueAssetLabels" collection
      // grab the rentalagent field to eventually store in the "uniqueRentalAgents" collection
      const { ASSETLABEL, FNAME, UPLOADFBTIME, RENTALAGENT } = newChairLoc;
      theAssetLabel = { ASSETLABEL, FNAME, UPLOADFBTIME };
      theRentalAgent = { RENTALAGENT, FNAME, UPLOADFBTIME };
      // store the chair location data into  "chairLocs" collection
      try {
         await admin
            .firestore()
            .collection("chairLocs")
            .doc(newChairLoc.ID)
            .set(newChairLoc);
      } catch (err) {
         const firstLine =
            "0194: Adding chairLoc error: " + err.message.split("\n")[0];
         const errCode = err.code;
         res.status(500).render("500", { firstLine, errCode });
         console.log(`${firstLine} ${err}`);
      }
      // if this asset label does not already exist, then store it in "uniqueAssetLabels"
      try {
         const theAsset = await admin
            .firestore()
            .collection("uniqueAssetLabels")
            .get(theAssetLabel.ASSETLABEL);
         if (!theAsset.exists) {
            try {
               await admin
                  .firestore()
                  .collection("uniqueAssetLabels")
                  .doc(theAssetLabel.ASSETLABEL)
                  .set(theAssetLabel);
            } catch (error) {
               console.log(
                  `0191: Problem trying to add ${JSON.stringify(theAssetLabel)}`
               );
               retRes.errCode = 6;
               return retRes;
            }
         }
      } catch (err) {
         const firstLine = `0192: Checking existence of ${theAssetLabel} in 'uniqueAssetLabels' collection error: ${
            err.message.split("\n")[0]
         }`;
         const errCode = err.code;
         res.status(500).render("500", { firstLine, errCode });
         console.log(`${firstLine} ${err}`);
      }
      // if this rentalagent does not already exist, then store it in "uniquerentalagents"
      let rentalAgent = theRentalAgent.RENTALAGENT.replace("&amp;", "&")
         .replace("&AMP;", "&")
         .replace("&#39;", "'"); // correct for ampersand and apostrophe
      theRentalAgent.RENTALAGENT = rentalAgent;
      try {
         const theRental = await admin
            .firestore()
            .collection("uniqueRentalAgents")
            .get(rentalAgent);
         if (!theRental.exists) {
            try {
               await admin
                  .firestore()
                  .collection("uniqueRentalAgents")
                  .doc(theRentalAgent.RENTALAGENT)
                  .set(theRentalAgent);
            } catch (error) {
               console.log(
                  `0171: Problem trying to add ${JSON.stringify(
                     theRentalAgent
                  )}`
               );
               retRes.errCode = 6;
               return retRes;
            }
         }
      } catch (err) {
         const firstLine = `0172: Checking existence of ${theRentalAgent} in 'uniqueRentalAgents' collection error: ${
            err.message.split("\n")[0]
         }`;
         const errCode = err.code;
         res.status(500).render("500", { firstLine, errCode });
         console.log(`${firstLine} ${err}`);
      }
      return res.status(200).json({
         message: `Added ${newChairLoc.ID}`,
      });
   } else {
      res.status(401).json({
         message: `Not authorized ${res.locals.loggedInUser.role.toUpperCase()}`,
      });
   }
};
