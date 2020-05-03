// Server-side code follows:
var escapeHTML = require("escape-html");
var util = require("util");

// eslint-disable-next-line consistent-return
exports.getKeptChairHeaders = async (req, res, admin) => {
   firebaseApp
      .firestore()
      .collection("chairheaders")
      .where("keep", "==", true)
      .get()
      .then((data) => {
         let keptProps = [];
         data.forEach((doc) => {
            keptProps.push({
               propID: doc.id,
               chairHeader: doc.data().chairHeader,
            });
         });
         firebaseApp
            .auth()
            .signOut()
            .then(() => {
               console.log(`Logged out`);
            })
            .catch((err) => {
               const firstLine =
                  "0231: Couldn't log user out: " + err.message.split("\n")[0];
               const errCode = err.code;
               res.status(500).render("500", { firstLine, errCode });
               console.log(`${firstLine} ${err}`);
            });
         console.log("Got kept chairheaders");
         res.append(
            "Cache-Control",
            "no-cache, private, max-age=2, s-maxage=2, must-revalidate"
         );
         return res.status(200).json(keptProps);
      })
      .catch((err) => {
         const firstLine = "0197: Query Error: " + err.message.split("\n")[0];
         const errCode = err.code;
         res.status(500).render("500", { firstLine, errCode });
         console.log(`${firstLine} ${err}`);
      });
};
