// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// eslint-disable-next-line consistent-return
exports.addTableHeaders = async (req, res, admin) => {
   let theReqKeys = Object.keys(req);
   const theTableHeader = req.body;
   // console.log("------ JSON.stringify(theTableHeader)-----");
   let retMsg = "Return message not set in addTableHeaders handler";
   // ------------------------------------------------------
   let theTH = theTableHeader.tableHeader
      .substring(0, 20)
      .trim()
      .replace(/\s+/g, "_")
      .replace(/\/+/g, "");
   let thTHCapitalized = theTH.charAt(0).toUpperCase() + theTH.slice(1);

   let aTableHeader = undefined;
   try {
      aTableHeader = await admin
         .firestore()
         .collection("tableheaders")
         .doc(thTHCapitalized)
         .get();
   } catch (err) {
      const msg = `0202 Error: Checking for existence of ${thTHCapitalized} in tableheaders collection`;
      console.log(msg);
      res.status(500).json({
         message: `${msg}`,
      });
   }
   if (!aTableHeader.exists) {
      let keepObj = (({ keep }) => ({ keep }))(theTableHeader); // destructure req.body to keep only the "keep" key
      try {
         await admin
            .firestore()
            .collection("tableheaders")
            .doc(thTHCapitalized)
            .set(keepObj);
         retMsg = `Added tableHeader ${thTHCapitalized}`;
      } catch (err) {
         const msg = `0201 Error: ${thTHCapitalized} couldn't be added to tableheaders collection`;
         console.log(msg);
         res.status(500).json({
            message: `${msg} \n${err}`,
         });
      }
   } else {
      retMsg = `${thTHCapitalized} already exists, so not added.`;
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
