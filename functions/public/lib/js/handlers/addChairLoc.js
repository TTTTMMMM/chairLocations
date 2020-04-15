// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");
// const { addChairToChairs } = require("./helpers/addChairToChairs");

// eslint-disable-next-line consistent-return
exports.addChairLoc = async (req, res, admin) => {
   const chairLoc = req.body;
   // let uChair = escapeHTML(theChair.trim().substring(0, 100000).toLowerCase());
   // const validChairRegex = /^[ a-z0-9._-]$/gi;
   // let valid_uChair = uChair.match(validChairRegex);
   // if (valid_uChair !== null) {
   try {
      await admin
         .firestore()
         .collection("chairLocs")
         .doc(chairLoc.ID)
         .set(chairLoc);
   } catch (err) {
      const firstLine =
         "0194: Adding chairLoc error: " + err.message.split("\n")[0];
      const errCode = err.code;
      res.status(500).render("500", { firstLine, errCode });
      console.log(`${firstLine} ${err}`);
   }
   try {
      await firebaseApp.auth().signOut();
      console.log(`Added ${chairLoc.ID} ${chairLoc.ASSETLABEL}`);
      console.log(`Logged out`);
      res.append("Cache-Control", "no-cache, must-revalidate");
      return res.status(200).json({
         message: `Successfully added ${chairLoc.ID} ${chairLoc.ASSETLABEL}`,
      });
   } catch (err) {
      const firstLine =
         "0195: Couldn't log user out: " + err.message.split("\n")[0];
      const errCode = err.code;
      res.status(500).render("500", { firstLine, errCode });
      console.log(`${firstLine} ${err}`);
   }
};
