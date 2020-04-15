// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// eslint-disable-next-line consistent-return
exports.addChairLoc = async (req, res, admin) => {
   const chairLoc = req.body;
   let newChairLoc = {};
   Object.keys(chairLoc).forEach((x) => {
      newChairLoc[x] = escapeHTML(chairLoc[x].trim().substring(0, 64));
   });
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
   try {
      await firebaseApp.auth().signOut();
      console.log(
         `Added ${newChairLoc.ID.substr(0, 6)}... ${newChairLoc.ASSETLABEL} [${
            newChairLoc.BEACH
         }] ${newChairLoc.UPDATETIME}`
      );
      console.log(`Logged out`);
      res.append("Cache-Control", "no-cache, must-revalidate");
      return res.status(200).json({
         message: `Added ${newChairLoc.ID.substr(0, 6)}... ${
            newChairLoc.ASSETLABEL
         } [${newChairLoc.BEACH}] ${newChairLoc.UPDATETIME}`,
      });
   } catch (err) {
      const firstLine =
         "0195: Couldn't log user out: " + err.message.split("\n")[0];
      const errCode = err.code;
      res.status(500).render("500", { firstLine, errCode });
      console.log(`${firstLine} ${err}`);
   }
};
