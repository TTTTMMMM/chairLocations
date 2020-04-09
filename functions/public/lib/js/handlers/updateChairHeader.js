// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// eslint-disable-next-line consistent-return
exports.updateChairHeader = async (req, res, admin) => {
   //req.body looks like: {chairhdr: "CellAccuracy", keep: false}
   // url looks like: https://chairlocations.web.app/chairheaders/keep/CellAccuracy  <-- req.params.id = CellAccuracy
   const keepItObj = req.body;
   let keepIt = true;
   keepIt = !keepItObj.keep ? false : true;
   admin
      .firestore()
      .collection("chairheaders")
      .doc(`${req.params.id}`)
      .update({
         keep: keepIt,
      })
      .then(() => {
         firebaseApp
            .auth()
            .signOut()
            .then(() => {
               console.log(`Logged out`);
            })
            .catch((err) => {
               const firstLine =
                  "0197: Couldn't log user out: " + err.message.split("\n")[0];
               const errCode = err.code;
               res.status(500).render("500", { firstLine, errCode });
               console.log(`${firstLine} ${err}`);
            });
         console.log(`Updated keep choice of <${req.params.id}>`);
         res.append("Cache-Control", "no-cache, must-revalidate");
         return res.status(200).json({
            message: `Successfully updated choice for keeping ${req.params.id} to ${keepIt}`,
         });
      })
      .catch((err) => {
         const firstLine =
            "0193: Update keep choice of chair headers error: " +
            err.message.split("\n")[0];
         const errCode = err.code;
         res.status(400).render("400", { firstLine, errCode });
         console.log(`${firstLine} ${err}`);
      });
};
