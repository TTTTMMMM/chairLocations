// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// eslint-disable-next-line consistent-return
exports.addChairHeaders = async (req, res, admin) => {
   const theChairHeader = req.body;
   // console.log("------ JSON.stringify(theChairHeader)-----");
   let retMsg = "Return message not set in addChairHeaders handler";
   // ------------------------------------------------------
   let theCH = theChairHeader.chairHeader
      .substring(0, 20)
      .trim()
      .replace(/\s+/g, "_")
      .replace(/\/+/g, "")
      .toUpperCase();
   let thCHCapitalized = theCH;

   let aChairHeader = undefined;
   try {
      aChairHeader = await admin
         .firestore()
         .collection("chairheaders")
         .doc(thCHCapitalized)
         .get();
   } catch (err) {
      const msg = `0202 Error: Checking for existence of ${thCHCapitalized} in chairheaders collection`;
      console.log(msg);
      res.status(500).json({
         message: `${msg}`,
      });
   }
   if (!aChairHeader.exists) {
      let cHdr = {};
      cHdr.chairHeader = thCHCapitalized;
      cHdr.keep = theChairHeader.keep;
      cHdr.mandatory = theChairHeader.mandatory;
      try {
         await admin
            .firestore()
            .collection("chairheaders")
            .doc(thCHCapitalized)
            .set(cHdr);
         retMsg = `---> Added ${thCHCapitalized}.`;
      } catch (err) {
         const msg = `0201 Error: ${thCHCapitalized} couldn't be added to chairheaders collection`;
         console.log(msg);
         res.status(500).json({
            message: `${msg} \n${err}`,
         });
      }
   } else {
      retMsg = `${thCHCapitalized} already exists.`;
   }
   try {
      await firebaseApp.auth().signOut();
      console.log(`${retMsg}`);
      console.log(`Logged out`);
      res.append("Cache-Control", "no-cache, must-revalidate");
      return res.status(200).json({
         message: `${retMsg}`,
      });
   } catch (err) {
      const firstLine =
         "0195: Couldn't log user out: " + err.message.split("\n")[0];
      const errCode = err.code;
      res.status(500).render("500", { firstLine, errCode });
      console.log(`${firstLine} ${err}`);
   }
};
