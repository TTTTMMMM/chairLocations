// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// ----------------------------------------------------------------
// add Report Entry to distReport collection
// ----------------------------------------------------------------
exports.addReportEntry = async (req, res, admin) => {
   if (res.locals.loggedInUser.role === "admin") {
      const reportEntry = req.body;
      // validate the input!
      if (reportEntry) {
         let rEntryAsset = escapeHTML(
            reportEntry.asset.trim().substring(0, 16).toUpperCase()
         );
         const validAssetRegex = /^[A-Z-_\d]{3,15}$/;
         let valid_Asset = rEntryAsset.match(validAssetRegex);
         // --
         let dailyDate = escapeHTML(
            reportEntry.dailyDate.trim().substring(0, 10)
         );
         const validDailyDateRegex = /^\d{4}-\d{2}-\d{2}$/;
         let v_DD = dailyDate.match(validDailyDateRegex);
         // --
         let distObj = reportEntry.distObj;
         distObj.inFeet = distObj.inFeet > 65000000 ? 65000000 : distObj.inFeet;
         distObj.inFeet = distObj.inFeet < 1 ? 0 : distObj.inFeet;
         distObj.inMiles = distObj.inMiles > 12310 ? 12310 : distObj.inMiles;
         distObj.inMiles = distObj.inMiles < 0 ? 0 : distObj.inMiles;
         distObj.inMeters = distObj.inMeters > 12310 ? 12310 : distObj.inMeters;
         distObj.inMeters = distObj.inMeters < 1 ? 0 : distObj.inMeters;
         // --
         let period = escapeHTML(reportEntry.period.trim().substring(0, 13));
         const validPeriodRegex = /^\d{4}[a-zA-Z]{3,9}$/;
         let v_P = period.match(validPeriodRegex);
         // --
         if (valid_Asset != null && v_DD != null && v_P != null) {
            let b = [];
            b.push(valid_Asset[0]);
            b.push("_");
            b.push(v_DD[0].substring(0, 4));
            b.push(v_DD[0].substring(5, 7));
            let docName = b.join("");
            // let docName = valid_Asset
            //    .concat("_")
            //    .concat(v_DD[0].substring(0, 4))
            //    .concat(v_DD[0].substring(5, 7));
            console.log(`docName[${docName}]`);
            let reportEntryObj = {};
            reportEntryObj.assetlabel = valid_Asset[0];
            reportEntryObj.period = v_P[0];
            let dO = "d".concat(v_DD[0].substring(8, 10));
            reportEntryObj[dO] = distObj;
            try {
               await admin
                  .firestore()
                  .collection("distReport")
                  .doc(docName)
                  .update(reportEntryObj);
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
               const firstLine = `0321 Error: ${docName} couldn't be added to distReport collection`;
               console.log(`${firstLine} ${err}`);
               // res.status(500).json({
               //    message: `${msg} \n${err}`,
               // });
               res.status(500).render("500", { firstLine, errCode });
            }
         } else {
            firstLine = `0994: Invalid asset [${reportEntry.asset}] [${valid_Asset}] or dailyDate [${reportEntry.dailyDate}] [${v_DD}] or period [${reportEntry.period}] [${v_P}]`;
            console.log(`${firstLine}`);
            return res.status(400).json({
               message: `${firstLine}`,
            });
         }
      } else {
         return res
            .status(400)
            .json({ message: `0993: Invalid Report Entry object` });
      }
   } else {
      return res.status(401).json({
         message: `Not authorized: ${res.locals.loggedInUser.emailAddress} with role ${res.locals.loggedInUser.role}.`,
      });
   }
};
