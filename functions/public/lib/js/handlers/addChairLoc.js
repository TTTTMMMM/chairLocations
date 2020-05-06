// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// eslint-disable-next-line consistent-return
exports.addChairLoc = async (req, res, admin) => {
   if (res.locals.loggedInUser.canAccess.chairLocsWrite) {
      const chairLoc = req.body;
      let newChairLoc = {};
      let theAssetLabel = {};
      Object.keys(chairLoc).forEach((x) => {
         newChairLoc[x] = escapeHTML(chairLoc[x].trim().substring(0, 59));
         if (x.localeCompare("ASSETLABEL") === 0) {
            theAssetLabel[x] = newChairLoc[x];
         }
         if (x.localeCompare("FNAME") === 0) {
            theAssetLabel[x] = newChairLoc[x];
         }
         if (x.localeCompare("UPLOADFBTIME") === 0) {
            theAssetLabel[x] = newChairLoc[x];
         }
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
      return res.status(200).json({
         message: `Added ${newChairLoc.ID}`,
      });
      // try {
      //    await firebaseApp.auth().signOut();
      //    res.append("Cache-Control", "no-cache, must-revalidate");
      //    return res.status(200).json({
      //       message: `Added ${newChairLoc.ID.substr(0, 6)}... ${
      //          newChairLoc.ASSETLABEL
      //       } [${newChairLoc.BEACH}] ${newChairLoc.UPDATETIME}`,
      //    });
      // } catch (err) {
      //    const firstLine =
      //       "0195: Couldn't log user out: " + err.message.split("\n")[0];
      //    const errCode = err.code;
      //    res.status(500).render("500", { firstLine, errCode });
      //    console.log(`${firstLine} ${err}`);
      // }
   } else {
      res.status(401).json({
         message: `Not authorized ${res.locals.loggedInUser.role.toUpperCase()}`,
      });
   }
};
